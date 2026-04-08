"use client";

import { useCallback } from "react"; 
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

import useDomain from "@/hooks/useDomain";
import Swal from "sweetalert2"; 
import Link from "next/link";
import {
  useDeleteDepartmentyIdMutation,
  useGetAllDepartmentByDomainQuery,
} from "@/redux/features/department/departmentApi";
import { IDepartment } from "@/types/department";

export default function AllDepartment() {
  const domain = useDomain();
  const {
    data: departmentData,
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useGetAllDepartmentByDomainQuery(domain, {
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
  });

  const [deleteDepartment, { isLoading: isDeleting }] =
    useDeleteDepartmentyIdMutation();

  const departments = departmentData?.data || [];

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
            await deleteDepartment(id).unwrap();
            Swal.fire({
              title: "Deleted!",
              text: "The department has been deleted.",
              icon: "success",
              timer: 1500,
              showConfirmButton: false,
            });
          } catch (error) {
            Swal.fire({
              title: "Error!",
              text: "Failed to delete department. Please try again.",
              icon: "error",
            });
            console.error("Delete error:", error);
          }
        }
      });
    },
    [deleteDepartment]
  );

  const handleRetry = useCallback(() => {
    refetch();
  }, [refetch]);

  return (
    <div className="w-full min-h-screen space-y-6 px-7">
      <div className="flex flex-col items-center justify-between gap-4 px-6 py-6 sm:flex-row">
        <h2 className="text-3xl font-bold">All Departments</h2>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2 bg-transparent">
            <Link href="/admin/department/create">Create Department</Link>
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
          <LoadingDepartmentTable />
        </div>
      )}

      {!isLoading && !isError && (
        <div className="w-full ">
          <div className="min-w-full rounded-lg border bg-card mx-6">
            <Table>
              <TableCaption>
                {departments.length > 0
                  ? `Showing ${departments.length} department${
                      departments.length === 1 ? "" : "s"
                    }`
                  : "No departments available"}
              </TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px] text-center">No.</TableHead>
                  <TableHead className="text-center">Name</TableHead> 
                  <TableHead className="text-center w-[120px]">
                    Action
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {departments.length > 0 ? (
                  departments.map((department: IDepartment, index: number) => (
                    <TableRow key={department._id} className="hover:bg-muted/50">
                      <TableCell className="text-center font-medium">
                        {index + 1}
                      </TableCell>

                      <TableCell className="text-center font-medium max-w-xs truncate">
                        {department?.name || "No Name"}
                      </TableCell>
                   
                      <TableCell className="text-center">
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-2  mr-2"
                        >
                          <Link
                            href={`/admin/department/${department?._id}`}
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
                          onClick={() => handleDelete(department?._id)}
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
                          No departments found. Add some departments to see them
                          here.
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

const LoadingDepartmentTable = () => (
  <div className="w-full overflow-x-auto">
    <div className="min-w-full rounded-lg border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[80px] text-center">No.</TableHead> 
            <TableHead className="text-center">Name</TableHead> 
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


