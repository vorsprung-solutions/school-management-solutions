"use client";

import { useState } from "react";
import {
  useGetAllAttendanceQuery,
  useGetAttendanceStatsQuery,
  useDeleteAttendanceMutation,
} from "@/redux/features/attendance/attendanceApi";
import { IAttendanceQuery, IAttendance } from "@/types/attendance";
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
  Plus,
  Edit,
  Trash2,
  Calendar,
  Users,
  CheckCircle,
  XCircle,
  Clock,
  UserCheck,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { format } from "date-fns";

const AttendancePage = () => {
  const [query, setQuery] = useState<IAttendanceQuery>({
    page: 1,
    limit: 10,
  });

  const {
    data: attendanceResponse,
    isLoading,
    isError,
    refetch,
  } = useGetAllAttendanceQuery(query);
  const { data: statsResponse } = useGetAttendanceStatsQuery(query);
  const [deleteAttendance] = useDeleteAttendanceMutation();

  const attendance = attendanceResponse?.data || [];
  const meta = attendanceResponse?.meta;
  const stats = statsResponse?.data;

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
    key: keyof IAttendanceQuery,
    value: string | number
  ) => {
    // Remove the filter if "all" value is passed
    if (value === "all" || value === "" || value === 0) {
      setQuery((prev) => {
        const newQuery = { ...prev, page: 1 };
        delete newQuery[key];
        return newQuery;
      });
    } else {
      // For class and session, ensure we pass a number
      if (key === "class" || key === "session") {
        const numValue = parseInt(value.toString(), 10);
        if (!isNaN(numValue)) {
          setQuery((prev) => ({ ...prev, [key]: numValue, page: 1 }));
        }
      } else {
        setQuery((prev) => ({ ...prev, [key]: value, page: 1 }));
      }
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

  const handleDelete = async (id: string) => {
    try {
      await deleteAttendance(id).unwrap();
      toast.success("Attendance deleted successfully");
      refetch();
    } catch (error) {
      toast.error("Failed to delete attendance");
      console.log(error);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      present: { color: "bg-green-100 text-green-800", icon: CheckCircle },
      absent: { color: "bg-red-100 text-red-800", icon: XCircle },
      late: { color: "bg-yellow-100 text-yellow-800", icon: Clock },
      leave: { color: "bg-blue-100 text-blue-800", icon: UserCheck },
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    const Icon = config.icon;

    return (
      <Badge className={config.color}>
        <Icon className="w-3 h-3 mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600">
            Error Loading Attendance
          </h2>
          <p className="text-gray-600">Please try again later</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Attendance Management
          </h1>
          <p className="text-gray-600">Manage and track student attendance</p>
        </div>
        <Link href="/admin/attendance/create">
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Create Attendance
          </Button>
        </Link>
      </div>

      {/* Statistics Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Present</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {stats.present}
              </div>
              <p className="text-xs text-muted-foreground">
                {stats.presentPercentage}%
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Absent</CardTitle>
              <XCircle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {stats.absent}
              </div>
              <p className="text-xs text-muted-foreground">
                {stats.absentPercentage}%
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Late</CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {stats.late}
              </div>
              <p className="text-xs text-muted-foreground">
                {stats.latePercentage}%
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Leave</CardTitle>
              <UserCheck className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {stats.leave}
              </div>
              <p className="text-xs text-muted-foreground">
                {stats.leavePercentage}%
              </p>
            </CardContent>
          </Card>
        </div>
      )}

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
                placeholder="Search by name, roll, email..."
                className="pl-10"
                value={query.search || ""}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
            <Select
              value={query.status || undefined}
              onValueChange={(value) => handleFilter("status", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="present">Present</SelectItem>
                <SelectItem value="absent">Absent</SelectItem>
                <SelectItem value="late">Late</SelectItem>
                <SelectItem value="leave">Leave</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={query.class?.toString() || undefined}
              onValueChange={(value) => handleFilter("class", parseInt(value))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Class" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Classes</SelectItem>
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
                <SelectItem value="all">All Sessions</SelectItem>
                {[2020, 2021, 2022, 2023, 2024, 2025].map((session) => (
                  <SelectItem key={session} value={session.toString()}>
                    {session}
                  </SelectItem>
                ))}
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

      {/* Attendance Table */}
      <Card>
        <CardHeader>
          <CardTitle>Attendance Records</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Class</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Remark</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {attendance.map((record: IAttendance) => (
                <TableRow key={record._id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{record.student.name}</div>
                      <div className="text-sm text-gray-500">
                        {record.student.roll} • {record.student.email}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>Class {record.student.class}</TableCell>
                  <TableCell>{record.department.name}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      {format(new Date(record.date), "MMM dd, yyyy")}
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(record.status)}</TableCell>
                  <TableCell>
                    {record.remark ? (
                      <span className="text-sm text-gray-600">
                        {record.remark}
                      </span>
                    ) : (
                      <span className="text-sm text-gray-400">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Link href={`/admin/attendance/${record._id}/edit`}>
                        <Button size="sm" variant="outline">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(record._id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Pagination */}
          {meta && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-gray-700">
                Showing {(meta.page - 1) * meta.limit + 1} to{" "}
                {Math.min(meta.page * meta.limit, meta.total)} of {meta.total}{" "}
                results
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(meta.page - 1)}
                  disabled={meta.page <= 1}
                >
                  Previous
                </Button>
                <span className="flex items-center px-3 text-sm">
                  Page {meta.page} of {meta.totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(meta.page + 1)}
                  disabled={meta.page >= meta.totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AttendancePage;
