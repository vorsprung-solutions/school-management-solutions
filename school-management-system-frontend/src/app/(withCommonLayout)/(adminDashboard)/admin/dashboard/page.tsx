/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BookOpen,
  GraduationCap,
  Hash,
  Users,
  UserCheck,
  FileText,
  Calendar,
  Bell,
  Plus,
  Settings,
} from "lucide-react";
import React from "react";
import { useGetDashboardStatsQuery } from "@/redux/features/student/studentApi";
import { useGetOrganizationByUserQuery } from "@/redux/features/organization/organizationApi";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { format } from "date-fns";
import AdminProfile from "@/components/dashboard/admin/profile";

// Safe date formatting function
const safeFormatDate = (
  dateString: string | undefined,
  formatString: string
) => {
  if (!dateString) return "N/A";
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "N/A";
    return format(date, formatString);
  } catch (error) {
    console.log(error);
    return "N/A";
  }
};

const AdminDashboard = () => {
  const { data: dashboardStats, isLoading: statsLoading } =
    useGetDashboardStatsQuery();
  const { data: organizationData, isLoading: orgLoading } =
    useGetOrganizationByUserQuery();

  const stats = dashboardStats?.data?.counts;
  const recentActivities = dashboardStats?.data?.recentActivities;
  const organization = organizationData?.data;

  if (statsLoading || orgLoading) {
    return (
      <div className="px-4">
        <div className="flex items-center justify-between mb-6">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-10 w-32" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-8 w-16" />
                  </div>
                  <Skeleton className="h-8 w-8 rounded-full" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="px-4">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
            Welcome to Admin Dashboard
          </h1>
          <p className="text-gray-600 mt-2">
            {organization?.name || "School Management System"} - Overview &
            Analytics
          </p>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Total Students */}
        <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200 hover:shadow-lg transition-all duration-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600 mb-1">
                  Total Students
                </p>
                <p className="text-3xl font-bold text-blue-900">
                  {stats?.totalStudents || 0}
                </p>
                <p className="text-xs text-blue-700 mt-1">
                  {stats?.activeStudents || 0} active
                </p>
              </div>
              <div className="h-12 w-12 bg-blue-500 rounded-full flex items-center justify-center">
                <Users className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Total Teachers */}
        <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200 hover:shadow-lg transition-all duration-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600 mb-1">
                  Total Teachers
                </p>
                <p className="text-3xl font-bold text-green-900">
                  {stats?.totalTeachers || 0}
                </p>
                <p className="text-xs text-green-700 mt-1">Faculty members</p>
              </div>
              <div className="h-12 w-12 bg-green-500 rounded-full flex items-center justify-center">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Total Staff */}
        <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200 hover:shadow-lg transition-all duration-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600 mb-1">
                  Total Staff
                </p>
                <p className="text-3xl font-bold text-purple-900">
                  {stats?.totalStaff || 0}
                </p>
                <p className="text-xs text-purple-700 mt-1">Support staff</p>
              </div>
              <div className="h-12 w-12 bg-purple-500 rounded-full flex items-center justify-center">
                <UserCheck className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Departments */}
        <Card className="bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200 hover:shadow-lg transition-all duration-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600 mb-1">
                  Departments
                </p>
                <p className="text-3xl font-bold text-orange-900">
                  {stats?.totalDepartments || 0}
                </p>
                <p className="text-xs text-orange-700 mt-1">Academic units</p>
              </div>
              <div className="h-12 w-12 bg-orange-500 rounded-full flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Exams */}
        <Card className="bg-gradient-to-r from-indigo-50 to-indigo-100 border-indigo-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-indigo-600">
                  Total Exams
                </p>
                <p className="text-2xl font-bold text-indigo-900">
                  {stats?.totalExams || 0}
                </p>
              </div>
              <FileText className="h-8 w-8 text-indigo-600" />
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <Card className="bg-gradient-to-r from-emerald-50 to-emerald-100 border-emerald-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-emerald-600">
                  Total Results
                </p>
                <p className="text-2xl font-bold text-emerald-900">
                  {stats?.totalResults || 0}
                </p>
              </div>
              <Hash className="h-8 w-8 text-emerald-600" />
            </div>
          </CardContent>
        </Card>

        {/* Notices */}
        <Card className="bg-gradient-to-r from-pink-50 to-pink-100 border-pink-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-pink-600">
                  Total Notices
                </p>
                <p className="text-2xl font-bold text-pink-900">
                  {stats?.totalNotices || 0}
                </p>
              </div>
              <Bell className="h-8 w-8 text-pink-600" />
            </div>
          </CardContent>
        </Card>

        {/* Attendance Records */}
        <Card className="bg-gradient-to-r from-cyan-50 to-cyan-100 border-cyan-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-cyan-600">
                  Attendance Records
                </p>
                <p className="text-2xl font-bold text-cyan-900">
                  {stats?.totalAttendance || 0}
                </p>
              </div>
              <Calendar className="h-8 w-8 text-cyan-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <AdminProfile />

      {/* Quick Actions & Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-purple-600" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Link href="/admin/student">
                <Button variant="outline" className="w-full justify-start">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Student
                </Button>
              </Link>
              <Link href="/admin/teacher">
                <Button variant="outline" className="w-full justify-start">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Teacher
                </Button>
              </Link>
              <Link href="/admin/notice">
                <Button variant="outline" className="w-full justify-start">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Notice
                </Button>
              </Link>
              <Link href="/admin/result">
                <Button variant="outline" className="w-full justify-start">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Result
                </Button>
              </Link>
              <Link href="/admin/attendance">
                <Button variant="outline" className="w-full justify-start">
                  <Plus className="h-4 w-4 mr-2" />
                  Mark Attendance
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Recent Students */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600" />
              Recent Students
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivities?.recentStudents?.map(
                (student: any, index: number) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-sm">{student.name}</p>
                      <p className="text-xs text-gray-500">{student.email}</p>
                    </div>
                    <span className="text-xs text-gray-400">
                      {safeFormatDate(student.createdAt, "MMM dd")}
                    </span>
                  </div>
                )
              ) || (
                <div className="text-center py-4 text-gray-500">
                  <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No recent students</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Notices */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-pink-600" />
              Recent Notices
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivities?.recentNotices?.map(
                (notice: any, index: number) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">
                        {notice.title}
                      </p>
                      <p className="text-xs text-gray-500">
                        {safeFormatDate(notice.date, "MMM dd, yyyy")}
                      </p>
                    </div>
                    <span className="text-xs text-gray-400 ml-2">
                      {safeFormatDate(notice.createdAt, "MMM dd")}
                    </span>
                  </div>
                )
              ) || (
                <div className="text-center py-4 text-gray-500">
                  <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No recent notices</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
