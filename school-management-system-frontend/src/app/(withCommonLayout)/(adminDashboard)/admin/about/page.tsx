/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useGetAboutByOrganizationQuery } from "@/redux/features/about/aboutApi";
import {
  Loader2,
  Plus,
  Edit,
  Trash2,
  Image as ImageIcon,
  Info,
  Users,
  Calendar,
  TrendingUp,
  Mail,
  Building2,
  MapPin,
  FileText,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import { useDeleteAboutMutation } from "@/redux/features/about/aboutApi";

export default function AboutPage() {
  const {
    data: aboutResponse,
    isLoading,
    isError,
  } = useGetAboutByOrganizationQuery({});
  const [deleteAbout, { isLoading: isDeleting }] = useDeleteAboutMutation();

  const about = aboutResponse?.data;

  const handleDelete = async () => {
    if (!about?._id) return;

    try {
      await deleteAbout(about._id).unwrap();
      toast.success("About information deleted successfully");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to delete about information");
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-100px)] flex-col items-center justify-center border p-6">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-indigo-600" />
          <span className="text-lg text-gray-600">
            Loading about information...
          </span>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex h-[calc(100vh-100px)] flex-col items-center justify-center border p-6">
        <div className="flex flex-col items-center space-y-4">
          <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
            <Info className="h-6 w-6 text-red-600" />
          </div>
          <p className="text-lg text-red-600 font-medium">
            Failed to load about information.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-100px)] bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                About Information
              </h1>
              <p className="text-gray-600">
                Manage your organization&apos;s about page content
              </p>
            </div>
            {!about ? (
              <Link href="/admin/about/create">
                <Button className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200">
                  <Plus className="h-5 w-5" />
                  Create About
                </Button>
              </Link>
            ) : (
              <div className="flex gap-3">
                <Link href="/admin/about/update">
                  <Button
                    variant="outline"
                    className="gap-2 border-2 hover:bg-gray-50 px-6 py-3 rounded-lg transition-all duration-200"
                  >
                    <Edit className="h-5 w-5" />
                    Update About
                  </Button>
                </Link>
                <Button
                  variant="destructive"
                  className="gap-2 px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
                  onClick={handleDelete}
                  disabled={isDeleting}
                >
                  <Trash2 className="h-5 w-5" />
                  {isDeleting ? "Deleting..." : "Delete"}
                </Button>
              </div>
            )}
          </div>
        </div>

        {!about ? (
          /* Empty State */
          <Card className="border-2 border-dashed border-gray-300 bg-white/50 backdrop-blur-sm">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="h-24 w-24 rounded-full bg-indigo-100 flex items-center justify-center mb-6">
                <ImageIcon className="h-12 w-12 text-indigo-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                No About Information Found
              </h3>
              <p className="text-gray-600 text-center mb-8 max-w-md">
                You haven&apos;t created any about information yet. Create one
                to showcase your organization&apos;s story and achievements.
              </p>
              <Link href="/admin/about/create">
                <Button className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 text-lg">
                  <Plus className="h-6 w-6" />
                  Create About Information
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          /* Content Grid */
          <div className="grid gap-8">
            {/* Main Information Card */}
            <Card className="bg-white shadow-lg border-0 rounded-xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center">
                    <Info className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-2xl">About Information</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-8">
                <div className="grid md:grid-cols-2 gap-8">
                  {about.image && (
                    <div className="space-y-3">
                      <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                        <ImageIcon className="h-5 w-5 text-indigo-600" />
                        Featured Image
                      </h4>
                      <div className="relative group">
                        <Image
                          src={about.image}
                          alt="About"
                          width={500}
                          height={250}
                          className="w-full h-64 object-cover rounded-lg border-2 border-gray-200 group-hover:border-indigo-300 transition-all duration-200"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-200 rounded-lg"></div>
                      </div>
                    </div>
                  )}

                  <div className="space-y-6">
                    {about.description && (
                      <div className="space-y-3">
                        <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                          <FileText className="h-5 w-5 text-indigo-600" />
                          Description
                        </h4>
                        <p className="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-lg border-l-4 border-indigo-500">
                          {about.description}
                        </p>
                      </div>
                    )}

                    {about.mapUrl && (
                      <div className="space-y-3">
                        <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                          <MapPin className="h-5 w-5 text-indigo-600" />
                          Location
                        </h4>
                        <a
                          href={about.mapUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-medium transition-colors duration-200"
                        >
                          <MapPin className="h-4 w-4" />
                          View on Google Maps
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Statistics Card */}
            {about.stats && (
              <Card className="bg-white shadow-lg border-0 rounded-xl overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-600 text-white">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center">
                      <TrendingUp className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-2xl">
                      Statistics & Achievements
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="p-8">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {about.stats.student && (
                      <div className="text-center group">
                        <div className="h-20 w-20 mx-auto rounded-full bg-blue-100 flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-all duration-200">
                          <Users className="h-8 w-8 text-blue-600" />
                        </div>
                        <div className="text-3xl font-bold text-blue-600 mb-2">
                          {about.stats.student}
                        </div>
                        <div className="text-sm text-gray-600 font-medium">
                          Students
                        </div>
                      </div>
                    )}
                    {about.stats.teacher && (
                      <div className="text-center group">
                        <div className="h-20 w-20 mx-auto rounded-full bg-green-100 flex items-center justify-center mb-4 group-hover:bg-green-200 transition-all duration-200">
                          <Users className="h-8 w-8 text-green-600" />
                        </div>
                        <div className="text-3xl font-bold text-green-600 mb-2">
                          {about.stats.teacher}
                        </div>
                        <div className="text-sm text-gray-600 font-medium">
                          Teachers
                        </div>
                      </div>
                    )}
                    {about.stats.year && (
                      <div className="text-center group">
                        <div className="h-20 w-20 mx-auto rounded-full bg-purple-100 flex items-center justify-center mb-4 group-hover:bg-purple-200 transition-all duration-200">
                          <Calendar className="h-8 w-8 text-purple-600" />
                        </div>
                        <div className="text-3xl font-bold text-purple-600 mb-2">
                          {about.stats.year}
                        </div>
                        <div className="text-sm text-gray-600 font-medium">
                          Years
                        </div>
                      </div>
                    )}
                    {about.stats.passPercentage && (
                      <div className="text-center group">
                        <div className="h-20 w-20 mx-auto rounded-full bg-orange-100 flex items-center justify-center mb-4 group-hover:bg-orange-200 transition-all duration-200">
                          <TrendingUp className="h-8 w-8 text-orange-600" />
                        </div>
                        <div className="text-3xl font-bold text-orange-600 mb-2">
                          {about.stats.passPercentage}%
                        </div>
                        <div className="text-sm text-gray-600 font-medium">
                          Pass Rate
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* EmailJS Configuration Card */}
            {(about.ejpublickey ||
              about.ejservicekey ||
              about.ejtemplateid) && (
              <Card className="bg-white shadow-lg border-0 rounded-xl overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-orange-600 to-red-600 text-white">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center">
                      <Mail className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-2xl">
                      EmailJS Configuration
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="p-8">
                  <div className="grid md:grid-cols-3 gap-6">
                    {about.ejpublickey && (
                      <div className="space-y-3">
                        <h4 className="font-semibold text-gray-900">
                          Public Key
                        </h4>
                        <Badge
                          variant="secondary"
                          className="text-sm px-3 py-2 bg-gray-100 text-gray-800 font-mono"
                        >
                          {about.ejpublickey}
                        </Badge>
                      </div>
                    )}
                    {about.ejservicekey && (
                      <div className="space-y-3">
                        <h4 className="font-semibold text-gray-900">
                          Service Key
                        </h4>
                        <Badge
                          variant="secondary"
                          className="text-sm px-3 py-2 bg-gray-100 text-gray-800 font-mono"
                        >
                          {about.ejservicekey}
                        </Badge>
                      </div>
                    )}
                    {about.ejtemplateid && (
                      <div className="space-y-3">
                        <h4 className="font-semibold text-gray-900">
                          Template ID
                        </h4>
                        <Badge
                          variant="secondary"
                          className="text-sm px-3 py-2 bg-gray-100 text-gray-800 font-mono"
                        >
                          {about.ejtemplateid}
                        </Badge>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Organization Info Card */}
            <Card className="bg-white shadow-lg border-0 rounded-xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-gray-600 to-gray-800 text-white">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center">
                    <Building2 className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-2xl">
                    Organization Information
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-8">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                      <Building2 className="h-5 w-5 text-gray-600" />
                      <div>
                        <p className="text-sm text-gray-600">
                          Organization Name
                        </p>
                        <p className="font-semibold text-gray-900">
                          {about.organization.name}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                      <MapPin className="h-5 w-5 text-gray-600" />
                      <div>
                        <p className="text-sm text-gray-600">Subdomain</p>
                        <p className="font-semibold text-gray-900">
                          {about.organization.subdomain}
                        </p>
                      </div>
                    </div>
                  </div>
                  {about.organization.customdomain && (
                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                      <MapPin className="h-5 w-5 text-gray-600" />
                      <div>
                        <p className="text-sm text-gray-600">Custom Domain</p>
                        <p className="font-semibold text-gray-900">
                          {about.organization.customdomain}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
