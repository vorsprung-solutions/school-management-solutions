"use client";

import Title from "../../shared/title";
import { useGetAllNoticeByDomainQuery } from "@/redux/features/admin/adminApi";
import useDomain from "@/hooks/useDomain";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Calendar,
  FileText,
  Eye,
  Clock,
  AlertCircle,
  CheckCircle,
  CalendarDays,
  TrendingUp,
} from "lucide-react";
import { format, startOfMonth, endOfMonth, subDays } from "date-fns";
import { INotice } from "@/types/notice";

export default function NoticeBoard() {
  const domain = useDomain();
  const {
    data: notices,
    isLoading,
    isError,
  } = useGetAllNoticeByDomainQuery(domain, {
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
  });

  const arrayOfNotices = notices?.data;

  const getPriorityColor = (priority?: string) => {
    switch (priority?.toLowerCase()) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getPriorityIcon = (priority?: string) => {
    switch (priority?.toLowerCase()) {
      case "high":
        return <AlertCircle className="h-3 w-3" />;
      case "medium":
        return <Clock className="h-3 w-3" />;
      case "low":
        return <CheckCircle className="h-3 w-3" />;
      default:
        return <FileText className="h-3 w-3" />;
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "No date";
    try {
      // Handle different date formats
      let date: Date;

      // If it's already a valid date string, use it directly
      if (dateString.includes("T") || dateString.includes("Z")) {
        date = new Date(dateString);
      } else {
        // If it's just a date string (YYYY-MM-DD), add time to make it valid
        date = new Date(dateString + "T00:00:00");
      }

      // Check if the date is valid
      if (isNaN(date.getTime())) {
        return "Invalid date";
      }

      return format(date, "MMM dd, yyyy");
    } catch (error) {
      console.error("Date formatting error:", error, "for date:", dateString);
      return "Invalid date";
    }
  };

  const truncateTitle = (title: string, maxLength: number = 60) => {
    if (title.length <= maxLength) return title;
    return title.substring(0, maxLength) + "...";
  };

  // Calculate statistics
  const calculateStats = () => {
    if (!arrayOfNotices) return { total: 0, thisMonth: 0, recent: 0 };

    const now = new Date();
    const startOfCurrentMonth = startOfMonth(now);
    const endOfCurrentMonth = endOfMonth(now);
    const sevenDaysAgo = subDays(now, 7);

    const thisMonthCount = arrayOfNotices.filter((notice: INotice) => {
      if (!notice.date) return false;
      try {
        let noticeDate: Date;

        // Handle different date formats
        if (notice.date.includes("T") || notice.date.includes("Z")) {
          noticeDate = new Date(notice.date);
        } else {
          noticeDate = new Date(notice.date + "T00:00:00");
        }

        if (isNaN(noticeDate.getTime())) return false;

        return (
          noticeDate >= startOfCurrentMonth && noticeDate <= endOfCurrentMonth
        );
      } catch {
        return false;
      }
    }).length;

    const recentCount = arrayOfNotices.filter((notice: INotice) => {
      if (!notice.date) return false;
      try {
        let noticeDate: Date;

        // Handle different date formats
        if (notice.date.includes("T") || notice.date.includes("Z")) {
          noticeDate = new Date(notice.date);
        } else {
          noticeDate = new Date(notice.date + "T00:00:00");
        }

        if (isNaN(noticeDate.getTime())) return false;

        return noticeDate >= sevenDaysAgo;
      } catch {
        return false;
      }
    }).length;

    return {
      total: arrayOfNotices.length,
      thisMonth: thisMonthCount,
      recent: recentCount,
    };
  };

  const stats = calculateStats();

  return (
    <div className="container mx-auto px-4 py-16">
      {/* Header Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          <Title value="Notice Board" />
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Stay updated with the latest announcements, important information, and
          institutional updates
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">
                  Total Notices
                </p>
                <p className="text-2xl font-bold text-blue-900">
                  {stats.total}
                </p>
              </div>
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">This Month</p>
                <p className="text-2xl font-bold text-green-900">
                  {stats.thisMonth}
                </p>
              </div>
              <CalendarDays className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">
                  Recent (7 days)
                </p>
                <p className="text-2xl font-bold text-purple-900">
                  {stats.recent}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Notices Table */}
      <Card className="overflow-hidden shadow-lg">
        <div className="p-6 border-b bg-gray-50">
          <h2 className="text-xl font-semibold text-gray-900">All Notices</h2>
          <p className="text-sm text-gray-600 mt-1">
            Browse and download official notices
          </p>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-gray-50">
              <TableRow>
                <TableHead className="w-16 text-center">#</TableHead>
                <TableHead className="min-w-[300px] max-w-[400px]">
                  Title
                </TableHead>
                <TableHead className="min-w-[120px]">Date</TableHead>
                <TableHead className="min-w-[100px]">Priority</TableHead>
                <TableHead className="min-w-[120px] text-center">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {isLoading && (
                <>
                  {Array.from({ length: 5 }).map((_, index) => (
                    <TableRow key={`loading-${index}`}>
                      <TableCell className="text-center">
                        <Skeleton className="h-4 w-8 mx-auto" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-3/4" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-20" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-6 w-16 rounded-full" />
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2 justify-center">
                          <Skeleton className="h-8 w-16" />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </>
              )}

              {!isLoading &&
                !isError &&
                arrayOfNotices &&
                arrayOfNotices.map((notice: INotice, index: number) => (
                  <TableRow
                    key={notice._id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <TableCell className="text-center font-medium text-gray-500">
                      {index + 1}
                    </TableCell>
                    <TableCell>
                      <div className="max-w-[400px]">
                        <Link
                          href={`/notices/${notice._id}`}
                          className="font-medium text-gray-900 hover:text-blue-600 transition-colors block"
                          title={notice.title}
                        >
                          {truncateTitle(notice.title, 60)}
                        </Link>
                        {notice.description && (
                          <p
                            className="text-sm text-gray-500 mt-1 line-clamp-1"
                            title={notice.description}
                          >
                            {truncateTitle(notice.description, 80)}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="h-4 w-4" />
                        {formatDate(notice.date)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={`${getPriorityColor(
                          notice.priority
                        )} border`}
                      >
                        {getPriorityIcon(notice.priority)}
                        <span className="ml-1 text-xs">
                          {notice.priority || "Normal"}
                        </span>
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2 justify-center">
                        <Button asChild size="sm" variant="outline">
                          <Link href={`/notices/${notice._id}`}>
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Link>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>

        {/* Empty State */}
        {arrayOfNotices?.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No Notices Available
            </h3>
            <p className="text-gray-600">
              There are currently no notices to display.
            </p>
          </div>
        )}

        {/* Error State */}
        {isError && (
          <div className="text-center py-12">
            <AlertCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Error Loading Notices
            </h3>
            <p className="text-gray-600">
              Failed to load notices. Please try again later.
            </p>
          </div>
        )}
      </Card>
    </div>
  );
}
