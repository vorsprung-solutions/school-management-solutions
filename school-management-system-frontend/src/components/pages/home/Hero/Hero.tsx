"use client";

import { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  GraduationCap,
  Users,
  Award,
} from "lucide-react";
import Image from "next/image";
import "./HeroSection.css";
import useDomain from "@/hooks/useDomain";
import useOrganization from "@/hooks/useOrganization";
import useAbout from "@/hooks/useAbout";
import { useGetAllBannerByDomainQuery } from "@/redux/features/admin/adminApi";
import { IBanner } from "@/types/banner";

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const domain = useDomain();
  const { data: organization } = useOrganization();
  const { data: about } = useAbout();
  const { data: bannerData } = useGetAllBannerByDomainQuery(domain, {
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
  });

  const slides = bannerData?.data || [];

  // Auto slide functionality
  useEffect(() => {
    if (slides.length > 0) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }, 6000);
      return () => clearInterval(interval);
    }
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  // If no slides, show a simple hero section
  if (slides.length === 0) {
    return (
      <div className="hero-container">
        <div className="hero-simple">
          <div className="hero-simple-content">
            <div className="container mx-auto px-4 h-full flex items-center">
              <div className="hero-simple-text">
                <h1 className="hero-simple-title">
                  {organization?.name || "Loading ..."}
                </h1>
                <p className="hero-simple-subtitle">
                  Excellence in Education Since{" "}
                  {organization?.est || "Loading ..."}
                </p>

                {/* Quick Stats */}
                <div className="hero-stats">
                  <div className="stat-item">
                    <Users className="stat-icon" />
                    <div className="stat-content">
                      <span className="stat-number">
                        {about?.stats?.student
                          ? `${about.stats.student}+`
                          : "0+"}
                      </span>
                      <span className="stat-label">Students</span>
                    </div>
                  </div>
                  <div className="stat-item">
                    <GraduationCap className="stat-icon" />
                    <div className="stat-content">
                      <span className="stat-number">
                        {about?.stats?.teacher
                          ? `${about.stats.teacher}+`
                          : "0+"}
                      </span>
                      <span className="stat-label">Teachers</span>
                    </div>
                  </div>
                  <div className="stat-item">
                    <Award className="stat-icon" />
                    <div className="stat-content">
                      <span className="stat-number">
                        {about?.stats?.year || "0+"}
                      </span>
                      <span className="stat-label">Years</span>
                    </div>
                  </div>
                </div>

                <div className="hero-simple-buttons">
                  <button className="hero-simple-btn primary">
                    Admission Info <ArrowRight className="w-4 h-4 ml-2" />
                  </button>
                  <button className="hero-simple-btn secondary">
                    Learn More <ArrowRight className="w-4 h-4 ml-2" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="hero-container">
      <div className="hero-slider">
        {slides.map((slide: IBanner, index: number) => (
          <div
            key={slide._id + `index${index}`}
            className={`hero-slide ${index === currentSlide ? "active" : ""}`}
          >
            <div className="hero-image-wrapper">
              <Image
                src={slide?.image || "/placeholder.svg"}
                alt={slide.title}
                fill
                className="hero-image"
                priority={index === 0}
              />
              <div className="hero-overlay"></div>
            </div>
            <div className="hero-content">
              <div className="container mx-auto px-4 h-full flex items-center">
                <div className="hero-text">
                  <h1 className="hero-title">{slide.title}</h1>
                  <h2 className="hero-subtitle">{slide.subtitle}</h2>
                  <p className="hero-description">{slide.description}</p>
                  <div className="hero-buttons">
                    <button className="hero-btn primary">
                      ভর্তি তথ্য <ArrowRight className="w-4 h-4 ml-2" />
                    </button>
                    <button className="hero-btn secondary">
                      আরও জানুন <ArrowRight className="w-4 h-4 ml-2" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Controls */}
      <div className="hero-controls">
        {/* Previous/Next Buttons */}
        <button className="hero-nav-btn prev" onClick={prevSlide}>
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button className="hero-nav-btn next" onClick={nextSlide}>
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Slide Indicators */}
        <div className="hero-indicators">
          {slides.map((_: IBanner, index: number) => (
            <button
              key={index}
              className={`hero-indicator ${
                index === currentSlide ? "active" : ""
              }`}
              onClick={() => goToSlide(index)}
            >
              <span className="indicator-number">{index + 1}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="hero-progress">
        <div
          className="hero-progress-bar"
          style={{
            animationDuration: "6s",
          }}
        ></div>
      </div>
    </div>
  );
};

export default Hero;
