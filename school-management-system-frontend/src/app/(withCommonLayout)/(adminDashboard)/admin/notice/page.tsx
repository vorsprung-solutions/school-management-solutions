"use client";

import { useCallback, useState, useMemo } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, Trash2, RefreshCw, Edit, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import {
  useDeleteNoticeByIdMutation,
  useGetAllNoticeByDomainQuery,
} from "@/redux/features/admin/adminApi";
import useDomain from "@/hooks/useDomain";
import Swal from "sweetalert2";
import Link from "next/link";
import { INotice } from "@/types/notice";

export default function AllNotice() {
  const domain = useDomain();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // You can make this configurable

  const {
    data: noticeData,
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useGetAllNoticeByDomainQuery(domain, {
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
  });

  const [deleteNotice, { isLoading: isDeleting }] =
    useDeleteNoticeByIdMutation();

  const notices = noticeData?.data || [];

  // Priority badge styling function
  const getPriorityBadge = (priority?: string) => {
    switch (priority?.toLowerCase()) {
      case 'high':
        return <Badge className="bg-red-100 text-red-800 border-red-200">High</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Medium</Badge>;
      case 'low':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Low</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800 border-gray-200">Normal</Badge>;
    }
  };

  // Pagination logic
  const totalPages = Math.ceil(notices.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentNotices = notices.slice(startIndex, endIndex);

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top of table
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = useCallback(
    (id: string) => {
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Yes, delete it!",
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            await deleteNotice(id).unwrap();
            Swal.fire({
              title: "Deleted!",
              text: "The notice has been deleted.",
              icon: "success",
              timer: 1500,
              showConfirmButton: false,
            });
            // Reset to first page if current page becomes empty
            if (currentNotices.length === 1 && currentPage > 1) {
              setCurrentPage(currentPage - 1);
            }
          } catch (error) {
            Swal.fire({
              title: "Error!",
              text: "Failed to delete notice. Please try again.",
              icon: "error",
            });
            console.error("Delete error:", error);
          }
        }
      });
    },
    [deleteNotice, currentNotices.length, currentPage]
  );

  const handleRetry = useCallback(() => {
    refetch();
  }, [refetch]);

  // Reset to first page when data changes
  useMemo(() => {
    if (notices.length > 0 && currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [notices.length, currentPage, totalPages]);

  return (
    <div className="w-full min-h-screen space-y-6 px-7">
      <div className="flex flex-col items-center justify-between gap-4 px-6 py-6 sm:flex-row">
        <h2 className="text-3xl font-bold">All Notice</h2>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2 bg-transparent">
            <Link href="/admin/notice/create">Create Notice</Link>
          </Button>
          <Button
            variant="outline"
            onClick={handleRetry}
            disabled={isLoading || isFetching}
            className="gap-2 bg-transparent"
          >
            <RefreshCw
              className={`h-4 w-4 ${
                isLoading || isFetching ? "animate-spin" : ""
              }`}
            />
            Refresh
          </Button>
        </div>
      </div>

      {isLoading && (
        <div className="px-6">
          <LoadingNoticeTable />
        </div>
      )}

      {!isLoading && !isError && (
        <div className="w-full">
          <div className="min-w-full rounded-lg border bg-card mx-6">
            <Table>
              <TableCaption>
                {notices.length > 0
                  ? `Showing ${startIndex + 1}-${Math.min(endIndex, notices.length)} of ${notices.length} notice${
                      notices.length === 1 ? "" : "s"
                    }`
                  : "No notices available"}
              </TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px] text-center">No.</TableHead>
                  <TableHead className="text-center">Notice Image</TableHead>
                  <TableHead className="text-center">Title</TableHead>
                  <TableHead className="text-center">Description</TableHead>
                  <TableHead className="text-center">Priority</TableHead>
                  <TableHead className="text-center w-[120px]">
                    Action
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentNotices.length > 0 ? (
                  currentNotices.map((notice: INotice, index: number) => (
                    <TableRow key={notice._id} className="hover:bg-muted/50">
                      <TableCell className="text-center font-medium">
                        {startIndex + index + 1}
                      </TableCell>
                      <TableCell className="flex justify-center py-4">
                        <div className="relative h-32 w-64 overflow-hidden rounded-lg shadow-lg transition-all hover:scale-105 hover:shadow-xl">
                          <Image
                            src={
                              notice.image ||
                              "/placeholder.svg?height=128&width=256&query=notice placeholder"
                            }
                            alt={notice.title || `notice ${startIndex + index + 1}`}
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                            className="object-cover"
                            priority={index < 3}
                          />
                        </div>
                      </TableCell>
                      <TableCell className="text-center font-medium max-w-xs truncate">
                        {notice?.title || "No title"}
                      </TableCell>
                      <TableCell className="text-center text-sm text-muted-foreground max-w-xs truncate">
                        {notice?.description || "No description"}
                      </TableCell>
                      <TableCell className="text-center">
                        {getPriorityBadge(notice?.priority)}
                      </TableCell>
                      <TableCell className="text-center">
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-2 mr-2"
                        >
                          <Link
                            href={`/admin/notice/${notice?._id}`}
                            className="flex items-center gap-1 justify-center"
                          >
                            <Edit className="h-4 w-4" />
                            <span className="sr-only sm:not-sr-only">Edit</span>
                          </Link>
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(notice?._id)}
                          disabled={isDeleting}
                          className="gap-2 hover:bg-destructive/90 mr-4"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only sm:not-sr-only">Delete</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="h-32 text-center text-muted-foreground"
                    >
                      <div className="flex flex-col items-center gap-2">
                        <AlertCircle className="h-8 w-8 text-muted-foreground/50" />
                        <span>
                          No notice found. Add some notices to see them here.
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4">
              <div className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
              </div>
              
              <div className="flex items-center space-x-2">
                {/* First Page */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(1)}
                  disabled={currentPage === 1}
                  className="h-8 w-8 p-0"
                >
                  <ChevronsLeft className="h-4 w-4" />
                </Button>
                
                {/* Previous Page */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="h-8 w-8 p-0"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>

                {/* Page Numbers */}
                <div className="flex items-center space-x-1">
                  {getPageNumbers().map((page, index) => (
                    <div key={index}>
                      {page === '...' ? (
                        <span className="px-2 py-1 text-muted-foreground">...</span>
                      ) : (
                        <Button
                          variant={currentPage === page ? "default" : "outline"}
                          size="sm"
                          onClick={() => handlePageChange(page as number)}
                          className="h-8 w-8 p-0"
                        >
                          {page}
                        </Button>
                      )}
                    </div>
                  ))}
                </div>

                {/* Next Page */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="h-8 w-8 p-0"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>

                {/* Last Page */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(totalPages)}
                  disabled={currentPage === totalPages}
                  className="h-8 w-8 p-0"
                >
                  <ChevronsRight className="h-4 w-4" />
                </Button>
              </div>

              <div className="text-sm text-muted-foreground">
                {itemsPerPage} per page
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const LoadingNoticeTable = () => (
  <div className="w-full overflow-x-auto">
    <div className="min-w-full rounded-lg border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[80px] text-center">No.</TableHead>
            <TableHead className="text-center">Notice Image</TableHead>
            <TableHead className="text-center">Title</TableHead>
            <TableHead className="text-center">Description</TableHead>
            <TableHead className="text-center">Priority</TableHead>
            <TableHead className="w-[120px] text-center">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 4 }).map((_, index) => (
            <TableRow key={index}>
              <TableCell className="text-center">
                <Skeleton className="h-6 w-8 rounded-md mx-auto" />
              </TableCell>
              <TableCell>
                <div className="flex justify-center py-4">
                  <Skeleton className="h-32 w-64 rounded-lg" />
                </div>
              </TableCell>
              <TableCell className="text-center">
                <Skeleton className="h-6 w-32 rounded-md mx-auto" />
              </TableCell>
              <TableCell className="text-center">
                <Skeleton className="h-6 w-48 rounded-md mx-auto" />
              </TableCell>
              <TableCell className="text-center">
                <Skeleton className="h-6 w-16 rounded-md mx-auto" />
              </TableCell>
              <TableCell className="text-center">
                <Skeleton className="h-9 w-20 rounded-md mx-auto" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  </div>
);


