/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import {
  Download,
  Calendar,
  FileText,
  ArrowLeft,
  Share2,
  Clock,
} from "lucide-react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useGetSingleNoticeByIdQuery } from "@/redux/features/admin/adminApi";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { format, formatDistanceToNow } from "date-fns";
import { useEffect } from "react";
import { toast } from "sonner";
import Image from "next/image";

export default function Notice() {
  const noticeId = useParams().id;
  const router = useRouter();
  const searchParams = useSearchParams();
  const isDownload = searchParams.get("download") === "true";

  const { data: singleNotice, isLoading } = useGetSingleNoticeByIdQuery(
    noticeId,
    {
      refetchOnMountOrArgChange: true,
      refetchOnFocus: true,
    }
  );

  const notice = singleNotice?.data;

  const formatDate = (dateString?: string) => {
    if (!dateString) return "No date";
    try {
      const date = new Date(dateString);
      return format(date, "EEEE, MMMM dd, yyyy");
    } catch {
      return dateString;
    }
  };

  const formatRelativeDate = (dateString?: string) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      return formatDistanceToNow(date, { addSuffix: true });
    } catch {
      return "";
    }
  };

  const handleDownloadPDF = () => {
    if (!notice) return;

    toast.success("Preparing PDF download...");

    // Create a new window for PDF generation
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>${notice.title} - Notice</title>
            <style>
              @media print {
                body { margin: 0; padding: 20px; }
                .no-print { display: none; }
              }
              body { 
                font-family: Arial, sans-serif; 
                margin: 0; 
                padding: 20px; 
                line-height: 1.6;
                color: #333;
              }
              .header { 
                text-align: center; 
                margin-bottom: 30px; 
                border-bottom: 2px solid #1D293D;
                padding-bottom: 20px;
              }
              .header h1 { 
                color: #1D293D; 
                margin: 0 0 10px 0;
                font-size: 24px;
              }
              .meta { 
                color: #666; 
                font-size: 14px;
                margin-bottom: 20px;
              }
              .image-container { 
                text-align: center; 
                margin: 20px 0;
                max-width: 100%;
              }
              .image-container img { 
                max-width: 100%; 
                height: auto;
                border: 1px solid #ddd;
                border-radius: 8px;
              }
              .content { 
                margin: 20px 0;
                font-size: 16px;
                line-height: 1.8;
              }
              .footer { 
                margin-top: 40px; 
                text-align: center; 
                color: #666;
                font-size: 12px;
                border-top: 1px solid #ddd;
                padding-top: 20px;
              }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>${notice.title}</h1>
              <div class="meta">
                <strong>Published:</strong> ${formatDate(notice.date)}<br>
                <strong>Generated:</strong> ${format(
                  new Date(),
                  "MMMM dd, yyyy at h:mm a"
                )}
              </div>
            </div>
            
            ${
              notice.image
                ? `
              <div class="image-container">
                <img src="${notice.image}" alt="Notice Image" />
              </div>
            `
                : ""
            }
            
            <div class="content">
              ${notice.description || "No description available"}
            </div>
            
            <div class="footer">
              <p>© ${new Date().getFullYear()} School Management System</p>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();

      // Wait for content to load then print
      setTimeout(() => {
        printWindow.print();
        toast.success("PDF download initiated!");
      }, 500);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: notice?.title || "Notice",
          text: notice?.description || "Check out this notice",
          url: window.location.href,
        })
        .then(() => {
          toast.success("Notice shared successfully!");
        })
        .catch(() => {
          toast.error("Failed to share notice");
        });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard
        .writeText(window.location.href)
        .then(() => {
          toast.success("Link copied to clipboard!");
        })
        .catch(() => {
          toast.error("Failed to copy link");
        });
    }
  };

  // Auto-download PDF if download parameter is present
  useEffect(() => {
    if (isDownload && notice) {
      handleDownloadPDF();
    }
  }, [isDownload, notice]);

  return (
    <div className="max-w-4xl mx-auto">
      {isLoading && <LoadingSingleNotice />}

      {!isLoading && notice && (
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="outline"
              onClick={() => router.back()}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Notices
            </Button>
          </div>

          {/* Main Content Card */}
          <Card className="overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 border-b pt-8">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
                    {notice.title}
                  </CardTitle>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {formatDate(notice.date)}
                    </div>
                    {formatRelativeDate(notice.date) && (
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {formatRelativeDate(notice.date)}
                      </div>
                    )}
                  </div>
                </div>
                <Badge className="bg-blue-100 text-blue-800">
                  Official Notice
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="p-6">
              {/* Notice Image */}
              {notice.image && (
                <div className="mb-6">
                  <div className="relative rounded-lg overflow-hidden border">
                    <Image
                      src={notice.image}
                      alt="Notice"
                      width={500}
                      height={256}
                      className="w-full h-auto max-h-96 object-contain"
                    />
                  </div>
                </div>
              )}

              <Separator className="my-6" />

              {/* Notice Description */}
              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Notice Details
                </h3>
                <div className="prose max-w-none">
                  <p className="text-gray-700 leading-relaxed">
                    {notice.description || "No description available"}
                  </p>
                </div>
              </div>

              <Separator className="my-6" />

              {/* Action Buttons */}
              <div className="flex justify-between items-center gap-3">
                <Button
                  onClick={handleDownloadPDF}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 cursor-pointer"
                >
                  <Download className="h-4 w-4" />
                  Download PDF
                </Button>
                <Button
                  variant="outline"
                  onClick={handleShare}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <Share2 className="h-4 w-4" />
                  Share
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Additional Info Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Notice Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-600">Published:</span>
                  <span className="ml-2 text-gray-900">
                    {formatDate(notice.date)}
                  </span>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Status:</span>
                  <Badge className="ml-2 bg-green-100 text-green-800">
                    Active
                  </Badge>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Category:</span>
                  <span className="ml-2 text-gray-900">General Notice</span>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Type:</span>
                  <span className="ml-2 text-gray-900">
                    Official Announcement
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {!isLoading && !notice && (
        <div className="text-center py-12">
          <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Notice Not Found
          </h3>
          <p className="text-gray-600">
            The requested notice could not be found.
          </p>
          <Button onClick={() => router.back()} className="mt-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Notices
          </Button>
        </div>
      )}
    </div>
  );
}

const LoadingSingleNotice = () => (
  <div className="space-y-6">
    <Skeleton className="h-10 w-32" />
    <Card>
      <CardHeader>
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-64 w-full mb-4" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-2/3" />
      </CardContent>
    </Card>
  </div>
);
