"use client";

import SMForm from "@/components/form/SMForm";
import SMInput from "@/components/form/SMInput";
import SMTextArea from "@/components/form/SMTexrtArea";
import { Button } from "@/components/ui/button";
import {
  useUpdateBannerMutation,
  useGetSingleBannerByIdQuery,
} from "@/redux/features/admin/adminApi";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { type ChangeEvent, useEffect, useState } from "react";
import type { SubmitHandler } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import Image from "next/image";

const updateBannerValidationSchema = z.object({
  title: z.string().min(1, "Title is required"),
  subtitle: z.string().min(1, "Subtitle is required"),
  description: z.string().min(1, "Description is required"),
});

type FormData = z.infer<typeof updateBannerValidationSchema>;

interface UpdateBannerProps {
  bannerId: string;
}

export default function UpdateBanner({ bannerId }: UpdateBannerProps) {
  const router = useRouter();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [currentImage, setCurrentImage] = useState<string>("");
  const [bannerData, setBannerData] = useState<FormData | null>(null);

  const {
    data: bannerResponse,
    isLoading: isFetching,
    isError: fetchError,
  } = useGetSingleBannerByIdQuery(bannerId);

  const [updateBanner, { isLoading }] =
    useUpdateBannerMutation();

  useEffect(() => {
    if (bannerResponse?.data) {
      const banner = bannerResponse.data;
      setBannerData({
        title: banner.title || "",
        subtitle: banner.subtitle || "",
        description: banner.description || "",
      });
      setCurrentImage(banner.image || "");
    }
  }, [bannerResponse]);

  const onSubmit: SubmitHandler<FormData> = async (formData: FormData) => {
    const data = new FormData();
    if (imageFile) data.append("file", imageFile);
    data.append("title", formData.title);
    data.append("subtitle", formData.subtitle);
    data.append("description", formData.description);

    try {
      const res = await updateBanner({ id: bannerId, data }).unwrap();
      if (res?.success) {
        toast.success("Banner updated successfully");
        router.push("/admin/banner");
      } else {
        toast.error(res?.message || "Failed to update banner");
      }
    } catch (err: unknown) {
      const apiMessage = (err as any)?.data?.message || (err as any)?.error || (err as any)?.message;
      const errorMessage = apiMessage || "Failed to update banner";
      toast.error(errorMessage);
    }
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files![0];
    setImageFile(file);
  };

  useEffect(() => {
    // no-op: success/error handled in onSubmit via unwrap
  }, []);

  if (isFetching || !bannerData) {
    return (
      <div className="flex h-[calc(100vh-100px)] flex-col items-center justify-center border p-6">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading banner data...</span>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="flex h-[calc(100vh-100px)] flex-col items-center justify-center border p-6">
        <p className="text-red-500">
          Failed to load banner data. Please try again.
        </p>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-100px)] flex-col items-center justify-center border p-6">
      <h3 className="mb-4 text-2xl font-semibold text-gray-800">
        Update Banner
      </h3>
      <div className="w-full max-w-2xl rounded-lg bg-white p-8 shadow-md">
        <SMForm
          key={bannerId}
          resolver={zodResolver(updateBannerValidationSchema)}
          onSubmit={onSubmit}
          defaultValues={bannerData}
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
            {currentImage && !imageFile && (
              <div className="mt-2 mb-2">
                <Image
                  src={currentImage || "/placeholder.svg"}
                  alt="Current banner"
                  width={128}
                  height={80}
                  className="h-20 w-32 object-cover rounded border"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Current image (upload new to replace)
                </p>
              </div>
            )}
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
            {isLoading ? "Updating..." : "Update Banner"}
          </Button>
        </SMForm>
      </div>
    </div>
  );
}
