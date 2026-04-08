"use client";

import SMForm from "@/components/form/SMForm";
import SMInput from "@/components/form/SMInput";
import SMSelect from "@/components/form/SMSelect";
import SMTextArea from "@/components/form/SMTexrtArea";
import { Button } from "@/components/ui/button";
import { useCreateStaffMutation } from "@/redux/features/staff/staffApi";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { type ChangeEvent, useEffect, useState } from "react";
import type { SubmitHandler } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const createStaffValidationSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email format").min(1, "Email is required"),
  designation: z.string().min(1, "Designation is required"),
  phone: z.string().min(1, "Phone number is required"),
  ephone: z.string().min(1, "Emergency phone number is required"),
  quote: z.string().min(1, "Quote is required"),
  educationLevel: z.string().min(1, "Education level is required"),
  join_date: z.string().min(1, "Join date is required"),
  profilePicture: z.string().optional(),
});

type FormData = z.infer<typeof createStaffValidationSchema>;

export default function CreateStaffPage() {
  const router = useRouter();
  const [profilePictureFile, setProfilePictureFile] = useState<File | null>(
    null
  );
  const [createStaff, { isLoading }] =
    useCreateStaffMutation();

  const onSubmit: SubmitHandler<FormData> = async (formData: FormData) => {
    const payload = new FormData();

    if (profilePictureFile) {
      payload.append("file", profilePictureFile);
    }

    // Convert necessary fields
    const staffData = {
      ...formData,
      phone: Number.parseInt(formData.phone),
      ephone: Number.parseInt(formData.ephone),
      join_date: new Date(formData.join_date),
    };

    payload.append("data", JSON.stringify(staffData));
    try {
      const res = await createStaff(payload).unwrap();
      if (res?.success) {
        toast.success("Staff created successfully");
        router.back();
      } else {
        toast.error(res?.message || "Failed to create staff");
      }
    } catch (err: unknown) {
      const apiMessage = (err as any)?.data?.message || (err as any)?.error || (err as any)?.message;
      const errorMessage = apiMessage || "Failed to create staff";
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
    { label: "Certificate", value: "Certificate" },
  ];

  return (
    <div className="flex h-[calc(100vh-100px)] flex-col items-center justify-center border p-6">
      <h3 className="mb-4 text-2xl font-semibold text-gray-800">
        Create New Staff
      </h3>
      <div className="w-full max-w-4xl rounded-lg bg-white p-8 shadow-md">
        <SMForm
          resolver={zodResolver(createStaffValidationSchema)}
          onSubmit={onSubmit}
        >
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <SMInput label="Full Name" name="name" />
            <SMInput label="Email Address" name="email" type="email" />
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <SMInput label="Phone Number" name="phone" type="tel" />
            <SMInput label="Emergency Phone" name="ephone" type="tel" />
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
            <SMTextArea
              label="Quote"
              name="quote"
              placeholder="Enter a motivational quote or personal statement"
              rows={3}
            />
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
            disabled={isLoading}
          >
            {isLoading ? "Creating..." : "Create Staff"}
          </Button>
        </SMForm>
      </div>
    </div>
  );
}
