/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import SMForm from "@/components/form/SMForm";
import SMInput from "@/components/form/SMInput";
import SMTextArea from "@/components/form/SMTexrtArea";
import { Button } from "@/components/ui/button";
import { useGetAboutByOrganizationQuery, useUpdateAboutMutation } from "@/redux/features/about/aboutApi";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { type ChangeEvent, useEffect, useState } from "react";
import type { SubmitHandler } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";

const updateAboutValidationSchema = z.object({
  description: z.string().optional(),
  stats: z.object({
    student: z.string().optional(),
    teacher: z.string().optional(),
    year: z.string().optional(),
    passPercentage: z.string().optional(),
  }).optional(),
  mapUrl: z.string().url().optional().or(z.literal("")),
  ejpublickey: z.string().optional(),
  ejservicekey: z.string().optional(),
  ejtemplateid: z.string().optional(),
});

type FormData = z.infer<typeof updateAboutValidationSchema>;

export default function UpdateAboutPage() {
  const router = useRouter();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [currentImage, setCurrentImage] = useState<string>("");
  const [aboutData, setAboutData] = useState<FormData | null>(null);

  const { data: aboutResponse, isLoading: isFetching, isError: fetchError } = useGetAboutByOrganizationQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  const [updateAbout, { isLoading }] = useUpdateAboutMutation();

  useEffect(() => {
    if (aboutResponse?.data) {
      const about = aboutResponse.data;
      setAboutData({
        description: about.description || "",
        stats: {
          student: about.stats?.student || "",
          teacher: about.stats?.teacher || "",
          year: about.stats?.year || "",
          passPercentage: about.stats?.passPercentage || "",
        },
        mapUrl: about.mapUrl || "",
        ejpublickey: about.ejpublickey || "",
        ejservicekey: about.ejservicekey || "",
        ejtemplateid: about.ejtemplateid || "",
      });
      setCurrentImage(about.image || "");
    }
  }, [aboutResponse]);

  const onSubmit: SubmitHandler<FormData> = async (formData: FormData) => {
    const payload = new FormData();

    if (imageFile) {
      payload.append("file", imageFile);
    }

    // Filter out empty strings and undefined values
    const updateData: Record<string, any> = {};
    
    if (formData.description && formData.description.trim()) {
      updateData.description = formData.description;
    }

    if (formData.mapUrl && formData.mapUrl.trim()) {
      updateData.mapUrl = formData.mapUrl;
    }

    if (formData.ejpublickey && formData.ejpublickey.trim()) {
      updateData.ejpublickey = formData.ejpublickey;
    }

    if (formData.ejservicekey && formData.ejservicekey.trim()) {
      updateData.ejservicekey = formData.ejservicekey;
    }

    if (formData.ejtemplateid && formData.ejtemplateid.trim()) {
      updateData.ejtemplateid = formData.ejtemplateid;
    }

    // Handle stats object
    if (formData.stats) {
      const stats: Record<string, string> = {};
      if (formData.stats.student && formData.stats.student.trim()) {
        stats.student = formData.stats.student;
      }
      if (formData.stats.teacher && formData.stats.teacher.trim()) {
        stats.teacher = formData.stats.teacher;
      }
      if (formData.stats.year && formData.stats.year.trim()) {
        stats.year = formData.stats.year;
      }
      if (formData.stats.passPercentage && formData.stats.passPercentage.trim()) {
        stats.passPercentage = formData.stats.passPercentage;
      }
      
      if (Object.keys(stats).length > 0) {
        updateData.stats = stats;
      }
    }

    payload.append("data", JSON.stringify(updateData));
    try {
      const res: any = await updateAbout(payload).unwrap();
      if (res?.success) {
        toast.success("About information updated successfully");
        router.push("/admin/about");
      } else {
        toast.error(res?.message || "Failed to update about information");
      }
    } catch (err: any) {
      const apiMessage = err?.data?.message || err?.error || err?.message;
      const errorMessage = apiMessage || "Failed to update about information";
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

  if (isFetching || !aboutData) {
    return (
      <div className="flex h-[calc(100vh-100px)] flex-col items-center justify-center border p-6">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading about information...</span>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="flex h-[calc(100vh-100px)] flex-col items-center justify-center border p-6">
        <p className="text-red-500">Failed to load about information.</p>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-100px)] flex-col items-center justify-center border p-6">
      <div className="w-full max-w-4xl">
        <div className="mb-4">
          <Link href="/admin/about">
            <Button variant="outline" className="gap-2 bg-transparent">
              <ArrowLeft className="h-4 w-4" />
              Back to About
            </Button>
          </Link>
        </div>
        <h3 className="mb-4 text-2xl font-semibold text-gray-800">
          Update About Information
        </h3>
        <div className="rounded-lg bg-white p-8 shadow-md">
          <SMForm
            resolver={zodResolver(updateAboutValidationSchema)}
            onSubmit={onSubmit}
            defaultValues={aboutData}
          >
            <div className="mb-6">
              <SMTextArea 
                label="Description" 
                name="description" 
                placeholder="Enter about description..."
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Image
              </label>
              {currentImage && !imageFile && (
                <div className="mt-2 mb-2">
                  <img
                    src={currentImage}
                    alt="Current about"
                    className="h-20 w-20 object-cover rounded-lg border"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Current image (upload new to replace)
                  </p>
                </div>
              )}
              <input
                className="block w-full rounded border-gray-300 text-sm text-gray-800 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
            </div>

            <div className="mb-6">
              <SMInput 
                label="Map URL" 
                name="mapUrl" 
                type="url"
                placeholder="https://maps.google.com/..."
              />
            </div>

            {/* Statistics Section */}
            <div className="mb-6">
              <h4 className="text-lg font-medium text-gray-900 mb-4">Statistics</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <SMInput 
                  label="Number of Students" 
                  name="stats.student" 
                  placeholder="e.g., 500"
                />
                <SMInput 
                  label="Number of Teachers" 
                  name="stats.teacher" 
                  placeholder="e.g., 50"
                />
                <SMInput 
                  label="Years of Experience" 
                  name="stats.year" 
                  placeholder="e.g., 25"
                />
                <SMInput 
                  label="Pass Percentage" 
                  name="stats.passPercentage" 
                  placeholder="e.g., 95"
                />
              </div>
            </div>

            {/* EmailJS Configuration Section */}
            <div className="mb-6">
              <h4 className="text-lg font-medium text-gray-900 mb-4">EmailJS Configuration</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <SMInput 
                  label="Public Key" 
                  name="ejpublickey" 
                  placeholder="EmailJS public key"
                />
                <SMInput 
                  label="Service Key" 
                  name="ejservicekey" 
                  placeholder="EmailJS service key"
                />
                <SMInput 
                  label="Template ID" 
                  name="ejtemplateid" 
                  placeholder="EmailJS template ID"
                />
              </div>
            </div>

            <Button
              className="w-full bg-indigo-600 text-white hover:bg-indigo-700"
              size="lg"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? "Updating..." : "Update About Information"}
            </Button>
          </SMForm>
        </div>
      </div>
    </div>
  );
}
