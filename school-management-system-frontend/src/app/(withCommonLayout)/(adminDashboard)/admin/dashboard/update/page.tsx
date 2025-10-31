/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import SMForm from "@/components/form/SMForm";
import SMInput from "@/components/form/SMInput";
import SMTextArea from "@/components/form/SMTexrtArea";
import { Button } from "@/components/ui/button";
import { useGetOrganizationByUserQuery, useUpdateOrganizationMutation } from "@/redux/features/organization/organizationApi";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useState, ChangeEvent } from "react";
import { SubmitHandler } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { ArrowLeft, Loader2, Image as ImageIcon } from "lucide-react";
import Link from "next/link";

const updateOrganizationValidationSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email format"),
  phone: z.string()
    .min(1, "Phone number is required")
    .refine((val) => {
      const num = parseInt(val, 10);
      return !isNaN(num) && num >= 100000000;
    }, "Phone number must be at least 9 digits"),
  ephone: z.string()
    .optional()
    .refine((val) => {
      if (!val) return true;
      const num = parseInt(val, 10);
      return !isNaN(num) && num >= 100000000;
    }, "Emergency phone must be at least 9 digits"),
  est: z.string().optional(),
  address: z.string().min(1, "Address is required"),
  subdomain: z.string().min(3, "Subdomain must be at least 3 characters"),
  customdomain: z.string().optional(),
  socialFacebook: z.string().optional().or(z.literal("")),
  socialYoutube: z.string().optional().or(z.literal("")),
  socialInstagram: z.string().optional().or(z.literal("")),
  socialTwitter: z.string().optional().or(z.literal("")),
});

type FormData = z.infer<typeof updateOrganizationValidationSchema>;

