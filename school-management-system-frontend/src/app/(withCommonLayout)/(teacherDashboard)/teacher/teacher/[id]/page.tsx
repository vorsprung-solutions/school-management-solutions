/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import SMForm from "@/components/form/SMForm";
import SMInput from "@/components/form/SMInput";
import SMSelect from "@/components/form/SMSelect";
import SMTextArea from "@/components/form/SMTexrtArea";
import { Button } from "@/components/ui/button";
import useDomain from "@/hooks/useDomain";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { type ChangeEvent, use, useEffect, useState } from "react";
import type { SubmitHandler } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import {
  useGetSingleTeachertByIdQuery,
  useUpdateTeacherByAdminMutation,
} from "@/redux/features/teacher/teacherApi";
import { useGetAllDepartmentByDomainQuery } from "@/redux/features/department/departmentApi";
import Image from "next/image";

const updateTeacherValidationSchema = z.object({
  department: z.string().min(1, "Department ID is required"),
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email format").min(1, "Email is required"),
  phone: z
    .string()
    .min(9, "Phone number must be at least 9 digits")
    .regex(/^\d+$/, "Phone number must contain only digits"),
  ephone: z
    .string()
    .min(9, "Emergency phone must be at least 9 digits")
    .regex(/^\d+$/, "Emergency phone must contain only digits")
    .optional(),
  qualification: z.string().optional(),
  quote: z.string().optional(),
  designation: z.string().min(1, "Designation is required"),
  join_date: z.string().optional(),
});

type FormData = z.infer<typeof updateTeacherValidationSchema>;

interface UpdateTeacherProps {
  params: Promise<{
    id: string;
  }>;
}

