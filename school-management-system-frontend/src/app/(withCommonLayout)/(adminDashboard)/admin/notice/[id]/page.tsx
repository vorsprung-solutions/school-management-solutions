"use client";

import SMForm from "@/components/form/SMForm";
import SMInput from "@/components/form/SMInput";
import SMTextArea from "@/components/form/SMTexrtArea";
import SMSelect from "@/components/form/SMSelect";
import { Button } from "@/components/ui/button";
import {
  useUpdateNoticeMutation,
  useGetSingleNoticeByIdQuery,
} from "@/redux/features/admin/adminApi";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { type ChangeEvent, useEffect, useState, use } from "react";
import type { SubmitHandler } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const updateNoticeValidationSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  priority: z.string().optional(),
});

type FormData = z.infer<typeof updateNoticeValidationSchema>;

const priorityOptions = [
  { label: "Normal", value: "normal" },
  { label: "Low", value: "low" },
  { label: "Medium", value: "medium" },
  { label: "High", value: "high" },
];

interface UpdateNoticeProps {
  params: Promise<{
    id: string;
  }>;
}

export default function UpdateNoticePage({ params }: UpdateNoticeProps) {
  const router = useRouter();
  const { id } = use(params);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [currentImage, setCurrentImage] = useState<string>("");
  const [noticeData, setNoticeData] = useState<FormData | null>(null);

  const {
    data: noticeResponse,
    isLoading: isFetching,
    isError: fetchError,
  } = useGetSingleNoticeByIdQuery(id);

  const [updateNotice, { isLoading }] =
    useUpdateNoticeMutation();

  useEffect(() => {
    if (noticeResponse?.data) {
      const notice = noticeResponse.data;
      setNoticeData({
        title: notice.title || "",
        description: notice.description || "",
        priority: notice.priority || "normal",
      });
      setCurrentImage(notice.image || "");
    }
  }, [noticeResponse]);

  const onSubmit: SubmitHandler<FormData> = async (formData: FormData) => {
    const data = new FormData();
    if (imageFile) data.append("file", imageFile);
    data.append(
      "data",
      JSON.stringify({
        title: formData.title,
        description: formData.description,
        priority: formData.priority || "normal",
      })
    );

    try {
      const res = await updateNotice({ id, data }).unwrap();
      if (res?.success) {
        toast.success("Notice updated successfully");
        router.push("/admin/notice");
      } else {
        toast.error(res?.message || "Failed to update notice");
      }
    } catch (err: unknown) {
      const apiMessage = (err as any)?.data?.message || (err as any)?.error || (err as any)?.message;
      const errorMessage = apiMessage || "Failed to update notice";
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

  if (isFetching || !noticeData) {
    return (
      <div className="flex h-[calc(100vh-100px)] flex-col items-center justify-center border p-6">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading notice data...</span>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="flex h-[calc(100vh-100px)] flex-col items-center justify-center border p-6">
        <p className="text-red-500">
          Failed to load notice data. Please try again.
        </p>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-100px)] flex-col items-center justify-center border p-6">
      <div className="w-full max-w-2xl">
        <div className="mb-4">
          <Link href="/admin/notice">
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Notices
            </Button>
          </Link>
        </div>
        <h3 className="mb-4 text-2xl font-semibold text-gray-800">
          Update Notice
        </h3>
        <div className="rounded-lg bg-white p-8 shadow-md">
          <SMForm
            key={id}
            resolver={zodResolver(updateNoticeValidationSchema)}
            onSubmit={onSubmit}
            defaultValues={noticeData}
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
              {currentImage && !imageFile && (
                <div>
                  <Image
                    src={currentImage || "/placeholder.svg"}
                    alt="Current notice"
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
              {isLoading ? "Updating..." : "Update Notice"}
            </Button>
          </SMForm>
        </div>
      </div>
    </div>
  );
}
