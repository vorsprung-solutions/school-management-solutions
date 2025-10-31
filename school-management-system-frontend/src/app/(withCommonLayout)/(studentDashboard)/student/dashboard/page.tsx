"use client";

import React from "react";
import {
  User,
  Phone,
  Mail,
  Droplet,
  Calendar,
  Edit,
  BookOpen,
  GraduationCap,
  Award,
  Clock,
  MapPin,
  Shield,
  Activity,
} from "lucide-react";
import { useGetCurrentStudentQuery } from "@/redux/features/student/studentApi";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import LoadingAnimationStudentAndTeacher from "@/components/shared/loading-student-teacher";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

export default function StudentDashboardPage() {
  const { data: studentData, isLoading } = useGetCurrentStudentQuery(
    undefined,
    {
      refetchOnMountOrArgChange: true,
      refetchOnFocus: true,
    }
  );

  const student = studentData?.data || null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      {isLoading && (
        <div className="flex items-center justify-center min-h-screen">
          <LoadingAnimationStudentAndTeacher />
        </div>
      )}

      {!student && !isLoading && (
        <div className="flex items-center justify-center min-h-screen">
          <Card className="w-full max-w-md text-center p-8">
            <div className="mb-4">
              <User className="h-16 w-16 mx-auto text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              No Data Available
            </h2>
            <p className="text-gray-600">Unable to load student information.</p>
          </Card>
        </div>
      )}

      {!isLoading && student && (
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header Section */}
          <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 shadow-xl">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div className="flex items-center gap-6">
                  <div className="relative">
                    {student?.profilePicture ? (
                      <Image
                        src={student?.profilePicture}
                        alt={student?.name}
                        width={96}
                        height={96}
                        className="w-24 h-24 rounded-full shadow-lg border-4 border-white/20"
                      />
                    ) : (
                      <Avatar className="w-24 h-24 border-4 border-white/20">
                        <AvatarImage src={student?.profilePicture} />
                        <AvatarFallback className="text-2xl font-bold bg-white/10 text-white">
                          {student?.name?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    )}
                    <div className="absolute -bottom-2 -right-2 bg-green-500 rounded-full p-1">
                      <Shield className="h-4 w-4 text-white" />
                    </div>
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold mb-2">{student?.name}</h1>
                    <div className="flex flex-wrap gap-4 text-blue-100">
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4" />
                        <span>Roll: {student?.roll_no}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <GraduationCap className="h-4 w-4" />
                        <span>Reg: {student?.reg_no}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Award className="h-4 w-4" />
                        <span>
                          {student?.group
                            ? `${student?.group} Group`
                            : "General"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-3">
                  <Link href="/student/profile/update">
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
                    Active Student
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
                      Current Class
                    </p>
                    <p className="text-2xl font-bold text-blue-600">
                      Class {student?.class}
                    </p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-full">
                    <BookOpen className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-lg border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Academic Session
                    </p>
                    <p className="text-2xl font-bold text-green-600">
                      {student?.session}
                    </p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-full">
                    <Clock className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-lg border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Department
                    </p>
                    <p className="text-lg font-bold text-purple-600">
                      {student?.department?.name || "N/A"}
                    </p>
                  </div>
                  <div className="p-3 bg-purple-100 rounded-full">
                    <MapPin className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-lg border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Gender</p>
                    <p className="text-lg font-bold text-orange-600">
                      {student?.gender || "N/A"}
                    </p>
                  </div>
                  <div className="p-3 bg-orange-100 rounded-full">
                    <User className="h-6 w-6 text-orange-600" />
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
                    <span className="text-sm text-gray-600">Gender</span>
                  </div>
                  <Badge variant="outline" className="font-medium">
                    {student?.gender}
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-full">
                      <Calendar className="h-4 w-4 text-green-600" />
                    </div>
                    <span className="text-sm text-gray-600">Date of Birth</span>
                  </div>
                  <span className="text-sm font-medium">
                    {new Date(
                      student?.dob || "2019-03-19T00:00:00.000Z"
                    ).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
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
                    {student?.blood_group || "N/A"}
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
                    <p className="text-sm font-medium">{student?.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="p-2 bg-green-100 rounded-full">
                    <Phone className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-600">Personal Phone</p>
                    <p className="text-sm font-medium">
                      {student?.phone || "Not provided"}
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
                      {student?.ephone || "Not provided"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Academic Information */}
            <Card className="bg-white shadow-lg border-0">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <BookOpen className="h-5 w-5 text-purple-600" />
                  Academic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-full">
                      <BookOpen className="h-4 w-4 text-blue-600" />
                    </div>
                    <span className="text-sm text-gray-600">Current Class</span>
                  </div>
                  <Badge variant="outline" className="font-medium">
                    Class {student?.class}
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-full">
                      <Clock className="h-4 w-4 text-green-600" />
                    </div>
                    <span className="text-sm text-gray-600">
                      Academic Session
                    </span>
                  </div>
                  <Badge variant="outline" className="font-medium">
                    {student?.session}
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 rounded-full">
                      <MapPin className="h-4 w-4 text-purple-600" />
                    </div>
                    <span className="text-sm text-gray-600">Department</span>
                  </div>
                  <Badge variant="outline" className="font-medium">
                    {student?.department?.name || "N/A"}
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-100 rounded-full">
                      <Award className="h-4 w-4 text-orange-600" />
                    </div>
                    <span className="text-sm text-gray-600">Group</span>
                  </div>
                  <Badge variant="outline" className="font-medium">
                    {student?.group ? `${student?.group} Group` : "General"}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Student Summary */}
          <Card className="bg-white shadow-lg border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-blue-600" />
                Student Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-blue-100 rounded-full">
                      <GraduationCap className="h-4 w-4 text-blue-600" />
                    </div>
                    <h3 className="font-medium text-blue-900">Student ID</h3>
                  </div>
                  <p className="text-sm text-blue-700">{student?._id}</p>
                </div>

                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-green-100 rounded-full">
                      <BookOpen className="h-4 w-4 text-green-600" />
                    </div>
                    <h3 className="font-medium text-green-900">Roll Number</h3>
                  </div>
                  <p className="text-sm text-green-700">
                    {student?.roll_no || "Not assigned"}
                  </p>
                </div>

                <div className="p-4 bg-purple-50 rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-purple-100 rounded-full">
                      <Award className="h-4 w-4 text-purple-600" />
                    </div>
                    <h3 className="font-medium text-purple-900">
                      Registration Number
                    </h3>
                  </div>
                  <p className="text-sm text-purple-700">
                    {student?.reg_no || "Not assigned"}
                  </p>
                </div>

                <div className="p-4 bg-orange-50 rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-orange-100 rounded-full">
                      <Calendar className="h-4 w-4 text-orange-600" />
                    </div>
                    <h3 className="font-medium text-orange-900">
                      Date of Birth
                    </h3>
                  </div>
                  <p className="text-sm text-orange-700">
                    {student?.dob
                      ? new Date(student.dob).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                        })
                      : "Not provided"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
