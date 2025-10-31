"use client";

import React from "react";
import {
  User,
  Phone,
  Mail,
  Droplet,
  Calendar,
  Edit,
  GraduationCap,
  Award,
  MapPin,
  Shield,
  Activity,
  Briefcase,
} from "lucide-react";
import { useGetCurrentTeacherQuery } from "@/redux/features/teacher/teacherApi";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import LoadingAnimationStudentAndTeacher from "@/components/shared/loading-student-teacher";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

const TeacherDashboardPage = () => {
  const { data: teacherData, isLoading } = useGetCurrentTeacherQuery(
    undefined,
    {
      refetchOnMountOrArgChange: true,
      refetchOnFocus: true,
    }
  );

  const teacher = teacherData?.data || null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      {isLoading && (
        <div className="flex items-center justify-center min-h-screen">
          <LoadingAnimationStudentAndTeacher />
        </div>
      )}

      {!teacher && !isLoading && (
        <div className="flex items-center justify-center min-h-screen">
          <Card className="w-full max-w-md text-center p-8">
            <div className="mb-4">
              <User className="h-16 w-16 mx-auto text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              No Data Available
            </h2>
            <p className="text-gray-600">Unable to load teacher information.</p>
          </Card>
        </div>
      )}

      {!isLoading && teacher && (
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header Section */}
          <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 shadow-xl">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div className="flex items-center gap-6">
                  <div className="relative">
                    {teacher?.profilePicture ? (
                      <Image
                        src={teacher?.profilePicture}
                        alt={teacher?.name}
                        width={96}
                        height={96}
                        className="w-24 h-24 rounded-full shadow-lg border-4 border-white/20"
                      />
                    ) : (
                      <Avatar className="w-24 h-24 border-4 border-white/20">
                        <AvatarImage src={teacher?.profilePicture} />
                        <AvatarFallback className="text-2xl font-bold bg-white/10 text-white">
                          {teacher?.name?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    )}
                    <div className="absolute -bottom-2 -right-2 bg-green-500 rounded-full p-1">
                      <Shield className="h-4 w-4 text-white" />
                    </div>
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold mb-2">{teacher?.name}</h1>
                    <div className="flex flex-wrap gap-4 text-blue-100">
                      <div className="flex items-center gap-2">
                        <Briefcase className="h-4 w-4" />
                        <span>{teacher?.designation || "Teacher"}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <GraduationCap className="h-4 w-4" />
                        <span>{teacher?.qualification || "Not specified"}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <span>{teacher?.department?.name || "Department"}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-3">
                  <Link href="/teacher/profile/update">
                    <Button className="bg-white/20 hover:bg-white/30 text-white border border-white/30">
                      <Edit className="h-4 w-4 mr-2" />
                      Update Profile
                    </Button>
                  </Link>
                  <Badge
                    variant="secondary"
                    className="bg-white/20 text-white border-white/30"
                  >
                    <Activity className="h-3 w-3 mr-1" />
                    Active Teacher
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-white shadow-lg border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Department
                    </p>
                    <p className="text-lg font-bold text-blue-600">
                      {teacher?.department?.name || "N/A"}
                    </p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-full">
                    <MapPin className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-lg border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Designation
                    </p>
                    <p className="text-lg font-bold text-green-600">
                      {teacher?.designation || "Teacher"}
                    </p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-full">
                    <Briefcase className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-lg border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Join Date
                    </p>
                    <p className="text-sm font-bold text-purple-600">
                      {teacher?.join_date
                        ? new Date(teacher.join_date).toLocaleDateString(
                            "en-GB",
                            {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            }
                          )
                        : "N/A"}
                    </p>
                  </div>
                  <div className="p-3 bg-purple-100 rounded-full">
                    <Calendar className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-lg border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Blood Group
                    </p>
                    <p className="text-lg font-bold text-orange-600">
                      {teacher?.blood_group || "N/A"}
                    </p>
                  </div>
                  <div className="p-3 bg-orange-100 rounded-full">
                    <Droplet className="h-6 w-6 text-orange-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Personal Information */}
            <Card className="bg-white shadow-lg border-0">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <User className="h-5 w-5 text-blue-600" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-full">
                      <User className="h-4 w-4 text-blue-600" />
                    </div>
                    <span className="text-sm text-gray-600">Qualification</span>
                  </div>
                  <Badge variant="outline" className="font-medium">
                    {teacher?.qualification || "N/A"}
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-full">
                      <Calendar className="h-4 w-4 text-green-600" />
                    </div>
                    <span className="text-sm text-gray-600">Join Date</span>
                  </div>
                  <span className="text-sm font-medium">
                    {teacher?.join_date
                      ? new Date(teacher.join_date).toLocaleDateString(
                          "en-GB",
                          {
                            day: "2-digit",
                            month: "long",
                            year: "numeric",
                          }
                        )
                      : "Not specified"}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-red-100 rounded-full">
                      <Droplet className="h-4 w-4 text-red-600" />
                    </div>
                    <span className="text-sm text-gray-600">Blood Group</span>
                  </div>
                  <Badge variant="outline" className="font-medium">
                    {teacher?.blood_group || "N/A"}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card className="bg-white shadow-lg border-0">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Phone className="h-5 w-5 text-green-600" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="p-2 bg-blue-100 rounded-full">
                    <Mail className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-600">Email Address</p>
                    <p className="text-sm font-medium">{teacher?.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="p-2 bg-green-100 rounded-full">
                    <Phone className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-600">Personal Phone</p>
                    <p className="text-sm font-medium">
                      {teacher?.phone || "Not provided"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="p-2 bg-orange-100 rounded-full">
                    <Phone className="h-4 w-4 text-orange-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-600">Emergency Contact</p>
                    <p className="text-sm font-medium">
                      {teacher?.ephone || "Not provided"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Professional Information */}
            <Card className="bg-white shadow-lg border-0">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Briefcase className="h-5 w-5 text-purple-600" />
                  Professional Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-full">
                      <Briefcase className="h-4 w-4 text-blue-600" />
                    </div>
                    <span className="text-sm text-gray-600">Designation</span>
                  </div>
                  <Badge variant="outline" className="font-medium">
                    {teacher?.designation || "Teacher"}
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-full">
                      <MapPin className="h-4 w-4 text-green-600" />
                    </div>
                    <span className="text-sm text-gray-600">Department</span>
                  </div>
                  <Badge variant="outline" className="font-medium">
                    {teacher?.department?.name || "N/A"}
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 rounded-full">
                      <Award className="h-4 w-4 text-purple-600" />
                    </div>
                    <span className="text-sm text-gray-600">Experience</span>
                  </div>
                  <Badge variant="outline" className="font-medium">
                    {teacher?.join_date
                      ? `${
                          new Date().getFullYear() -
                          new Date(teacher.join_date).getFullYear()
                        } years`
                      : "N/A"}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Teacher Quote */}
          {teacher?.quote && (
            <Card className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-yellow-300" />
                  Personal Quote
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-6 bg-white/10 rounded-lg">
                  <blockquote className="text-lg italic text-center">
                    &ldquo;{teacher.quote}&rdquo;
                  </blockquote>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Teacher Summary */}
          <Card className="bg-white shadow-lg border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-blue-600" />
                Teacher Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-blue-100 rounded-full">
                      <GraduationCap className="h-4 w-4 text-blue-600" />
                    </div>
                    <h3 className="font-medium text-blue-900">Teacher ID</h3>
                  </div>
                  <p className="text-sm text-blue-700">{teacher?._id}</p>
                </div>

                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-green-100 rounded-full">
                      <Briefcase className="h-4 w-4 text-green-600" />
                    </div>
                    <h3 className="font-medium text-green-900">Designation</h3>
                  </div>
                  <p className="text-sm text-green-700">
                    {teacher?.designation || "Teacher"}
                  </p>
                </div>

                <div className="p-4 bg-purple-50 rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-purple-100 rounded-full">
                      <MapPin className="h-4 w-4 text-purple-600" />
                    </div>
                    <h3 className="font-medium text-purple-900">Department</h3>
                  </div>
                  <p className="text-sm text-purple-700">
                    {teacher?.department?.name || "Not assigned"}
                  </p>
                </div>

                <div className="p-4 bg-orange-50 rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-orange-100 rounded-full">
                      <Calendar className="h-4 w-4 text-orange-600" />
                    </div>
                    <h3 className="font-medium text-orange-900">Join Date</h3>
                  </div>
                  <p className="text-sm text-orange-700">
                    {teacher?.join_date
                      ? new Date(teacher.join_date).toLocaleDateString(
                          "en-GB",
                          {
                            day: "2-digit",
                            month: "long",
                            year: "numeric",
                          }
                        )
                      : "Not specified"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default TeacherDashboardPage;
