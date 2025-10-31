"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useGetOrganizationByUserQuery } from "@/redux/features/organization/organizationApi";
import {
  Loader2,
  Edit,
  Building2,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Globe,
  Image as ImageIcon,
  Info,
  Facebook,
  Youtube,
  Instagram,
  Twitter,
  ExternalLink,
  Clock,
  CreditCard,
  Shield,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function AdminProfile() {
  const {
    data: organizationResponse,
    isLoading,
    isError,
  } = useGetOrganizationByUserQuery();

  const organization = organizationResponse?.data;

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-100px)] flex-col items-center justify-center border p-6">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-indigo-600" />
          <span className="text-lg text-gray-600">
            Loading organization information...
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
            Failed to load organization information.
          </p>
        </div>
      </div>
    );
  }

  if (!organization) {
    return (
      <div className="flex h-[calc(100vh-100px)] flex-col items-center justify-center border p-6">
        <div className="flex flex-col items-center space-y-4">
          <div className="h-12 w-12 rounded-full bg-yellow-100 flex items-center justify-center">
            <Info className="h-6 w-6 text-yellow-600" />
          </div>
          <p className="text-lg text-yellow-600 font-medium">
            No organization information found.
          </p>
        </div>
      </div>
    );
  }

  const getPlanTypeColor = (planType: string) => {
    switch (planType) {
      case "monthly":
        return "bg-blue-100 text-blue-800";
      case "yearly":
        return "bg-green-100 text-green-800";
      case "lifetime":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    return status === "active"
      ? "bg-green-100 text-green-800"
      : "bg-red-100 text-red-800";
  };

  return (
    <div className="min-h-[calc(100vh-100px)] bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Organization Information
              </h1>
              <p className="text-gray-600">
                View and manage your organization details
              </p>
            </div>
            <Link href="/admin/dashboard/update">
              <Button className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200">
                <Edit className="h-5 w-5" />
                Update Organization
              </Button>
            </Link>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid gap-8">
          {/* Basic Information Card */}
          <Card className="bg-white shadow-lg border-0 rounded-xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center">
                  <Building2 className="h-6 w-6" />
                </div>
                <CardTitle className="text-2xl">Basic Information</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-8">
              <div className="grid md:grid-cols-2 gap-8">
                {organization.logo && (
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                      <ImageIcon className="h-5 w-5 text-indigo-600" />
                      Organization Logo
                    </h4>
                    <div className="relative group">
                      <Image
                        src={organization.logo}
                        alt="Organization Logo"
                        width={500}
                        height={256}
                        className="w-full h-64 object-contain rounded-lg border-2 border-gray-200 group-hover:border-indigo-300 transition-all duration-200 bg-gray-50"
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                      <Building2 className="h-5 w-5 text-gray-600" />
                      <div>
                        <p className="text-sm text-gray-600">
                          Organization Name
                        </p>
                        <p className="font-semibold text-gray-900">
                          {organization.name}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                      <Mail className="h-5 w-5 text-gray-600" />
                      <div>
                        <p className="text-sm text-gray-600">Email Address</p>
                        <p className="font-semibold text-gray-900">
                          {organization.email}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                      <Phone className="h-5 w-5 text-gray-600" />
                      <div>
                        <p className="text-sm text-gray-600">Phone Number</p>
                        <p className="font-semibold text-gray-900">
                          {organization.phone}
                        </p>
                      </div>
                    </div>

                    {organization.ephone && (
                      <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                        <Phone className="h-5 w-5 text-gray-600" />
                        <div>
                          <p className="text-sm text-gray-600">
                            Emergency Phone
                          </p>
                          <p className="font-semibold text-gray-900">
                            {organization.ephone}
                          </p>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                      <MapPin className="h-5 w-5 text-gray-600" />
                      <div>
                        <p className="text-sm text-gray-600">Address</p>
                        <p className="font-semibold text-gray-900">
                          {organization.address}
                        </p>
                      </div>
                    </div>

                    {organization.est && (
                      <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                        <Calendar className="h-5 w-5 text-gray-600" />
                        <div>
                          <p className="text-sm text-gray-600">Established</p>
                          <p className="font-semibold text-gray-900">
                            {organization.est}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Domain Information Card */}
          <Card className="bg-white shadow-lg border-0 rounded-xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-600 text-white">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center">
                  <Globe className="h-6 w-6" />
                </div>
                <CardTitle className="text-2xl">Domain Information</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-8">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                    <Globe className="h-5 w-5 text-gray-600" />
                    <div>
                      <p className="text-sm text-gray-600">Subdomain</p>
                      <p className="font-semibold text-gray-900">
                        {organization.subdomain}
                      </p>
                    </div>
                  </div>

                  {organization.customdomain && (
                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                      <ExternalLink className="h-5 w-5 text-gray-600" />
                      <div>
                        <p className="text-sm text-gray-600">Custom Domain</p>
                        <p className="font-semibold text-gray-900">
                          {organization.customdomain}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Subscription Information Card */}
          <Card className="bg-white shadow-lg border-0 rounded-xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-orange-600 to-red-600 text-white">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center">
                  <CreditCard className="h-6 w-6" />
                </div>
                <CardTitle className="text-2xl">
                  Subscription Information
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-8">
              <div className="grid md:grid-cols-3 gap-6">
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900">Plan Type</h4>
                  <Badge
                    className={`px-3 py-2 text-sm font-medium ${getPlanTypeColor(
                      organization.plan_type
                    )}`}
                  >
                    {organization.plan_type.charAt(0).toUpperCase() +
                      organization.plan_type.slice(1)}
                  </Badge>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900">Status</h4>
                  <Badge
                    className={`px-3 py-2 text-sm font-medium ${getStatusColor(
                      organization.subscription_status
                    )}`}
                  >
                    {organization.subscription_status.charAt(0).toUpperCase() +
                      organization.subscription_status.slice(1)}
                  </Badge>
                </div>

                {organization.expire_at && (
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-900">Expires At</h4>
                    <div className="flex items-center gap-2 text-gray-700">
                      <Clock className="h-4 w-4" />
                      <span>
                        {new Date(organization.expire_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Social Media Links Card */}
          {(organization.social?.facebook ||
            organization.social?.youtube ||
            organization.social?.instagram ||
            organization.social?.twitter) && (
            <Card className="bg-white shadow-lg border-0 rounded-xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center">
                    <ExternalLink className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-2xl">Social Media</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {organization.social?.facebook && (
                    <a
                      href={organization.social.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors duration-200"
                    >
                      <Facebook className="h-5 w-5 text-blue-600" />
                      <span className="font-medium text-blue-900">
                        Facebook
                      </span>
                    </a>
                  )}

                  {organization.social?.youtube && (
                    <a
                      href={organization.social.youtube}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-4 bg-red-50 rounded-lg hover:bg-red-100 transition-colors duration-200"
                    >
                      <Youtube className="h-5 w-5 text-red-600" />
                      <span className="font-medium text-red-900">YouTube</span>
                    </a>
                  )}

                  {organization.social?.instagram && (
                    <a
                      href={organization.social.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-4 bg-pink-50 rounded-lg hover:bg-pink-100 transition-colors duration-200"
                    >
                      <Instagram className="h-5 w-5 text-pink-600" />
                      <span className="font-medium text-pink-900">
                        Instagram
                      </span>
                    </a>
                  )}

                  {organization.social?.twitter && (
                    <a
                      href={organization.social.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-4 bg-sky-50 rounded-lg hover:bg-sky-100 transition-colors duration-200"
                    >
                      <Twitter className="h-5 w-5 text-sky-600" />
                      <span className="font-medium text-sky-900">Twitter</span>
                    </a>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* System Information Card */}
          <Card className="bg-white shadow-lg border-0 rounded-xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-gray-600 to-gray-800 text-white">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center">
                  <Shield className="h-6 w-6" />
                </div>
                <CardTitle className="text-2xl">System Information</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-8">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                    <Calendar className="h-5 w-5 text-gray-600" />
                    <div>
                      <p className="text-sm text-gray-600">Created At</p>
                      <p className="font-semibold text-gray-900">
                        {new Date(organization.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                    <Clock className="h-5 w-5 text-gray-600" />
                    <div>
                      <p className="text-sm text-gray-600">Last Updated</p>
                      <p className="font-semibold text-gray-900">
                        {new Date(organization.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
