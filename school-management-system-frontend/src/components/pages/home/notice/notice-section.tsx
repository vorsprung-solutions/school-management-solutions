"use client";

import Link from "next/link";
import { Calendar, Clock, ArrowRight, Bell } from "lucide-react";
import "./NoticeSection.css";
import useDomain from "@/hooks/useDomain";
import { useGetAllNoticeByDomainQuery } from "@/redux/features/admin/adminApi";
import { Skeleton } from "@/components/ui/skeleton";

type Notice = {
  _id: string;
  date: string;
  title: string;
  description: string;
};

const NoticeSection = () => {
  const domain = useDomain();
  const { data: latestNotices, isLoading } = useGetAllNoticeByDomainQuery(
    domain,
    {
      refetchOnMountOrArgChange: true,
      refetchOnFocus: true,
    }
  );

  const notices = latestNotices?.data;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return date.toLocaleDateString("bn-BD", options);
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "১ দিন আগে";
    if (diffDays <= 7) return `${diffDays} দিন আগে`;
    if (diffDays <= 30) return `${Math.ceil(diffDays / 7)} সপ্তাহ আগে`;
    return `${Math.ceil(diffDays / 30)} মাস আগে`;
  };

  return (
    <section className="notice-section">
      <div className="container mx-auto px-4 py-16">
        {/* Section Header */}
        <div className="notice-header">
          <div className="header-content">
            <div className="header-icon">
              <Bell className="w-8 h-8" />
            </div>
            <div className="header-text">
              <h2 className="section-title">Latest Notices</h2>
            </div>
          </div>
          <Link href="/notices" className="view-all-link">
            সব নোটিশ দেখুন
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </div>

        {/* Notice Grid */}
        {isLoading && <LoadingLatestNotices />}

        {notices?.length < 1 && !isLoading && (
          <div className="w-full h-[400px] flex justify-center items-center bg-white shodow-xl rounded-2xl">
            <div className="text-xl">No Notice Available</div>
          </div>
        )}

        {!isLoading && notices && (
          <div className="notice-grid">
            {notices?.slice(0, 8).map((notice: Notice, index: number) => (
              <div
                key={notice._id}
                className={`notice-card ${index === 0 ? "featured" : ""}`}
              >
                <div className="notice-content">
                  {/* Date Badge */}
                  <div className="notice-date">
                    <div className="date-badge">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(notice.date!)}</span>
                    </div>
                    <div className="time-ago">
                      <Clock className="w-3 h-3" />
                      <span>{getTimeAgo(notice.date!)}</span>
                    </div>
                  </div>

                  {/* Notice Title */}
                  <h3 className="notice-title">{notice.title}</h3>

                  {/* Notice Description */}
                  <p className="notice-description">{notice.description}</p>

                  {/* Read More Button */}
                  <div className="notice-footer">
                    <Link
                      href={`/notices/${notice._id}`}
                      className="read-more-btn"
                    >
                      বিস্তারিত পড়ুন
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>

                {/* Card Number */}
                <div className="card-number">
                  {String(index + 1).padStart(2, "0")}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Bottom CTA */}
        <div className="notice-cta">
          <p className="cta-text">
            আরও নোটিশ ও আপডেটের জন্য আমাদের নোটিশ বোর্ড দেখুন
          </p>
          <Link href="/notices" className="cta-button">
            নোটিশ বোর্ড
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
};

const LoadingLatestNotices = () => (
  <div className="mb-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {Array.from({ length: 6 }).map((_, index: number) => (
      <div
        key={"latest-notice-loading" + index}
        className="p-4 rounded-2xl bg-white h-[350px] space-y-3"
      >
        <div className="flex justify-between">
          <Skeleton className="bg-gray-300 w-[140px] h-[30px]" />
          <Skeleton className="bg-gray-300 w-[140px] h-[30px]" />
        </div>
        <Skeleton className="bg-gray-300 w-full h-[60px]" />
        <Skeleton className="bg-gray-300 w-full h-[130px]" />
        <div className="flex justify-end">
          <Skeleton className="bg-gray-300 w-[140px] h-[40px]" />
        </div>
      </div>
    ))}
  </div>
);

export default NoticeSection;
