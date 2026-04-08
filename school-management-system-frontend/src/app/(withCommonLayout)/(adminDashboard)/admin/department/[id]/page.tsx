"use client";

import SMForm from "@/components/form/SMForm";
import SMInput from "@/components/form/SMInput";
import { Button } from "@/components/ui/button";
import {
  useUpdateDepartmentMutation,
  useGetSingleDepartmentByIdQuery,
} from "@/redux/features/department/departmentApi";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
import type { SubmitHandler } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";

// Validation schema
const updateDepartmentValidationSchema = z.object({
  name: z.string().min(1, "Department name is required"),
});

type FormData = z.infer<typeof updateDepartmentValidationSchema>;

interface UpdateDepartmentProps {
  params: Promise<{
    id: string;
  }>;
}

export default function UpdateDepartmentPage({
  params,
}: UpdateDepartmentProps) {
  const router = useRouter();
  const { id } = use(params);

  const [departmentData, setDepartmentData] = useState<FormData | null>(null);

  // Fetch single department by ID
  const {
    data: departmentResponse,
    isLoading: isFetching,
    isError: fetchError,
  } = useGetSingleDepartmentByIdQuery(id);

  const [updateDepartment, { isLoading }] =
    useUpdateDepartmentMutation();

  // Set default values when fetched
  useEffect(() => {
    if (departmentResponse?.data) {
      const dept = departmentResponse.data;
      setDepartmentData({
        name: dept.name || "",
      });
    }
  }, [departmentResponse]);

  // Handle form submit
  const onSubmit: SubmitHandler<FormData> = async (formData: FormData) => {
    try {
      const res = await updateDepartment({ id, ...formData }).unwrap();
      if (res?.success) {
        toast.success("Department updated successfully");
        router.push("/admin/department");
      } else {
        toast.error(res?.message || "Failed to update department");
      }
    } catch (err: unknown) {
      const apiMessage = (err as any)?.data?.message || (err as any)?.error || (err as any)?.message;
      const errorMessage = apiMessage || "Failed to update department";
      toast.error(errorMessage);
    }
  };

  // Handle success/error
  useEffect(() => {
    // no-op: success/error handled in onSubmit via unwrap
  }, []);

  if (isFetching || !departmentData) {
    return (
      <div className="flex h-[calc(100vh-100px)] flex-col items-center justify-center border p-6">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading department data...</span>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="flex h-[calc(100vh-100px)] flex-col items-center justify-center border p-6">
        <p className="text-red-500">
          Failed to load department data. Please try again.
        </p>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-100px)] flex-col items-center justify-center border p-6">
      <div className="w-full max-w-md">
        <div className="mb-4">
          <Link href="/admin/department">
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Departments
            </Button>
          </Link>
        </div>
        <h3 className="mb-4 text-2xl font-semibold text-gray-800">
          Update Department
        </h3>
        <div className="rounded-lg bg-white p-8 shadow-md">
          <SMForm
            key={id}
            resolver={zodResolver(updateDepartmentValidationSchema)}
            onSubmit={onSubmit}
            defaultValues={departmentData}
          >
            <div className="mb-6">
              <SMInput label="Department Name" name="name" />
            </div>
            <Button
              className="w-full bg-indigo-600 text-white hover:bg-indigo-700"
              size="lg"
              type="submit"
            >
              {isLoading ? "Updating..." : "Update Department"}
            </Button>
          </SMForm>
        </div>
      </div>
    </div>
  );
}
