"use client";

import SMForm from "@/components/form/SMForm";
import SMInput from "@/components/form/SMInput";
import { Button } from "@/components/ui/button";
import { useCreateDepartmentMutation } from "@/redux/features/department/departmentApi";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import type { SubmitHandler } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

// Validation schema
const createDepartmentValidationSchema = z.object({
  name: z.string().min(1, "Department name is required"),
});

type FormData = z.infer<typeof createDepartmentValidationSchema>;

export default function CreateDepartmentPage() {
  const router = useRouter();
  const [createDepartment, { isLoading }] =
    useCreateDepartmentMutation();

  const onSubmit: SubmitHandler<FormData> = async (formData: FormData) => {
    try {
      const res = await createDepartment({ name: formData.name }).unwrap();
      if (res?.success) {
        toast.success("Department created successfully");
        router.push("/admin/department");
      } else {
        toast.error(res?.message || "Failed to create department");
      }
    } catch (err: unknown) {
      const apiMessage = (err as any)?.data?.message || (err as any)?.error || (err as any)?.message;
      const errorMessage = apiMessage || "Failed to create department";
      toast.error(errorMessage);
    }
  };

  useEffect(() => {
    // no-op: handled in onSubmit via unwrap
  }, []);

  return (
    <div className="flex h-[calc(100vh-100px)] flex-col items-center justify-center border p-6">
      <h3 className="mb-4 text-2xl font-semibold text-gray-800">
        Create New Department
      </h3>
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
        <SMForm
          resolver={zodResolver(createDepartmentValidationSchema)}
          onSubmit={onSubmit}
        >
          <div className="mb-6">
            <SMInput label="Department Name" name="name" />
          </div>
          <Button
            className="w-full bg-indigo-600 text-white hover:bg-indigo-700"
            size="lg"
            type="submit"
          >
            {isLoading ? "Creating..." : "Create Department"}
          </Button>
        </SMForm>
      </div>
    </div>
  );
}
