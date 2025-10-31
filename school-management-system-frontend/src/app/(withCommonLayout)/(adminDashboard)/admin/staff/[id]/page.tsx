/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import SMForm from "@/components/form/SMForm";
import SMInput from "@/components/form/SMInput";
import SMSelect from "@/components/form/SMSelect";
import SMTextArea from "@/components/form/SMTexrtArea";
import { Button } from "@/components/ui/button";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { type ChangeEvent, use, useEffect, useState } from "react";
import type { SubmitHandler } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import {
  useGetSingleStaffByIdQuery,
  useUpdateStaffByAdminMutation,
} from "@/redux/features/staff/staffApi";
import Image from "next/image";

const updateStaffValidationSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email format").min(1, "Email is required"),
  designation: z.string().min(1, "Designation is required"),
  phone: z
    .string()
    .min(9, "Phone number must be at least 9 digits")
    .regex(/^\d+$/, "Phone number must contain only digits"),
  ephone: z
    .string()
    .min(9, "Emergency phone must be at least 9 digits")
    .regex(/^\d+$/, "Emergency phone must contain only digits"),
  educationLevel: z.string().optional(),
  quote: z.string().optional(),
  join_date: z.string().optional(),
  profilePicture: z.string().optional(),
});

type FormData = z.infer<typeof updateStaffValidationSchema>;

interface UpdateStaffProps {
  params: Promise<{
    id: string;
  }>;
}

export default function UpdateStaffPage({ params }: UpdateStaffProps) {
  const router = useRouter();
  const { id } = use(params);
  const [profilePictureFile, setProfilePictureFile] = useState<File | null>(
    null
  );
  const [currentProfilePicture, setCurrentProfilePicture] =
    useState<string>("");
  const [staffData, setStaffData] = useState<FormData | null>(null);

  const {
    data: staffResponse,
    isLoading: isFetching,
    isError: fetchError,
  } = useGetSingleStaffByIdQuery(id);

  const [updateStaff, { isLoading }] =
    useUpdateStaffByAdminMutation();

  useEffect(() => {
    if (staffResponse?.data) {
      const staff = staffResponse.data;
      setStaffData({
        name: staff.name || "",
        email: staff.email || "",
        designation: staff.designation || "",
        phone: staff.phone?.toString() || "",
        ephone: staff.ephone?.toString() || "",
        educationLevel: staff.educationLevel || "",
        quote: staff.quote || "",
        join_date: staff.join_date
          ? new Date(staff.join_date).toISOString().split("T")[0]
          : "",
        profilePicture: staff.profilePicture || "",
      });
      setCurrentProfilePicture(staff.profilePicture || "");
    }
  }, [staffResponse]);

  const onSubmit: SubmitHandler<FormData> = async (formData: FormData) => {
    const payload = new FormData();

    if (profilePictureFile) {
      payload.append("file", profilePictureFile);
    }

    const staffUpdateData: Record<string, any> = {
      name: formData.name,
      email: formData.email,
      designation: formData.designation,
      phone: Number.parseInt(formData.phone),
      ephone: Number.parseInt(formData.ephone),
    };

    // Only add optional fields if they have values
    if (formData.educationLevel && formData.educationLevel.trim()) {
      staffUpdateData.educationLevel = formData.educationLevel;
    }

    if (formData.quote && formData.quote.trim()) {
      staffUpdateData.quote = formData.quote;
    }

    if (formData.join_date && formData.join_date.trim()) {
      staffUpdateData.join_date = new Date(formData.join_date).toISOString();
    }

    payload.append("data", JSON.stringify(staffUpdateData));
    try {
      const res: any = await updateStaff({ id, payload }).unwrap();
      if (res?.success) {
        toast.success("Staff updated successfully");
        router.push("/admin/staff");
      } else {
        toast.error(res?.message || "Failed to update staff");
      }
    } catch (err: any) {
      const apiMessage = err?.data?.message || err?.error || err?.message;
      const errorMessage = apiMessage || "Failed to update staff";
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

  const designationOptions = [
    { label: "Principal", value: "Principal" },
    { label: "Vice Principal", value: "Vice Principal" },
    { label: "Head Teacher", value: "Head Teacher" },
    { label: "Assistant Teacher", value: "Assistant Teacher" },
    { label: "Librarian", value: "Librarian" },
    { label: "Lab Assistant", value: "Lab Assistant" },
    { label: "Office Assistant", value: "Office Assistant" },
    { label: "Accountant", value: "Accountant" },
    { label: "Security Guard", value: "Security Guard" },
    { label: "Cleaner", value: "Cleaner" },
  ];

  const educationLevelOptions = [
    { label: "High School", value: "High School" },
    { label: "Bachelor's Degree", value: "Bachelor's Degree" },
    { label: "Master's Degree", value: "Master's Degree" },
    { label: "PhD", value: "PhD" },
    { label: "Diploma", value: "Diploma" },
  ];

  if (isFetching || !staffData) {
    return (
      <div className="flex h-[calc(100vh-100px)] flex-col items-center justify-center border p-6">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading staff data...</span>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="flex h-[calc(100vh-100px)] flex-col items-center justify-center border p-6">
        <p className="text-red-500">
          Failed to load staff data. Please try again.
        </p>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-100px)] flex-col items-center justify-center border p-6">
      <div className="w-full max-w-4xl">
        <div className="mb-4">
          <Link href="/admin/staff">
            <Button variant="outline" className="gap-2 bg-transparent">
              <ArrowLeft className="h-4 w-4" />
              Back to Staff
            </Button>
          </Link>
        </div>
        <h3 className="mb-4 text-2xl font-semibold text-gray-800">
          Update Staff
        </h3>
        <div className="rounded-lg bg-white p-8 shadow-md">
          <SMForm
            key={id}
            resolver={zodResolver(updateStaffValidationSchema)}
            onSubmit={onSubmit}
            defaultValues={staffData}
          >
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <SMInput label="Full Name" name="name" />
              <SMInput label="Email Address" name="email" type="email" />
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <SMInput label="Phone Number" name="phone" />
              <SMInput label="Emergency Phone" name="ephone" />
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <SMSelect
                name="designation"
                label="Designation"
                placeholder="Select Designation"
                options={designationOptions}
              />
              <SMSelect
                name="educationLevel"
                label="Education Level"
                placeholder="Select Education Level"
                options={educationLevelOptions}
              />
            </div>

            <div className="mb-6">
              <SMInput label="Join Date" name="join_date" type="date" />
            </div>

            <div className="mb-6">
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
              disabled={isLoading}
            >
              {isLoading ? "Updating..." : "Update Staff"}
            </Button>
          </SMForm>
        </div>
      </div>
    </div>
  );
}
