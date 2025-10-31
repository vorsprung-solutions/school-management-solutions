"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { GraduationCap, Users, Award, BookOpen, School } from "lucide-react";
import "./PageLoader.css";

const PageLoader = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-50 page-transition">
      {/* Header Skeleton */}
      <div className="w-full bg-gradient-to-r from-blue-900 to-blue-800 text-white shadow-xl sticky top-0 z-50 border-b-4 border-blue-600 loader-section-1">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Skeleton className="w-10 h-10 bg-blue-700 rounded-full" />
              <Skeleton className="w-32 h-6 bg-blue-700" />
            </div>
            <div className="hidden md:flex items-center space-x-6">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="w-20 h-4 bg-blue-700" />
              ))}
            </div>
            <Skeleton className="w-8 h-8 bg-blue-700 rounded" />
          </div>
        </div>
      </div>

      {/* SubNav Skeleton */}
      <div className="w-full bg-gradient-to-r from-blue-950 to-blue-900 text-white shadow-lg loader-section-2">
        <div className="py-8">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between">
              {/* Logo Skeleton */}
              <div className="flex-shrink-0">
                <Skeleton className="w-24 h-24 bg-blue-800 rounded-full" />
              </div>

              {/* School Info Skeleton */}
              <div className="flex-1 text-center px-8">
                <Skeleton className="h-12 w-96 mx-auto mb-3 bg-blue-800" />
                <Skeleton className="h-6 w-64 mx-auto mb-2 bg-blue-800" />
                <div className="flex items-center justify-center space-x-6">
                  <Skeleton className="h-4 w-24 bg-blue-800" />
                </div>
              </div>

              {/* Stats Skeleton */}
              <div className="flex-shrink-0 hidden lg:block">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-blue-800/50 rounded-lg border border-blue-700">
                    <Skeleton className="h-8 w-12 mx-auto mb-2 bg-blue-700" />
                    <Skeleton className="h-3 w-16 mx-auto bg-blue-700" />
                  </div>
                  <div className="text-center p-3 bg-blue-800/50 rounded-lg border border-blue-700">
                    <Skeleton className="h-8 w-12 mx-auto mb-2 bg-blue-700" />
                    <Skeleton className="h-3 w-16 mx-auto bg-blue-700" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Notice Section Skeleton */}
        <div className="notice-section">
          <div className="container mx-auto">
            <div className="flex items-center py-4 px-4">
              <div className="flex-shrink-0 mr-6">
                <Skeleton className="h-8 w-40 bg-blue-800 rounded" />
              </div>
              <div className="flex-1">
                <Skeleton className="h-4 w-full bg-blue-800" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section Skeleton */}
      <div className="relative min-h-[70vh] bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 loader-section-3">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-4 h-full flex items-center">
          <div className="max-w-4xl">
            <Skeleton className="h-16 w-full mb-6 bg-white/20" />
            <Skeleton className="h-8 w-3/4 mb-4 bg-white/20" />
            <Skeleton className="h-6 w-1/2 mb-8 bg-white/20" />

            {/* Stats Skeleton */}
            <div className="flex flex-wrap gap-6 mb-8">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-white/20 rounded-full">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <Skeleton className="h-6 w-16 mb-1 bg-white/20" />
                  <Skeleton className="h-4 w-12 bg-white/20" />
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-white/20 rounded-full">
                  <GraduationCap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <Skeleton className="h-6 w-16 mb-1 bg-white/20" />
                  <Skeleton className="h-4 w-12 bg-white/20" />
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-white/20 rounded-full">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <div>
                  <Skeleton className="h-6 w-16 mb-1 bg-white/20" />
                  <Skeleton className="h-4 w-12 bg-white/20" />
                </div>
              </div>
            </div>

            {/* Buttons Skeleton */}
            <div className="flex flex-wrap gap-4">
              <Skeleton className="h-12 w-32 bg-white/20 rounded" />
              <Skeleton className="h-12 w-32 bg-white/20 rounded" />
            </div>
          </div>
        </div>
      </div>

      {/* About Section Skeleton */}
      <div className="py-16 bg-white loader-section-4">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Skeleton className="h-12 w-64 mx-auto mb-4 bg-gray-200" />
            <Skeleton className="h-6 w-96 mx-auto bg-gray-200" />
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-4">
              <Skeleton className="h-8 w-full bg-gray-200" />
              <Skeleton className="h-4 w-full bg-gray-200" />
              <Skeleton className="h-4 w-3/4 bg-gray-200" />
              <Skeleton className="h-4 w-5/6 bg-gray-200" />
              <Skeleton className="h-4 w-2/3 bg-gray-200" />
            </div>
            <div className="relative">
              <Skeleton className="h-80 w-full bg-gray-200 rounded-lg" />
            </div>
          </div>
        </div>
      </div>

      {/* Features Section Skeleton */}
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Skeleton className="h-12 w-80 mx-auto mb-4 bg-gray-200" />
            <Skeleton className="h-6 w-96 mx-auto bg-gray-200" />
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="text-center p-6 bg-white rounded-lg shadow-sm">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <School className="w-8 h-8 text-blue-600" />
                </div>
                <Skeleton className="h-6 w-32 mx-auto mb-2 bg-gray-200" />
                <Skeleton className="h-4 w-full bg-gray-200" />
                <Skeleton className="h-4 w-3/4 mx-auto bg-gray-200" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Skeleton */}
      <div className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="h-6 w-24 bg-gray-700" />
                <div className="space-y-2">
                  {Array.from({ length: 4 }).map((_, j) => (
                    <Skeleton key={j} className="h-4 w-20 bg-gray-700" />
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <Skeleton className="h-4 w-64 mx-auto bg-gray-700" />
          </div>
        </div>
      </div>

      {/* Loading Animation Overlay */}
      <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center loading-overlay">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-blue-200 border-t-blue-600 rounded-full loading-spinner mx-auto mb-4"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <School className="w-8 h-8 text-blue-600 animate-pulse" />
            </div>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Loading School Information</h3>
          <p className="text-gray-600">Please wait while we prepare everything for you...</p>
          <div className="mt-4 flex justify-center space-x-1">
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce loading-dots"></div>
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce loading-dots" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce loading-dots" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageLoader;
