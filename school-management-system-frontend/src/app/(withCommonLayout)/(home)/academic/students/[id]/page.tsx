"use client";

import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  ArrowLeft,
  Mail,
  Phone,
  Calendar,
  User,
  BookOpen,
  Hash,
  GraduationCap,
  MapPin,
  Droplets,
} from "lucide-react";
import { format } from "date-fns";
import { useGetPublicStudentsQuery } from "@/redux/features/student/studentApi";

const StudentDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const studentId = params.id as string;

  // Get all students and find the specific one
  const {
    data: studentsResponse,
    isLoading,
    isError,
  } = useGetPublicStudentsQuery({
    page: 1,
    limit: 1000, // Get all students to find the specific one
  });

  const students = studentsResponse?.data || [];
  const student = students.find((s) => s._id === studentId);

  const getGenderBadge = (gender: string) => {
    return gender === "Male" ? (
      <Badge className="bg-blue-100 text-blue-800">Male</Badge>
    ) : (
      <Badge className="bg-pink-100 text-pink-800">Female</Badge>
    );
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (isError || !student) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-2">
            Student Not Found
          </h2>
          <p className="text-gray-600 mb-4">
            The student you&apos;re looking for doesn&apos;t exist.
          </p>
          <Button onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 lg:py-16">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Students
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Student Profile</h1>
          <p className="text-gray-600">
            Detailed information about {student.name}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Student Profile Card */}
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-8">
              <div className="flex flex-col items-center text-center space-y-6">
                {/* Avatar */}
                <Avatar className="w-32 h-32">
                  <AvatarImage
                    src={student.profilePicture}
                    alt={student.name}
                  />
                  <AvatarFallback className="text-3xl font-semibold bg-blue-100 text-blue-600">
                    {getInitials(student.name)}
                  </AvatarFallback>
                </Avatar>

                {/* Basic Info */}
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {student.name}
                  </h2>
                  <div className="flex items-center justify-center gap-2">
                    {getGenderBadge(student.gender)}
                    <Badge variant="outline" className="text-sm">
                      Class {student.class}
                    </Badge>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-4 w-full">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-600">Roll</p>
                    <p className="text-lg font-semibold text-blue-900">
                      {student.roll_no || "N/A"}
                    </p>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <p className="text-sm text-green-600">Session</p>
                    <p className="text-lg font-semibold text-green-900">
                      {student.session}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Student Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">{student.email}</p>
                  </div>
                </div>
                {student.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <p className="font-medium">{student.phone}</p>
                    </div>
                  </div>
                )}
                {student.ephone && (
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Emergency Phone</p>
                      <p className="font-medium">{student.ephone}</p>
                    </div>
                  </div>
                )}
                {student.dob && (
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Date of Birth</p>
                      <p className="font-medium">
                        {format(new Date(student.dob), "MMM dd, yyyy")}
                      </p>
                    </div>
                  </div>
                )}
                {student.blood_group && (
                  <div className="flex items-center gap-3">
                    <Droplets className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Blood Group</p>
                      <p className="font-medium">{student.blood_group}</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Academic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5" />
                Academic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <Hash className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Roll Number</p>
                    <p className="font-medium">{student.roll_no || "N/A"}</p>
                  </div>
                </div>
                {student.reg_no && (
                  <div className="flex items-center gap-3">
                    <Hash className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Registration No</p>
                      <p className="font-medium">{student.reg_no}</p>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <BookOpen className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Department</p>
                    <p className="font-medium">{student.department.name}</p>
                  </div>
                </div>
                {student.group && (
                  <div className="flex items-center gap-3">
                    <User className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Group</p>
                      <p className="font-medium">{student.group}</p>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Class</p>
                    <p className="font-medium">Class {student.class}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Session</p>
                    <p className="font-medium">{student.session}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Organization Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Organization Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-blue-600 font-semibold">
                    {student.organization.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Institution</p>
                  <p className="font-medium">{student.organization.name}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default StudentDetailPage;
