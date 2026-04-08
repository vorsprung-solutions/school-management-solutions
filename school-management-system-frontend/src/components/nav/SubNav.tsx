"use client";

import { School, MapPin, Users, GraduationCap } from "lucide-react";
import useOrganization from "@/hooks/useOrganization";
import useAbout from "@/hooks/useAbout";
import Image from "next/image";
import { useGetAllNoticeByDomainQuery } from "@/redux/features/admin/adminApi";
import useDomain from "@/hooks/useDomain";
import { INotice } from "@/types/notice";

const SubNav = () => {
  const domain = useDomain();
  const { data: organization } = useOrganization();
  const { data: about } = useAbout();
  const { data: allNotices } = useGetAllNoticeByDomainQuery(domain, {
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
  });

  const notices = allNotices?.data || [];

  // Create infinite scrolling notices by duplicating the array
  const createInfiniteNotices = (notices: INotice[]) => {
    if (notices.length === 0) return [];
    if (notices.length === 1) {
      // If only 1 notice, duplicate it multiple times for smooth scrolling
      return Array(6).fill(notices[0]);
    }
    if (notices.length === 2) {
      // If only 2 notices, duplicate them for smooth scrolling
      return [...notices, ...notices, ...notices];
    }
    // For 3 or more notices, duplicate once for smooth transition
    return [...notices, ...notices];
  };

  const infiniteNotices = createInfiniteNotices(notices);

  return (
    <div className="w-full bg-gradient-to-r from-blue-950 to-blue-900 text-white shadow-lg">
      {/* Main Header Section */}
      <div className="py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            {/* School Logo */}
            <div className="flex-shrink-0">
              <div className="relative">
                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-xl border-4 border-blue-400">
                  {organization?.logo ? (
                    <Image
                      src={organization.logo}
                      alt="School Logo"
                      width={80}
                      height={80}
                      className="rounded-full object-cover"
                    />
                  ) : (
                    <School className="w-12 h-12 text-blue-600" />
                  )}
                </div>
                <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                  <School className="w-4 h-4 text-blue-900" />
                </div>
              </div>
            </div>

            {/* School Name and Info */}
            <div className="flex-1 text-center px-8">
              <h1 className="text-2xl md:text-4xl font-bold text-white mb-3 leading-tight">
                {organization?.name || "Loading ..."}
              </h1>
              <p className="text-lg text-blue-200 mb-2">
                {organization?.address || ""}
              </p>
              <div className="flex items-center justify-center space-x-6 text-sm text-blue-300">
                <div className="flex items-center space-x-2">
                  <GraduationCap className="w-4 h-4" />
                  <span>Est. {organization?.est || ""}</span>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="flex-shrink-0 hidden lg:block">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-blue-800/50 rounded-lg border border-blue-700 hover:bg-blue-800/70 transition-colors">
                  <div className="text-2xl font-bold text-yellow-400">
                    {about?.stats?.student ? `${about.stats.student}+` : "0+"}
                  </div>
                  <div className="text-xs text-blue-200 flex items-center justify-center">
                    <Users className="w-3 h-3 mr-1" />
                    Students
                  </div>
                </div>
                <div className="text-center p-3 bg-blue-800/50 rounded-lg border border-blue-700 hover:bg-blue-800/70 transition-colors">
                  <div className="text-2xl font-bold text-yellow-400">
                    {about?.stats?.teacher ? `${about.stats.teacher}+` : "0+"}
                  </div>
                  <div className="text-xs text-blue-200 flex items-center justify-center">
                    <GraduationCap className="w-3 h-3 mr-1" />
                    Teachers
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Notice Section with Fixed Marquee */}
      <div className="bg-white border-t-4 border-blue-600 shadow-lg">
        <div className="container mx-auto">
          <div className="flex items-center py-4 px-4">
            <div className="flex-shrink-0 mr-6">
              <span className="inline-flex items-center px-6 py-3 rounded-full text-sm font-semibold bg-gradient-to-r from-blue-600 to-blue-700 text-white border-2 border-blue-500 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                  <span>📢 IMPORTANT NOTICES</span>
                </div>
              </span>
            </div>
            <div className="flex-1 overflow-hidden relative">
              <div className="relative w-full overflow-hidden bg-slate-50 rounded-lg py-2">
                {/* Fade edges */}
                <div className="absolute left-0 top-0 w-12 h-full bg-gradient-to-r from-slate-50 to-transparent z-10 pointer-events-none"></div>
                <div className="absolute right-0 top-0 w-12 h-full bg-gradient-to-l from-slate-50 to-transparent z-10 pointer-events-none"></div>

                {/* Marquee content */}
                <div className="flex animate-marquee hover:animate-pause whitespace-nowrap">
                  {infiniteNotices?.length > 0 ? (
                    infiniteNotices?.map((notice: INotice, index: number) => (
                      <span
                        key={`${notice?._id || 'notice'}-${index}`}
                        className="inline-block text-sm text-slate-700 font-medium mr-16 flex-shrink-0 relative"
                      >
                        {notice?.title ||
                          `${organization?.name || "College"} - ${notice?.description || "Important announcement"
                          }`}
                        <span className="absolute -right-8 text-blue-500 font-bold">•</span>
                      </span>
                    ))
                  ) : (
                    <span className="inline-block text-sm text-slate-700 font-medium mr-16 flex-shrink-0 relative">
                      {organization?.name} -
                      Excellence in Education Since{" "}
                      {organization?.est || "1944"}
                      <span className="absolute -right-8 text-blue-500 font-bold">•</span>
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubNav;
