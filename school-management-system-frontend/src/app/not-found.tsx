"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Home, 
  ArrowLeft, 
  Search, 
  GraduationCap, 
  AlertTriangle,
  BookOpen,
  Users,
  FileText
} from "lucide-react";

export default function NotFound() {
  const quickLinks = [
    {
      title: "Home",
      href: "/",
      icon: Home,
      description: "Return to homepage"
    },
    {
      title: "Academic",
      href: "/academic/teachers",
      icon: GraduationCap,
      description: "Academic information"
    },
    {
      title: "Notices",
      href: "/notices",
      icon: FileText,
      description: "Latest announcements"
    },
    {
      title: "Results",
      href: "/result",
      icon: BookOpen,
      description: "Check exam results"
    },
    {
      title: "Departments",
      href: "/department",
      icon: Users,
      description: "Department information"
    },
    {
      title: "Contact",
      href: "/contact",
      icon: Search,
      description: "Get in touch"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="  w-full">
        {/* Header */}
 

        {/* Main 404 Content */}
        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              {/* 404 Icon */}
              <div className="flex items-center justify-center mb-6">
                <div className="relative">
                  <div className="w-24 h-24 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center">
                    <AlertTriangle className="h-12 w-12 text-red-600" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">!</span>
                  </div>
                </div>
              </div>

              {/* 404 Text */}
              <div className="mb-6">
                <h1 className="text-8xl font-bold text-gray-900 mb-2">404</h1>
                <h2 className="text-3xl font-semibold text-gray-800 mb-4">Page Not Found</h2>
                <p className="text-lg text-gray-600 max-w-md mx-auto">
                  The page you&apos;re looking for doesn&apos;t exist or has been moved. 
                  Let&apos;s get you back on track to your academic journey.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                <Button 
                  asChild
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  <Link href="/" className="flex items-center gap-2">
                    <Home className="h-5 w-5" />
                    Go to Homepage
                  </Link>
                </Button>
                
                <Button 
                  variant="outline"
                  onClick={() => window.history.back()}
                  className="border-blue-600 text-blue-600 hover:bg-blue-50 px-6 py-3 rounded-lg font-medium transition-all duration-200"
                >
                  <ArrowLeft className="h-5 w-5 mr-2" />
                  Go Back
                </Button>
              </div>
            </div>

            {/* Quick Links Section */}
            <div className="border-t border-gray-200 pt-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-6 text-center">
                Quick Navigation
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {quickLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="group block p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 hover:shadow-md"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors duration-200">
                        <link.icon className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 group-hover:text-blue-800 transition-colors duration-200">
                          {link.title}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {link.description}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Help Section */}
            <div className="mt-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
              <div className="text-center">
                <h4 className="text-lg font-semibold text-blue-900 mb-2">
                  Need Help?
                </h4>
                <p className="text-blue-700 mb-4">
                  If you&apos;re having trouble finding what you&apos;re looking for, 
                  our support team is here to help.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button 
                    asChild
                    variant="outline"
                    className="border-blue-600 text-blue-600 hover:bg-blue-100"
                  >
                    <Link href="/contact">
                      Contact Support
                    </Link>
                  </Button>
                  <Button 
                    asChild
                    variant="outline"
                    className="border-green-600 text-green-600 hover:bg-green-100"
                  >
                    <Link href="/about">
                      About Our College
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        
      </div>
    </div>
  );
}
