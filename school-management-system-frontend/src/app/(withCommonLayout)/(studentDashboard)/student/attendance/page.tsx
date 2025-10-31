"use client";

import { useState, useEffect } from "react";
import { useGetMyAttendanceQuery } from "@/redux/features/attendance/attendanceApi";
import { IAttendanceQuery, IAttendance } from "@/types/attendance";
import { Button } from "@/components/ui/button";
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
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  UserCheck,
  Filter,
  TrendingUp,
  CalendarDays,
  Target,
} from "lucide-react";
import {
  format,
  startOfMonth,
  endOfMonth,
  getDaysInMonth,
  eachDayOfInterval,
  isSameDay,
} from "date-fns";

const StudentAttendancePage = () => {
  const [query, setQuery] = useState<IAttendanceQuery>({
    page: 1,
    limit: 10,
  });

  // Get current date for default month/year
  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState(
    currentDate.getMonth() + 1
  );
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());

  // Update query when month/year changes
  useEffect(() => {
    setQuery((prev) => ({
      ...prev,
      month: selectedMonth,
      year: selectedYear,
      page: 1,
    }));
  }, [selectedMonth, selectedYear]);

  const {
    data: attendanceResponse,
    isLoading,
    isError,
  } = useGetMyAttendanceQuery(query);

  const attendance = attendanceResponse?.data || [];
  const meta = attendanceResponse?.meta;

  // Calculate stats from attendance data
  const calculateStats = () => {
    const total = attendance.length;
    const present = attendance.filter(
      (record) => record.status === "present"
    ).length;
    const absent = attendance.filter(
      (record) => record.status === "absent"
    ).length;
    const late = attendance.filter((record) => record.status === "late").length;
    const leave = attendance.filter(
      (record) => record.status === "leave"
    ).length;

    return {
      total,
      present,
      absent,
      late,
      leave,
      presentPercentage: total > 0 ? ((present / total) * 100).toFixed(2) : "0",
      absentPercentage: total > 0 ? ((absent / total) * 100).toFixed(2) : "0",
      latePercentage: total > 0 ? ((late / total) * 100).toFixed(2) : "0",
      leavePercentage: total > 0 ? ((leave / total) * 100).toFixed(2) : "0",
    };
  };

  const stats = calculateStats();

  const handlePageChange = (page: number) => {
    setQuery((prev) => ({ ...prev, page }));
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

  // Calculate attendance percentage
  const calculateAttendancePercentage = () => {
    if (!stats) return 0;
    return stats.total > 0 ? (stats.present / stats.total) * 100 : 0;
  };

  // Get days in selected month
  const getDaysInSelectedMonth = () => {
    return getDaysInMonth(new Date(selectedYear, selectedMonth - 1));
  };

  // Calculate attendance streak
  const calculateAttendanceStreak = () => {
    if (!attendance.length) return 0;

    let streak = 0;
    const sortedAttendance = [...attendance].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    for (const record of sortedAttendance) {
      if (record.status === "present") {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  };

  // Generate calendar days for the selected month
  const generateCalendarDays = () => {
    const start = startOfMonth(new Date(selectedYear, selectedMonth - 1));
    const end = endOfMonth(new Date(selectedYear, selectedMonth - 1));
    const days = eachDayOfInterval({ start, end });

    return days.map((day) => {
      const attendanceRecord = attendance.find((record) =>
        isSameDay(new Date(record.date), day)
      );

      return {
        date: day,
        status: attendanceRecord?.status || null,
        hasRecord: !!attendanceRecord,
      };
    });
  };

  const calendarDays = generateCalendarDays();

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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Attendance</h1>
          <p className="text-gray-600">
            Track your attendance records and statistics
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-blue-600" />
          <span className="text-sm text-gray-600">
            {format(currentDate, "MMMM yyyy")}
          </span>
        </div>
      </div>

      {/* Quick Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">This Month</p>
                <p className="text-2xl font-bold text-blue-900">
                  {stats.present} / {stats.total}
                </p>
                <p className="text-xs text-blue-700">Days Present</p>
              </div>
              <CheckCircle className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">
                  Attendance Rate
                </p>
                <p className="text-2xl font-bold text-green-900">
                  {calculateAttendancePercentage().toFixed(1)}%
                </p>
                <p className="text-xs text-green-700">Overall Performance</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">
                  Current Streak
                </p>
                <p className="text-2xl font-bold text-purple-900">
                  {calculateAttendanceStreak()}
                </p>
                <p className="text-xs text-purple-700">Days in a Row</p>
              </div>
              <Target className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Statistics Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Days</CardTitle>
              <CalendarDays className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground">
                Out of {getDaysInSelectedMonth()} days this month
              </p>
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
                {stats.presentPercentage}% attendance
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
                {stats.absentPercentage}% of total
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
                {stats.latePercentage}% of total
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Performance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Attendance Rate
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">
              {calculateAttendancePercentage().toFixed(1)}%
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${calculateAttendancePercentage()}%` }}
              ></div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {stats?.present || 0} present out of {stats?.total || 0} total
              days
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Current Streak
            </CardTitle>
            <Target className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {calculateAttendanceStreak()} days
            </div>
            <p className="text-xs text-muted-foreground">
              Consecutive days present
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filter Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filter Attendance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Month
              </label>
              <Select
                value={selectedMonth.toString()}
                onValueChange={(value) => setSelectedMonth(parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Month" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                    <SelectItem key={month} value={month.toString()}>
                      {format(new Date(2024, month - 1), "MMMM")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Year
              </label>
              <Select
                value={selectedYear.toString()}
                onValueChange={(value) => setSelectedYear(parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Year" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from(
                    { length: 8 },
                    (_, i) => new Date().getFullYear() - 2 + i
                  ).map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Calendar View */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Monthly Calendar View -{" "}
            {format(new Date(selectedYear, selectedMonth - 1), "MMMM yyyy")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-1 mb-4">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div
                key={day}
                className="text-center text-sm font-medium text-gray-500 py-2"
              >
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((day, index) => {
              const isToday = isSameDay(day.date, new Date());
              const getStatusColor = () => {
                switch (day.status) {
                  case "present":
                    return "bg-green-100 text-green-800 border-green-200";
                  case "absent":
                    return "bg-red-100 text-red-800 border-red-200";
                  case "late":
                    return "bg-yellow-100 text-yellow-800 border-yellow-200";
                  case "leave":
                    return "bg-blue-100 text-blue-800 border-blue-200";
                  default:
                    return "bg-gray-50 text-gray-400 border-gray-100";
                }
              };

              return (
                <div
                  key={index}
                  className={`
                    aspect-square p-2 text-center text-sm border rounded-lg flex items-center justify-center
                    ${getStatusColor()}
                    ${isToday ? "ring-2 ring-blue-500" : ""}
                    ${!day.hasRecord ? "opacity-50" : ""}
                  `}
                >
                  <div>
                    <div className="font-medium">{format(day.date, "d")}</div>
                    {day.status && (
                      <div className="text-xs mt-1">
                        {day.status.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-4 flex flex-wrap gap-4 text-xs text-gray-600">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-green-100 border border-green-200 rounded"></div>
              Present
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-red-100 border border-red-200 rounded"></div>
              Absent
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-yellow-100 border border-yellow-200 rounded"></div>
              Late
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-blue-100 border border-blue-200 rounded"></div>
              Leave
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-gray-50 border border-gray-100 rounded"></div>
              No Record
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Attendance Records Table */}
      <Card>
        <CardHeader>
          <CardTitle>Attendance Records</CardTitle>
        </CardHeader>
        <CardContent>
          {attendance.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No attendance records
              </h3>
              <p className="text-gray-600 mb-4">
                No attendance records found for{" "}
                {format(new Date(selectedYear, selectedMonth - 1), "MMMM yyyy")}
                .
              </p>
              <div className="text-sm text-gray-500">
                <p>• Try selecting a different month or year</p>
                <p>• Contact your teacher if you believe this is an error</p>
              </div>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Day</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Remark</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {attendance.map((record: IAttendance) => (
                    <TableRow key={record._id}>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4 text-gray-500" />
                          {format(new Date(record.date), "MMM dd, yyyy")}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-gray-600">
                          {format(new Date(record.date), "EEEE")}
                        </span>
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
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Pagination */}
              {meta && (
                <div className="flex items-center justify-between mt-4">
                  <div className="text-sm text-gray-700">
                    Showing {(meta.page - 1) * meta.limit + 1} to{" "}
                    {Math.min(meta.page * meta.limit, meta.total)} of{" "}
                    {meta.total} results
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
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentAttendancePage;
