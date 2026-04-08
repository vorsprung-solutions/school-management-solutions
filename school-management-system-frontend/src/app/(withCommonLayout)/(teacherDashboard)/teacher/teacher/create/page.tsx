/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import SMForm from "@/components/form/SMForm";
import SMInput from "@/components/form/SMInput";
import SMSelect from "@/components/form/SMSelect";
import SMTextArea from "@/components/form/SMTexrtArea";
import { Button } from "@/components/ui/button";
import useDomain from "@/hooks/useDomain";
import { useGetAllDepartmentByDomainQuery } from "@/redux/features/department/departmentApi";
import { useCreateTeacherMutation } from "@/redux/features/teacher/teacherApi";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { type ChangeEvent, useEffect, useState } from "react";
import type { SubmitHandler } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const createTeacherValidationSchema = z.object({
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

type FormData = z.infer<typeof createTeacherValidationSchema>;

export default function CreateTeacherPage() {
  const domain = useDomain();
  const router = useRouter();
  const [profilePictureFile, setProfilePictureFile] = useState<File | null>(
    null,
  );
  const [createTeacher, { isLoading }] =
    useCreateTeacherMutation();

  const { data: departmentsData, isLoading: isDepartmentsLoading } =
    useGetAllDepartmentByDomainQuery(domain);

  const onSubmit: SubmitHandler<FormData> = async (formData: FormData) => {
    const payload = new FormData();

    if (profilePictureFile) {
      payload.append("file", profilePictureFile);
    }

    const teacherData = {
      ...formData,
      phone: Number.parseInt(formData.phone),
      ephone: formData.ephone ? Number.parseInt(formData.ephone) : undefined,
      join_date: formData.join_date ? new Date(formData.join_date) : undefined,
    };

    payload.append("data", JSON.stringify(teacherData));
    try {
      const res: any = await createTeacher(payload).unwrap();
      if (res?.success) {
        toast.success("Teacher created successfully");
        router.push("/teacher/teacher");
      } else {
        toast.error(res?.message || "Failed to create teacher");
      }
    } catch (err: any) {
      const apiMessage = err?.data?.message || err?.error || err?.message;
      const errorMessage = apiMessage || "Failed to create teacher";
      toast.error(errorMessage);
    }
  };

  const handleProfilePictureChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files![0];
    setProfilePictureFile(file);
  };

  useEffect(() => {
    // no-op: handled in onSubmit via unwrap
  }, []);

  const departmentOptions =
    departmentsData?.data?.map((dept: any) => ({
      label: dept.name,
      value: dept._id,
    })) || [];

  return (
    <div className="flex h-[calc(100vh-100px)] flex-col items-center justify-center border p-6">
      <h3 className="mb-4 text-2xl font-semibold text-gray-800">
        Create New Teacher
      </h3>
      <div className="w-full max-w-4xl rounded-lg bg-white p-8 shadow-md">
        <SMForm
          resolver={zodResolver(createTeacherValidationSchema)}
          onSubmit={onSubmit}
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
              Upload Profile Picture (Optional)
            </label>
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
            {isLoading ? "Creating..." : "Create Teacher"}
          </Button>
        </SMForm>
      </div>
    </div>
  );
}
