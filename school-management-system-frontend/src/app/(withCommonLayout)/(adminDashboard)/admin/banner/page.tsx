"use client";

import { useCallback } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
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
import { AlertCircle, Trash2, RefreshCw, Edit } from "lucide-react";
import {
  useDeleteBannerByIdMutation,
  useGetAllBannerByDomainQuery,
} from "@/redux/features/admin/adminApi";
import useDomain from "@/hooks/useDomain";
import Swal from "sweetalert2";
import { IBanner } from "@/types/banner";
import Link from "next/link";

export default function AllBanner() {
  const domain = useDomain();
  const {
    data: bannerData,
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useGetAllBannerByDomainQuery(domain, {
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
  });

  const [deleteBanner, { isLoading: isDeleting }] =
    useDeleteBannerByIdMutation();

  const banners = bannerData?.data || [];

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
            await deleteBanner(id).unwrap();
            Swal.fire({
              title: "Deleted!",
              text: "The banner has been deleted.",
              icon: "success",
              timer: 1500,
              showConfirmButton: false,
            });
          } catch (error) {
            Swal.fire({
              title: "Error!",
              text: "Failed to delete banner. Please try again.",
              icon: "error",
            });
            console.error("Delete error:", error);
          }
        }
      });
    },
    [deleteBanner]
  );

  const handleRetry = useCallback(() => {
    refetch();
  }, [refetch]);

  return (
    <div className="w-full min-h-screen space-y-6 px-7">
      <div className="flex flex-col items-center justify-between gap-4 px-6 py-6 sm:flex-row">
        <h2 className="text-3xl font-bold">All Banners</h2>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2 bg-transparent">
            <Link href="/admin/banner/create">Create Banner</Link>
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
          <LoadingBannerTable />
        </div>
      )}

      {!isLoading && !isError && (
        <div className="w-full ">
          <div className="min-w-full rounded-lg border bg-card mx-6">
            <Table>
              <TableCaption>
                {banners.length > 0
                  ? `Showing ${banners.length} banner${
                      banners.length === 1 ? "" : "s"
                    }`
                  : "No banners available"}
              </TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px] text-center">No.</TableHead>
                  <TableHead className="text-center">Banner Image</TableHead>
                  <TableHead className="text-center">Title</TableHead>
                  <TableHead className="text-center">Description</TableHead>
                  <TableHead className="text-center w-[120px]">
                    Action
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {banners.length > 0 ? (
                  banners.map((banner: IBanner, index: number) => (
                    <TableRow key={banner._id} className="hover:bg-muted/50">
                      <TableCell className="text-center font-medium">
                        {index + 1}
                      </TableCell>
                      <TableCell className="flex justify-center py-4">
                        <div className="relative h-32 w-64 overflow-hidden rounded-lg shadow-lg transition-all hover:scale-105 hover:shadow-xl">
                          <Image
                            src={
                              banner.image ||
                              "/placeholder.svg?height=128&width=256&query=banner placeholder"
                            }
                            alt={banner.title || `Banner ${index + 1}`}
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                            className="object-cover"
                            priority={index < 3}
                          />
                        </div>
                      </TableCell>
                      <TableCell className="text-center font-medium max-w-xs truncate">
                        {banner?.title || "No title"}
                      </TableCell>
                      <TableCell className="text-center text-sm text-muted-foreground max-w-xs truncate">
                        {banner?.description || "No description"}
                      </TableCell>
                      <TableCell className="text-center">
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-2  mr-2"
                        >
                          <Link
                            href={`/admin/banner/${banner?._id}`}
                            className="flex items-center gap-1 justify-center"
                          >
                            {" "}
                            <Edit className="h-4 w-4" />
                            <span className="sr-only sm:not-sr-only">Edit</span>
                          </Link>
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(banner?._id)}
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
                      colSpan={5}
                      className="h-32 text-center text-muted-foreground"
                    >
                      <div className="flex flex-col items-center gap-2">
                        <AlertCircle className="h-8 w-8 text-muted-foreground/50" />
                        <span>
                          No banners found. Add some banners to see them here.
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </div>
  );
};

const LoadingBannerTable = () => (
  <div className="w-full overflow-x-auto">
    <div className="min-w-full rounded-lg border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[80px] text-center">No.</TableHead>
            <TableHead className="text-center">Banner Image</TableHead>
            <TableHead className="text-center">Title</TableHead>
            <TableHead className="text-center">Description</TableHead>
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
                <Skeleton className="h-9 w-20 rounded-md mx-auto" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  </div>
);