export default function UpdateOrganizationPage() {
  const router = useRouter();
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [currentLogo, setCurrentLogo] = useState<string>("");
  const [organizationData, setOrganizationData] = useState<FormData | null>(null);

  const { data: organizationResponse, isLoading: isFetching, isError: fetchError } = useGetOrganizationByUserQuery();
  const [updateOrganization, { isLoading }] = useUpdateOrganizationMutation();



  useEffect(() => {
    if (organizationResponse?.data) {
      const org = organizationResponse.data;
      const formData: FormData = {
        name: org.name,
        email: org.email,
        phone: org.phone.toString(),
        ephone: org.ephone?.toString() || "",
        est: org.est || "",
        address: org.address,
        subdomain: org.subdomain,
        customdomain: org.customdomain || "",
                 socialFacebook: org.social?.facebook || "",
         socialYoutube: org.social?.youtube || "",
         socialInstagram: org.social?.instagram || "",
         socialTwitter: org.social?.twitter || "",
      };
      setOrganizationData(formData);
      setCurrentLogo(org.logo || "");
    }
  }, [organizationResponse]);

  const onSubmit: SubmitHandler<FormData> = async (formData: FormData) => {
    const payload = new FormData();
    
    // Add form fields
    payload.append("name", formData.name);
    payload.append("email", formData.email);
    payload.append("phone", formData.phone);
    if (formData.ephone) payload.append("ephone", formData.ephone);
    if (formData.est) payload.append("est", formData.est);
    payload.append("address", formData.address);
    payload.append("subdomain", formData.subdomain);
    if (formData.customdomain) payload.append("customdomain", formData.customdomain);
    
    // Add required fields that should not be changed by admin
    // These are read-only fields that maintain the organization's subscription status
    if (organizationResponse?.data) {
      payload.append("plan_type", organizationResponse.data.plan_type);
      payload.append("subscription_status", organizationResponse.data.subscription_status);
    }
    
    // Add social media links as JSON string - always send social field
    const socialData: any = {};
    
    if (formData.socialFacebook && formData.socialFacebook.trim()) {
      socialData.facebook = formData.socialFacebook.trim();
    }
    if (formData.socialYoutube && formData.socialYoutube.trim()) {
      socialData.youtube = formData.socialYoutube.trim();
    }
    if (formData.socialInstagram && formData.socialInstagram.trim()) {
      socialData.instagram = formData.socialInstagram.trim();
    }
    if (formData.socialTwitter && formData.socialTwitter.trim()) {
      socialData.twitter = formData.socialTwitter.trim();
    }
    
    // Always send social field, even if empty
    payload.append("social", JSON.stringify(socialData));
    
    // Add logo file if selected
    if (logoFile) {
      payload.append("file", logoFile);
    }

    try {
      const res: any = await updateOrganization({ formData: payload }).unwrap();
      if (res?.success) {
        toast.success("Organization updated successfully");
        router.push("/admin/organization");
      } else {
        toast.error(res?.message || "Failed to update organization");
      }
    } catch (err: any) {
      const apiMessage = err?.data?.message || err?.error || err?.message;
      const errorMessage = apiMessage || "Failed to update organization";
      toast.error(errorMessage);
    }
  };

  const handleLogoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
    }
  };

  useEffect(() => {
    // no-op: success/error handled in onSubmit via unwrap
  }, []);

  if (isFetching || !organizationData) {
    return (
      <div className="flex h-[calc(100vh-100px)] flex-col items-center justify-center border p-6">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-indigo-600" />
          <span className="text-lg text-gray-600">Loading organization information...</span>
        </div>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="flex h-[calc(100vh-100px)] flex-col items-center justify-center border p-6">
        <div className="flex flex-col items-center space-y-4">
          <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
            <ImageIcon className="h-6 w-6 text-red-600" />
          </div>
          <p className="text-lg text-red-600 font-medium">Failed to load organization information.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-100px)] bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/admin/dashboard">
              <Button variant="outline" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Organization
              </Button>
            </Link>
          </div>
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Update Organization</h1>
            <p className="text-gray-600">Update your organization information and settings</p>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-xl shadow-lg border-0 overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6">
            <h2 className="text-2xl font-bold">Organization Details</h2>
            <p className="text-indigo-100">Update your organization&apos;s basic information</p>
          </div>
          
          <div className="p-8">
            <SMForm
              resolver={zodResolver(updateOrganizationValidationSchema)}
              onSubmit={onSubmit}
              defaultValues={organizationData}
            >
              <div className="grid gap-8">
                {/* Basic Information Section */}
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-gray-900 border-b pb-2">Basic Information</h3>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <SMInput
                      name="name"
                      label="Organization Name"
                      placeholder="Enter organization name"
                    />
                    
                    <SMInput
                      name="email"
                      label="Email Address"
                      type="email"
                      placeholder="Enter email address"
                    />
                    
                    <SMInput
                      name="phone"
                      label="Phone Number"
                      placeholder="Enter phone number"
                    />
                    
                    <SMInput
                      name="ephone"
                      label="Emergency Phone (Optional)"
                      placeholder="Enter emergency phone number"
                    />
                    
                    <SMInput
                      name="est"
                      label="Established Year (Optional)"
                      placeholder="e.g., 1995"
                    />
                    
                    <SMInput
                      name="subdomain"
                      label="Subdomain"
                      placeholder="Enter subdomain"
                    />
                  </div>
                  
                  <SMInput
                    name="customdomain"
                    label="Custom Domain (Optional)"
                    placeholder="Enter custom domain"
                  />
                  
                  <SMTextArea
                    name="address"
                    label="Address"
                    placeholder="Enter organization address"
                  />
                </div>

                {/* Logo Upload Section */}
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-gray-900 border-b pb-2">Organization Logo</h3>
                  
                  <div className="space-y-4">
                    {currentLogo && (
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Current Logo</label>
                        <div className="relative w-32 h-32">
                          <img
                            src={currentLogo}
                            alt="Current Logo"
                            className="w-full h-full object-contain border-2 border-gray-200 rounded-lg"
                          />
                        </div>
                      </div>
                    )}
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        {currentLogo ? "Update Logo" : "Upload Logo"}
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleLogoChange}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                      />
                      <p className="text-xs text-gray-500">
                        Recommended size: 512x512 pixels. Max file size: 5MB.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Social Media Section */}
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-gray-900 border-b pb-2">Social Media Links</h3>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                                         <SMInput
                       name="socialFacebook"
                       label="Facebook URL (Optional)"
                       placeholder="https://facebook.com/yourpage"
                       type="url"
                     />
                     
                     <SMInput
                       name="socialYoutube"
                       label="YouTube URL (Optional)"
                       placeholder="https://youtube.com/yourchannel"
                       type="url"
                     />
                     
                     <SMInput
                       name="socialInstagram"
                       label="Instagram URL (Optional)"
                       placeholder="https://instagram.com/yourprofile"
                       type="url"
                     />
                     
                     <SMInput
                       name="socialTwitter"
                       label="Twitter URL (Optional)"
                       placeholder="https://twitter.com/yourprofile"
                       type="url"
                     />
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end gap-4 pt-6 border-t">
                  <Link href="/admin/organization">
                    <Button variant="outline" type="button">
                      Cancel
                    </Button>
                  </Link>
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Updating...
                      </>
                    ) : (
                      "Update Organization"
                    )}
                  </Button>
                </div>
              </div>
            </SMForm>
          </div>
        </div>
      </div>
    </div>
  );
}
