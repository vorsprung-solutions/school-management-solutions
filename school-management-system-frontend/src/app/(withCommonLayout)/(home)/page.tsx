"use client";

import AboutSection from "@/components/pages/home/about/about-section";
import CommonFeaturesSection from "@/components/pages/home/common-feature-section";
import Hero from "@/components/pages/home/Hero/Hero";
import NoticeSection from "@/components/pages/home/notice/notice-section";
import EnhancedPageLoader from "@/components/shared/EnhancedPageLoader";
import useDomain from "@/hooks/useDomain";
import useOrganization from "@/hooks/useOrganization";
import useAbout from "@/hooks/useAbout";
import { useGetAllBannerByDomainQuery } from "@/redux/features/admin/adminApi";
import { useGetAllNoticeByDomainQuery } from "@/redux/features/admin/adminApi";

export default function Home() {
  const domain = useDomain();
  const { data: organization, isLoading: orgLoading } = useOrganization();
  const { data: about, isLoading: aboutLoading } = useAbout();
  const { data: bannerData, isLoading: bannerLoading } = useGetAllBannerByDomainQuery(domain, {
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
  });
  const { data: noticeData, isLoading: noticeLoading } = useGetAllNoticeByDomainQuery(domain, {
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
  });

  // Show loader if any critical data is still loading
  const isLoading = orgLoading || aboutLoading || bannerLoading || noticeLoading;

  if (isLoading) {
    return <EnhancedPageLoader />;
  }

  return (
    <div>
      <Hero />
      <AboutSection />
      <NoticeSection />
      <CommonFeaturesSection />
    </div>
  );
}
