"use client";

import SMForm from "@/components/form/SMForm";
import SMInput from "@/components/form/SMInput";
import SMTextArea from "@/components/form/SMTexrtArea";
import { Button } from "@/components/ui/button";
import { useCreateBannerMutation } from "@/redux/features/admin/adminApi";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { type ChangeEvent, useEffect, useState } from "react";
import type { SubmitHandler } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const createBannerValidationSchema = z.object({
  title: z.string().min(1, "Title is required"),
  subtitle: z.string().min(1, "Subtitle is required"),
  description: z.string().min(1, "Description is required"),
});

type FormData = z.infer<typeof createBannerValidationSchema>;

export default function CreateBannerPage() {
  const router = useRouter();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [createBanner, { isLoading }] =
    useCreateBannerMutation();

  const onSubmit: SubmitHandler<FormData> = async (formData: FormData) => {
    if (!imageFile) {
      toast.error("Banner image not added");
      return;
    }

    const data = new FormData();
    if (imageFile) data.append("file", imageFile);
    data.append("title", formData.title);
    data.append("subtitle", formData.subtitle);
    data.append("description", formData.description);

    try {
      const res = await createBanner(data).unwrap();
      if (res?.success) {
        toast.success("Banner created successfully");
        router.push("/admin/banner");
      } else {
        toast.error(res?.message || "Failed to create banner");
      }
    } catch (err: unknown) {
      const apiMessage = (err as any)?.data?.message || (err as any)?.error || (err as any)?.message;
      const errorMessage = apiMessage || "Failed to create banner";
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
        Create New Banner
      </h3>
      <div className="w-full max-w-2xl rounded-lg bg-white p-8 shadow-md">
        <SMForm
          resolver={zodResolver(createBannerValidationSchema)}
          onSubmit={onSubmit}
        >
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <SMInput label="Title" name="title" />
            <SMInput label="Subtitle" name="subtitle" />
          </div>
          <div className="my-6">
            <SMTextArea label="Description" name="description" />
          </div>
          <div className="mb-6">
            <label
              className="block text-sm font-medium text-gray-700"
              htmlFor="image"
            >
              Upload Banner Image
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
            {isLoading ? "Creating..." : "Create Banner"}
          </Button>
        </SMForm>
      </div>
    </div>
  );
}
