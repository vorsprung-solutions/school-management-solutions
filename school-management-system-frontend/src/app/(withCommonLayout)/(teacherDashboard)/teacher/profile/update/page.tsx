"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  useGetCurrentTeacherQuery,
  useUpdateTeacherMutation,
} from "@/redux/features/teacher/teacherApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, Upload, User } from "lucide-react";
import LoadingAnimationStudentAndTeacher from "@/components/shared/loading-student-teacher";
import { toast } from "sonner";

interface FormData {
  name: string;
  email: string;
  phone: string;
  ephone: string;
  qualification: string;
  designation: string;
  blood_group: string;
  join_date: string;
  quote: string;
}

const TeacherProfileUpdatePage = () => {
  const router = useRouter();
  const [profilePictureFile, setProfilePictureFile] = useState<File | null>(
    null
  );
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    ephone: "",
    qualification: "",
    designation: "",
    blood_group: "",
    join_date: "",
    quote: "",
  });

  const {
    data: teacherData,
    isLoading: isFetching,
    isError: fetchError,
  } = useGetCurrentTeacherQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const [updateTeacher, { isLoading: isUpdating }] = useUpdateTeacherMutation();

  useEffect(() => {
    if (teacherData?.data) {
      const teacher = teacherData.data;

      setFormData({
        name: teacher.name || "",
        email: teacher.email || "",
        phone: teacher.phone?.toString() || "",
        ephone: teacher.ephone?.toString() || "",
        qualification: teacher.qualification || "",
        designation: teacher.designation || "",
        blood_group: teacher.blood_group || "",
        join_date: teacher.join_date
          ? new Date(teacher.join_date).toISOString().split("T")[0]
          : "",
        quote: teacher.quote || "",
      });

      if (teacher.profilePicture) {
        setPreviewUrl(teacher.profilePicture);
      }
    }
  }, [teacherData]);

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setProfilePictureFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const formDataToSend = new FormData();

      // Add form fields
      Object.entries(formData).forEach(([key, value]) => {
        if (value) {
          formDataToSend.append(key, value);
        }
      });

      // Add profile picture if selected
      if (profilePictureFile) {
        formDataToSend.append("file", profilePictureFile);
      }

      const result = await updateTeacher(formDataToSend).unwrap();

      if (result.success) {
        toast.success("Profile updated successfully!");
        router.push("/teacher/dashboard");
      }
    } catch (error: unknown) {
      const errorMessage =
        error &&
        typeof error === "object" &&
        "data" in error &&
        typeof error.data === "object" &&
        error.data &&
        "message" in error.data &&
        typeof error.data.message === "string"
          ? error.data.message
          : "Failed to update profile";
      toast.error(errorMessage);
    }
  };

  if (isFetching) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingAnimationStudentAndTeacher />
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md text-center p-8">
          <div className="mb-4">
            <User className="h-16 w-16 mx-auto text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Error Loading Data
          </h2>
          <p className="text-gray-600">Unable to load teacher information.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Update Profile</h1>
            <p className="text-gray-600">
              Update your personal and professional information
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Profile Picture Section */}
          <Card className="bg-white shadow-lg border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-blue-600" />
                Profile Picture
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-6">
                <div className="relative">
                  <Avatar className="w-24 h-24 border-4 border-gray-200">
                    <AvatarImage src={previewUrl} />
                    <AvatarFallback className="text-2xl font-bold">
                      {formData.name?.charAt(0).toUpperCase() || "T"}
                    </AvatarFallback>
                  </Avatar>
                  {previewUrl && (
                    <div className="absolute -top-2 -right-2 bg-green-500 rounded-full p-1">
                      <User className="h-3 w-3 text-white" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <Label
                    htmlFor="profile-picture"
                    className="text-sm font-medium text-gray-700"
                  >
                    Upload New Picture
                  </Label>
                  <div className="mt-2">
                    <Input
                      id="profile-picture"
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() =>
                        document.getElementById("profile-picture")?.click()
                      }
                      className="flex items-center gap-2"
                    >
                      <Upload className="h-4 w-4" />
                      Choose File
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Recommended: Square image, max 5MB
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Personal Information */}
          <Card className="bg-white shadow-lg border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-blue-600" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="Enter your full name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="Enter your email"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Personal Phone</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    placeholder="Enter personal phone number"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ephone">Emergency Phone</Label>
                  <Input
                    id="ephone"
                    value={formData.ephone}
                    onChange={(e) =>
                      handleInputChange("ephone", e.target.value)
                    }
                    placeholder="Enter emergency contact"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="qualification">Qualification</Label>
                  <Input
                    id="qualification"
                    value={formData.qualification}
                    onChange={(e) =>
                      handleInputChange("qualification", e.target.value)
                    }
                    placeholder="Enter your qualification"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="designation">Designation</Label>
                  <Input
                    id="designation"
                    value={formData.designation}
                    onChange={(e) =>
                      handleInputChange("designation", e.target.value)
                    }
                    placeholder="Enter your designation"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="blood_group">Blood Group</Label>
                  <Select
                    key={formData.blood_group || "empty"}
                    defaultValue={formData.blood_group || ""}
                    onValueChange={(value) =>
                      handleInputChange("blood_group", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select blood group" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A+">A+</SelectItem>
                      <SelectItem value="A-">A-</SelectItem>
                      <SelectItem value="B+">B+</SelectItem>
                      <SelectItem value="B-">B-</SelectItem>
                      <SelectItem value="AB+">AB+</SelectItem>
                      <SelectItem value="AB-">AB-</SelectItem>
                      <SelectItem value="O+">O+</SelectItem>
                      <SelectItem value="O-">O-</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="join_date">Join Date</Label>
                  <Input
                    id="join_date"
                    type="date"
                    value={formData.join_date}
                    onChange={(e) =>
                      handleInputChange("join_date", e.target.value)
                    }
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="quote">Quote/Motto</Label>
                <Input
                  id="quote"
                  value={formData.quote}
                  onChange={(e) => handleInputChange("quote", e.target.value)}
                  placeholder="Enter your personal quote or motto"
                />
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isUpdating}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isUpdating}
              className="min-w-[120px]"
            >
              {isUpdating ? "Updating..." : "Update Profile"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TeacherProfileUpdatePage;
