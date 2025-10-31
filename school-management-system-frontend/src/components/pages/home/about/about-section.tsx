"use client";

import {
  GraduationCap,
  Users,
  Award,
  BookOpen,
  ArrowRight,
} from "lucide-react";
import "./about-section.css";
import Link from "next/link";
import useAbout from "@/hooks/useAbout";
import { useGetAllStaffByDomainQuery } from "@/redux/features/staff/staffApi";
import useDomain from "@/hooks/useDomain";
import { IStaff } from "@/types/staff";
import Image from "next/image";

const AboutSection = () => {
  const domain = useDomain();
  // getting about information
  const { data } = useAbout();
  const about = data || null;

  //getting staff information
  const { data: allStaffs } = useGetAllStaffByDomainQuery(domain, {
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
  });

  const principle =
    allStaffs?.data?.find(
      (staff: IStaff) => staff?.designation === "Principal"
    ) || {};

  return (
    <section className="about-section ">
      <div className="container mx-auto px-4 py-16">
        <div className="about-container">
          {/* Left Side - Head Teacher Profile */}
          <div className="head-teacher-profile">
            <div className="profile-card">
              <div className="profile-image-wrapper">
                <Image
                  src={
                    principle?.profilePicture ||
                    "https://i.ibb.co.com/5x441PC/user.png"
                  }
                  alt="Head Teacher"
                  width={250}
                  height={300}
                  className="profile-image"
                  loading="lazy"
                />
                <div className="profile-badge">
                  <GraduationCap className="w-6 h-6" />
                </div>
              </div>

              <div className="profile-info">
                <h3 className="profile-name">{principle?.name || ""}</h3>
                <p className="profile-role">অধ্যক্ষ (Principal)</p>
                <p className="profile-qualification">
                  Education: {principle?.educationLevel || ""}
                </p>

                <div className="profile-message">
                  <blockquote>{principle?.quote || ""}</blockquote>
                </div>

                <div className="profile-contact">
                  {/* <div className="contact-item">
                    <span className="contact-label">অভিজ্ঞতা:</span>
                    <span className="contact-value">
                      {principle?.exparience || ""}
                    </span>
                  </div> */}
                  <div className="contact-item">
                    <span className="contact-label">যোগদান:</span>
                    <span className="contact-value">
                      {principle?.join_date &&
                        new Date(principle?.join_date).toLocaleDateString(
                          "en-GB",
                          {
                            day: "2-digit",
                            month: "long",
                            year: "numeric",
                          }
                        )}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - School About */}
          <div className="school-about">
            <div className="about-header">
              <h2 className="about-title">আমাদের সম্পর্কে</h2>
              <h3 className="about-title-en">About Our Institution</h3>
              <div className="title-underline"></div>
            </div>

            <div className="about-content">
              <p className="about-description">
                {about?.description || "description not available ..."}
              </p>

              {/* Stats */}
              <div className="about-stats">
                <div className="stat-item">
                  <div className="stat-icon">
                    <Users className="w-8 h-8" />
                  </div>
                  <div className="stat-info">
                    <span className="stat-number">
                      {about?.stats?.student || "0"}+
                    </span>
                    <span className="text-gray-500">শিক্ষার্থী</span>
                  </div>
                </div>

                <div className="stat-item">
                  <div className="stat-icon">
                    <BookOpen className="w-8 h-8" />
                  </div>
                  <div className="stat-info">
                    <span className="stat-number">
                      {about?.stats?.teacher || "0"}+
                    </span>
                    <span className="text-gray-500">শিক্ষক</span>
                  </div>
                </div>

                <div className="stat-item">
                  <div className="stat-icon">
                    <Award className="w-8 h-8" />
                  </div>
                  <div className="stat-info">
                    <span className="stat-number">
                      {about?.stats?.year || "0"}+
                    </span>
                    <span className="text-gray-500">বছরের ঐতিহ্য</span>
                  </div>
                </div>

                <div className="stat-item">
                  <div className="stat-icon">
                    <GraduationCap className="w-8 h-8" />
                  </div>
                  <div className="stat-info">
                    <span className="stat-number">
                      {about?.stats?.passPercentage || "0"}%
                    </span>
                    <span className="text-gray-500">পাসের হার</span>
                  </div>
                </div>
              </div>

              {/* Key Features */}
              <div className="about-features">
                <h4 className="features-title">আমাদের বিশেষত্ব</h4>
                <ul className="features-list">
                  <li>আধুনিক শিক্ষা পদ্ধতি ও প্রযুক্তি</li>
                  <li>অভিজ্ঞ ও দক্ষ শিক্ষকমণ্ডলী</li>
                  <li>সমৃদ্ধ গ্রন্থাগার ও গবেষণাগার</li>
                  <li>খেলাধুলা ও সাংস্কৃতিক কার্যক্রম</li>
                  <li>বৃত্তি ও আর্থিক সহায়তা</li>
                </ul>
              </div>

              <div className="about-cta">
                <Link href={"/about"}>
                  <button className="cta-button primary">
                    আরও জানুন <ArrowRight className="w-4 h-4 ml-2" />
                  </button>
                </Link>
                <Link href={"/contact"}>
                  <button className="cta-button primary">
                    যোগাযোগ করুন <ArrowRight className="w-4 h-4 ml-2" />
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
