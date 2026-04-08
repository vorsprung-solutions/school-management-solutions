"use client";

import SMForm from "@/components/form/SMForm";
import SMInput from "@/components/form/SMInput";
import SMTextArea from "@/components/form/SMTexrtArea";
import SMSelect from "@/components/form/SMSelect";
import { Button } from "@/components/ui/button";
import { useCreateNoticeMutation } from "@/redux/features/admin/adminApi";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { type ChangeEvent, useEffect, useState } from "react";
import type { SubmitHandler } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const createNoticeValidationSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  priority: z.string().optional(),
});

type FormData = z.infer<typeof createNoticeValidationSchema>;

const priorityOptions = [
  { label: "Normal", value: "normal" },
  { label: "Low", value: "low" },
  { label: "Medium", value: "medium" },
  { label: "High", value: "high" },
];

export default function CreateNoticePage() {
  const router = useRouter();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [createNotice, { isLoading }] =
    useCreateNoticeMutation();

const onSubmit: SubmitHandler<FormData> = async (formData: FormData) => {
  if (!imageFile) {
    toast.error("Notice image not added");
    return;
  }

  const payload = new FormData();
  payload.append("file", imageFile);
  payload.append(
    "data",
    JSON.stringify({
      title: formData.title,
      description: formData.description,
      priority: formData.priority || "normal",
    })
  );

  try {
    const res = await createNotice(payload).unwrap();
    if (res?.success) {
      toast.success("Notice created successfully");
      router.push("/admin/notice");
    } else {
      toast.error(res?.message || "Failed to create notice");
    }
  } catch (err: unknown) {
    const apiMessage = (err as any)?.data?.message || (err as any)?.error || (err as any)?.message;
    const errorMessage = apiMessage || "Failed to create notice";
    toast.error(errorMessage);
  }
};

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files![0];
    setImageFile(file);
  };

  useEffect(() => {
    // no-op: handled in onSubmit via unwrap
  }, []);

  return (
    <div className="flex h-[calc(100vh-100px)] flex-col items-center justify-center border p-6">
      <h3 className="mb-4 text-2xl font-semibold text-gray-800">
        Create New Notice
      </h3>
      <div className="w-full max-w-2xl rounded-lg bg-white p-8 shadow-md">
        <SMForm
          resolver={zodResolver(createNoticeValidationSchema)}
          onSubmit={onSubmit}
        >
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <SMInput label="Title" name="title" />
            <SMSelect 
              label="Priority" 
              name="priority" 
              placeholder="Select priority level"
              options={priorityOptions}
            />
          </div>
          <div className="my-6">
            <SMTextArea label="Description" name="description" />
          </div>
          <div className="mb-6">
            <label
              className="block text-sm font-medium text-gray-700"
              htmlFor="image"
            >
              Upload Notice Image
            </label>
            <input
              className="mt-2 block w-full rounded border-gray-300 text-sm text-gray-800 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              id="image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>
          <Button
            className="w-full bg-indigo-600 text-white hover:bg-indigo-700"
            size="lg"
            type="submit"
          >
            {isLoading ? "Creating..." : "Create Notice"}
          </Button>
        </SMForm>
      </div>
    </div>
  );
}