export default function UpdateTeacherPage({ params }: UpdateTeacherProps) {
  const domain = useDomain();
  const router = useRouter();
  const { id } = use(params);
  const [profilePictureFile, setProfilePictureFile] = useState<File | null>(
    null
  );
  const [currentProfilePicture, setCurrentProfilePicture] =
    useState<string>("");
  const [teacherData, setTeacherData] = useState<FormData | null>(null);

  const {
    data: teacherResponse,
    isLoading: isFetching,
    isError: fetchError,
  } = useGetSingleTeachertByIdQuery(id);

  const { data: departmentsData, isLoading: isDepartmentsLoading } =
    useGetAllDepartmentByDomainQuery(domain, {
      skip: !domain,
    });

  const [updateTeacher, { isLoading }] =
    useUpdateTeacherByAdminMutation();

  useEffect(() => {
    if (teacherResponse?.data) {
      const teacher = teacherResponse.data;
      setTeacherData({
        department: teacher.department?._id || teacher.department || "",
        name: teacher.name || "",
        email: teacher.email || "",
        phone: teacher.phone?.toString() || "",
        ephone: teacher.ephone?.toString() || "",
        qualification: teacher.qualification || "",
        quote: teacher.quote || "",
        designation: teacher.designation || "",
        join_date: teacher.join_date
          ? new Date(teacher.join_date).toISOString().split("T")[0]
          : "",
      });
      setCurrentProfilePicture(teacher.profilePicture || "");
    }
  }, [teacherResponse]);

  const onSubmit: SubmitHandler<FormData> = async (formData: FormData) => {
    const payload = new FormData();

    if (profilePictureFile) {
      payload.append("file", profilePictureFile);
    }

    const teacherUpdateData: Record<string, any> = {
      department: formData.department,
      name: formData.name,
      email: formData.email,
      phone: Number.parseInt(formData.phone),
      designation: formData.designation,
    };

    // Only add optional fields if they have values
    if (formData.ephone && formData.ephone.trim()) {
      teacherUpdateData.ephone = Number.parseInt(formData.ephone);
    }

    if (formData.qualification && formData.qualification.trim()) {
      teacherUpdateData.qualification = formData.qualification;
    }

    if (formData.quote && formData.quote.trim()) {
      teacherUpdateData.quote = formData.quote;
    }

    if (formData.join_date && formData.join_date.trim()) {
      teacherUpdateData.join_date = new Date(formData.join_date).toISOString();
    }

    payload.append("data", JSON.stringify(teacherUpdateData));
    try {
      const res: any = await updateTeacher({ id, payload }).unwrap();
      if (res?.success) {
        toast.success("Teacher updated successfully");
        router.push("/teacher/teacher");
      } else {
        toast.error(res?.message || "Failed to update teacher");
      }
    } catch (err: any) {
      const apiMessage = err?.data?.message || err?.error || err?.message;
      const errorMessage = apiMessage || "Failed to update teacher";
      toast.error(errorMessage);
    }
  };

  const handleProfilePictureChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files![0];
    setProfilePictureFile(file);
  };

  useEffect(() => {
    // no-op: success/error handled in onSubmit via unwrap
  }, []);

  const departmentOptions =
    departmentsData?.data?.map((dept: any) => ({
      label: dept.name,
      value: dept._id,
    })) || [];

  if (isFetching || !teacherData) {
    return (
      <div className="flex h-[calc(100vh-100px)] flex-col items-center justify-center border p-6">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading teacher data...</span>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="flex h-[calc(100vh-100px)] flex-col items-center justify-center border p-6">
        <p className="text-red-500">
          Failed to load teacher data. Please try again.
        </p>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-100px)] flex-col items-center justify-center border p-6">
      <div className="w-full max-w-4xl">
        <div className="mb-4">
          <Link href="/teacher/teacher">
            <Button variant="outline" className="gap-2 bg-transparent">
              <ArrowLeft className="h-4 w-4" />
              Back to Teachers
            </Button>
          </Link>
        </div>
        <h3 className="mb-4 text-2xl font-semibold text-gray-800">
          Update Teacher
        </h3>
        <div className="rounded-lg bg-white p-8 shadow-md">
          <SMForm
            key={id}
            resolver={zodResolver(updateTeacherValidationSchema)}
            onSubmit={onSubmit}
            defaultValues={teacherData}
          >
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <SMInput label="Full Name" name="name" />
              <SMInput label="Email Address" name="email" type="email" />
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <SMInput label="Phone Number" name="phone" />
              <SMInput label="Emergency Phone (Optional)" name="ephone" />
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <SMSelect
                name="department"
                label="Department"
                placeholder="Select Department"
                options={departmentOptions}
              />
              <SMInput label="Designation" name="designation" />
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <SMInput label="Qualification (Optional)" name="qualification" />
              <SMInput
                label="Join Date (Optional)"
                name="join_date"
                type="date"
              />
            </div>

            <div className="my-6">
              <SMTextArea label="Quote (Optional)" name="quote" />
            </div>

            <div className="mb-6">
              <label
                className="block text-sm font-medium text-gray-700"
                htmlFor="profilePicture"
              >
                Upload Profile Picture
              </label>
              {currentProfilePicture && !profilePictureFile && (
                <div className="mt-2 mb-2">
                  <Image
                    src={currentProfilePicture || "/placeholder.svg"}
                    alt="Current profile"
                    width={80}
                    height={80}
                    className="h-20 w-20 object-cover rounded-full border"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Current profile picture (upload new to replace)
                  </p>
                </div>
              )}
              <input
                className="mt-2 block w-full rounded border-gray-300 text-sm text-gray-800 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                id="profilePicture"
                type="file"
                accept="image/*"
                onChange={handleProfilePictureChange}
              />
            </div>

            <Button
              className="w-full bg-indigo-600 text-white hover:bg-indigo-700"
              size="lg"
              type="submit"
              disabled={isLoading || isDepartmentsLoading}
            >
              {isLoading ? "Updating..." : "Update Teacher"}
            </Button>
          </SMForm>
        </div>
      </div>
    </div>
  );
}
