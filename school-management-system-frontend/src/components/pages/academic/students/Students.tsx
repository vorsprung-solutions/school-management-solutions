"use client";

import { useState } from "react";

import { IPublicStudentQuery, IStudent } from "@/types/student";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Search,
  Filter,
  Users,
  GraduationCap,
  BookOpen,
  Hash,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useGetAllStudentByDomainQuery } from "@/redux/features/student/studentApi";
import useDomain from "@/hooks/useDomain";

const Students = () => {
  const domain = useDomain();
  const [query, setQuery] = useState<IPublicStudentQuery>({
    page: 1,
    limit: 10,
  });

  const {
    data: studentsResponse,
    isLoading,
    isError,
  } = useGetAllStudentByDomainQuery(domain, {
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
  });
  const allStudents = studentsResponse?.data || [];

  // Client-side filtering and pagination since the domain API doesn't provide server-side pagination
  const filteredStudents = allStudents.filter((student: IStudent) => {
    if (query.search) {
      const searchTerm = query.search.toLowerCase();
      return (
        student.name.toLowerCase().includes(searchTerm) ||
        student.email?.toLowerCase().includes(searchTerm) ||
        student.roll_no?.toString().toLowerCase().includes(searchTerm)
      );
    }
    if (query.class && student.class !== query.class) return false;
    if (query.session && student.session !== query.session) return false;
    if (query.gender && student.gender !== query.gender) return false;
    return true;
  });

  const totalStudents = filteredStudents.length;
  const limit = query.limit || 10;
  const page = query.page || 1;
  const totalPages = Math.ceil(totalStudents / limit);
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const students = filteredStudents.slice(startIndex, endIndex);

  const meta = {
    page,
    limit,
    total: totalStudents,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };

  const handleSearch = (value: string) => {
    if (value === "") {
      setQuery((prev) => {
        const newQuery = { ...prev, page: 1 };
        delete newQuery.search;
        return newQuery;
      });
    } else {
      setQuery((prev) => ({ ...prev, search: value, page: 1 }));
    }
  };

  const handleFilter = (
    key: keyof IPublicStudentQuery,
    value: string | number
  ) => {
    if (value === "all" || value === "" || value === 0) {
      setQuery((prev) => {
        const newQuery = { ...prev, page: 1 };
        delete newQuery[key];
        return newQuery;
      });
    } else {
      setQuery((prev) => ({ ...prev, [key]: value, page: 1 }));
    }
  };

  const handlePageChange = (page: number) => {
    setQuery((prev) => ({ ...prev, page }));
  };

  const clearFilters = () => {
    setQuery({
      page: 1,
      limit: 10,
    });
  };

  const getGenderBadge = (gender: string) => {
    return gender === "Male" ? (
      <Badge className="bg-blue-100 text-blue-800 text-xs">Male</Badge>
    ) : (
      <Badge className="bg-pink-100 text-pink-800 text-xs">Female</Badge>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-2">
            Error Loading Students
          </h2>
          <p className="text-gray-600">Please try again later</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">
                  Total Students
                </p>
                <p className="text-2xl font-bold text-blue-900">
                  {meta?.total || 0}
                </p>
              </div>
              <Users className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">
                  Active Students
                </p>
                <p className="text-2xl font-bold text-green-900">
                  {filteredStudents.length}
                </p>
              </div>
              <GraduationCap className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">
                  Departments
                </p>
                <p className="text-2xl font-bold text-purple-900">
                  {
                    new Set(filteredStudents.map((s: IStudent) => s.department.name))
                      .size
                  }
                </p>
              </div>
              <BookOpen className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600">Classes</p>
                <p className="text-2xl font-bold text-orange-900">
                  {new Set(filteredStudents.map((s: IStudent) => s.class)).size}
                </p>
              </div>
              <Hash className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Search & Filters
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by name, roll..."
                className="pl-10"
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
            <Select
              value={query.class?.toString() || undefined}
              onValueChange={(value) => handleFilter("class", parseInt(value))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Class" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">All Classes</SelectItem>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((cls) => (
                  <SelectItem key={cls} value={cls.toString()}>
                    Class {cls}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={query.session?.toString() || undefined}
              onValueChange={(value) =>
                handleFilter("session", parseInt(value))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Session" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">All Sessions</SelectItem>
                {Array.from(
                  { length: 8 },
                  (_, i) => new Date().getFullYear() - 2 + i
                ).map((session) => (
                  <SelectItem key={session} value={session.toString()}>
                    {session}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={query.gender || undefined}
              onValueChange={(value) => handleFilter("gender", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Genders</SelectItem>
                <SelectItem value="Male">Male</SelectItem>
                <SelectItem value="Female">Female</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end">
            <Button
              variant="outline"
              onClick={clearFilters}
              className="text-sm"
            >
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Students Table */}
      <Card>
        <CardHeader>
          <CardTitle>Students Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border ">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="font-semibold">SL</TableHead>
                  <TableHead className="font-semibold">Name</TableHead>
                  <TableHead className="font-semibold">Roll</TableHead>
                  <TableHead className="font-semibold">Class</TableHead>
                  <TableHead className="font-semibold">Department</TableHead>
                  <TableHead className="font-semibold">Group</TableHead>
                  <TableHead className="font-semibold">Session</TableHead>
                  <TableHead className="font-semibold">Gender</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.map((student: IStudent, index: number) => (
                  <TableRow key={student._id} className="hover:bg-gray-50">
                    <TableCell className="font-medium">
                      {((meta?.page || 1) - 1) * (meta?.limit || 10) +
                        index +
                        1}
                    </TableCell>
                    <TableCell className="font-medium text-gray-900">
                      {student.name}
                    </TableCell>
                    <TableCell className="text-gray-600">
                      {student.roll_no || "N/A"}
                    </TableCell>
                    <TableCell className="text-gray-600">
                      Class {student.class}
                    </TableCell>
                    <TableCell className="text-gray-600">
                      {student.department.name}
                    </TableCell>
                    <TableCell className="text-gray-600">
                      {student.group || "N/A"}
                    </TableCell>
                    <TableCell className="text-gray-600">
                      {student.session}
                    </TableCell>
                    <TableCell>{getGenderBadge(student.gender)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Empty State */}
          {students.length === 0 && (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No students found
              </h3>
              <p className="text-gray-600 mb-4">
                No students match your current search criteria.
              </p>
              <Button onClick={clearFilters} variant="outline">
                Clear Filters
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {meta && meta.totalPages > 1 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing {(meta.page - 1) * meta.limit + 1} to{" "}
                {Math.min(meta.page * meta.limit, meta.total)} of {meta.total}{" "}
                students
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(meta.page - 1)}
                  disabled={!meta.hasPrevPage}
                  className="flex items-center gap-1"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </Button>
                <div className="flex items-center gap-1">
                  {Array.from(
                    { length: Math.min(5, meta.totalPages) },
                    (_, i) => {
                      const pageNum = i + 1;
                      return (
                        <Button
                          key={pageNum}
                          variant={
                            pageNum === meta.page ? "default" : "outline"
                          }
                          size="sm"
                          onClick={() => handlePageChange(pageNum)}
                          className="w-8 h-8 p-0"
                        >
                          {pageNum}
                        </Button>
                      );
                    }
                  )}
                  {meta.totalPages > 5 && (
                    <span className="px-2 text-gray-500">...</span>
                  )}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(meta.page + 1)}
                  disabled={!meta.hasNextPage}
                  className="flex items-center gap-1"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Students;
