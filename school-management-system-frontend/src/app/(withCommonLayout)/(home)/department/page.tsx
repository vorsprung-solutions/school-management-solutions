"use client";

import Title from "@/components/shared/title";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import useDomain from "@/hooks/useDomain";
import { useGetAllDepartmentByDomainQuery } from "@/redux/features/department/departmentApi";
import { IDepartment } from "@/types/department";

export default function DepartmentPage() {
  const domain = useDomain();
  const { data: departmentsAll, isLoading } = useGetAllDepartmentByDomainQuery(
    domain,
    {
      refetchOnMountOrArgChange: true,
      refetchOnFocus: true,
    }
  );

  const departments = departmentsAll?.data || [];

  return (
    <>
      <div className="container mx-auto px-4 py-8 lg:py-16">
        <h1 className="mb-6">
          <Title value="Departments" />
        </h1>

        <Table className="min-w-full border border-gray-200 rounded-2xl overflow-hidden shadow-xl">
          <TableHeader className="bg-[#4F81EE] text-white">
            <TableRow>
              <TableHead className="px-4 py-3 text-left text-sm font-semibold text-white">
                No.
              </TableHead>
              <TableHead className="px-4 py-3 text-left text-sm font-semibold text-white">
                Department
              </TableHead>
            </TableRow>
          </TableHeader>

          {isLoading && <LoadingDepartments />}

          {!isLoading && departments && (
            <TableBody className="divide-y divide-gray-200 bg-white">
              {departments.map((department: IDepartment, id: number) => (
                <TableRow
                  key={"notice-serial-no" + id}
                  className="hover:bg-blue-50 transition-colors"
                >
                  <TableCell className="px-4 py-3 text-gray-700">
                    {id + 1}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-600">
                    {department?.name}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          )}
        </Table>

        {departments?.length < 1 && !isLoading && (
          <div className="flex justify-center items-center mt-8 h-24 bg-white shadow-xl rounded-xl">
            <div className="text-2xl">No Data Available</div>
          </div>
        )}
      </div>
    </>
  );
}

const LoadingDepartments = () => (
  <TableBody className="divide-y divide-gray-200 bg-white">
    {Array.from({ length: 5 }).map((_, index: number) => (
      <TableRow key={`loading-table${index}`}>
        <TableCell className="p-2">
          <Skeleton className="bg-gray-400 p-4" />
        </TableCell>
        <TableCell className="p-2">
          <Skeleton className="bg-gray-400 p-4" />
        </TableCell>
      </TableRow>
    ))}
  </TableBody>
);
