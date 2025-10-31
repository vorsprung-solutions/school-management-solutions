"use client";

import {
  ChevronDown,
  Menu,
  GraduationCap,
  User,
  LogOut,
  LayoutDashboard,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAppSelector } from "@/redux/hooks";
import { selectCurrentUser } from "@/redux/features/auth/authSlice";
import { useAppDispatch } from "@/redux/hooks";
import { logout } from "@/redux/features/auth/authSlice";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";

const navigationItems = [
  { label: "DEPARTMENTS", href: "/department" },
  { label: "NOTICES", href: "/notices" },
  // { label: "PAYMENT", href: "/payment" },
  { label: "RESULTS", href: "/result" },
  { label: "ABOUT US", href: "/about" },
  { label: "CONTACT", href: "/contact" },
];

const academicItems = [
  {
    label: "Teacher Information",
    href: "/academic/teachers",
    description: "Faculty profiles and contact details",
  },
  {
    label: "Staff Information",
    href: "/academic/staff",
    description: "Faculty profiles and contact details",
  },
  {
    label: "Student Information",
    href: "/academic/students",
    description: "Student profiles and academic information",
  },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isAcademicHovered, setIsAcademicHovered] = useState(false);
  const user = useAppSelector(selectCurrentUser);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Logged out successfully!");
    router.push("/");
  };

  const handleMobileNavClick = () => {
    setIsOpen(false);
  };

  const getDashboardUrl = (role: string) => {
    switch (role) {
      case "admin":
        return "/admin/dashboard";
      case "teacher":
        return "/teacher/dashboard";
      case "student":
        return "/student/dashboard";
      default:
        return "/";
    }
  };

  return (
    <header className="w-full bg-gradient-to-r from-blue-900 to-blue-800 text-white shadow-xl sticky top-0 z-50 border-b-4 border-blue-600">
      <div className="container mx-auto px-4">
        <div className="flex h-20 items-center justify-between">
          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden text-white hover:bg-white/10 focus:bg-white/10 transition-all duration-200"
                aria-label="Open navigation menu"
              >
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="w-80 bg-gradient-to-b from-blue-900 to-blue-800 text-white border-blue-600 p-0"
            >
              <SheetTitle className="sr-only">
                Mobile Navigation Menu
              </SheetTitle>

              {/* Mobile Header */}
              <div className="flex items-center justify-between p-6 border-b border-blue-600 bg-blue-950/50">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/10 rounded-lg">
                    <GraduationCap className="h-6 w-6 text-yellow-300" />
                  </div>
                  <div>
                    <h1 className="font-bold text-lg text-white">
                      সরকারি আজিজুল হক কলেজ
                    </h1>
                    <p className="text-sm text-blue-200">বগুড়া, বাংলাদেশ</p>
                  </div>
                </div>
              </div>

              {/* Mobile Navigation */}
              <div className="p-6 space-y-3">
                <Link
                  href={"/"}
                  className="flex items-center px-4 py-3 text-sm font-medium text-white hover:bg-white hover:text-black rounded-lg transition-all duration-200 border border-transparent hover:border-gray-200 hover:shadow-md cursor-pointer"
                >
                  <div className="w-2 h-2 bg-yellow-300 rounded-full mr-3"></div>
                  HOME
                </Link>
                {navigationItems.map(({ label, href }) => (
                  <Link
                    key={href}
                    href={href}
                    className="flex items-center px-4 py-3 text-sm font-medium text-white hover:bg-white hover:text-black rounded-lg transition-all duration-200 border border-transparent hover:border-gray-200 hover:shadow-md cursor-pointer"
                    onClick={handleMobileNavClick}
                  >
                    <div className="w-2 h-2 bg-blue-300 rounded-full mr-3"></div>
                    {label}
                  </Link>
                ))}

                {/* Mobile Academic Dropdown */}
                <Collapsible className="space-y-3">
                  <CollapsibleTrigger className="flex w-full items-center justify-between px-4 py-3 text-sm font-medium text-white hover:bg-white hover:text-black rounded-lg transition-all duration-200 border border-transparent hover:border-gray-200 hover:shadow-md cursor-pointer [&[data-state=open]>svg]:rotate-180">
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-green-300 rounded-full mr-3"></div>
                      ACADEMIC
                    </div>
                    <ChevronDown className="h-4 w-4 transition-transform duration-200" />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="space-y-2 ml-4">
                    {academicItems.map(({ label, href }) => (
                      <Link
                        key={href}
                        href={href}
                        className="flex items-center px-4 py-2 text-sm text-blue-200 hover:text-black hover:bg-white rounded-md transition-all duration-200 cursor-pointer"
                        onClick={handleMobileNavClick}
                      >
                        <div className="w-1.5 h-1.5 bg-blue-300 rounded-full mr-3"></div>
                        {label}
                      </Link>
                    ))}
                  </CollapsibleContent>
                </Collapsible>

                <Separator className="my-6 bg-blue-600/50" />

                {/* Mobile Dashboard/Login/Logout Buttons */}
                {user ? (
                  <div className="space-y-3">
                    <Link
                      href={getDashboardUrl(user.role)}
                      className="flex items-center px-4 py-3 text-sm font-medium text-white hover:bg-white hover:text-black rounded-lg transition-all duration-200 border border-transparent hover:border-gray-200 hover:shadow-md cursor-pointer"
                      onClick={handleMobileNavClick}
                    >
                      <div className="w-2 h-2 bg-yellow-300 rounded-full mr-3"></div>
                      <LayoutDashboard className="h-4 w-4 mr-2" />
                      DASHBOARD
                    </Link>
                    <Button
                      variant="outline"
                      className="w-full border-red-400 text-white hover:bg-red-600 hover:text-white bg-transparent transition-all duration-200 hover:border-red-300 hover:shadow-md cursor-pointer"
                      onClick={handleLogout}
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      LOGOUT
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    className="w-full border-green-400 text-white hover:bg-green-600 hover:text-white bg-transparent transition-all duration-200 hover:border-green-300 hover:shadow-md cursor-pointer"
                    onClick={handleMobileNavClick}
                  >
                    <User className="h-4 w-4 mr-2" />
                    LOGIN
                  </Button>
                )}
              </div>
            </SheetContent>
          </Sheet>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-2">
            <Link
              href={"/"}
              className="group inline-flex h-10 w-max items-center justify-center rounded-lg bg-transparent px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:bg-white hover:text-black hover:border hover:border-gray-200 hover:shadow-md focus:bg-white focus:text-black focus:outline-none disabled:pointer-events-none disabled:opacity-50 cursor-pointer"
            >
              HOME
            </Link>

            {/* Academic Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setIsAcademicHovered(true)}
              onMouseLeave={() => setIsAcademicHovered(false)}
            >
              <button className="group inline-flex h-10 w-max items-center justify-center rounded-lg bg-transparent px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:bg-white hover:text-black hover:border hover:border-gray-200 hover:shadow-md focus:bg-white focus:text-black focus:outline-none disabled:pointer-events-none disabled:opacity-50 cursor-pointer">
                ACADEMIC
                <ChevronDown className="ml-1 h-4 w-4 transition-transform duration-200 group-hover:rotate-180" />
              </button>

              {/* Dropdown Content */}
              {isAcademicHovered && (
                <div className="absolute top-full left-0 mt-0 w-[400px] bg-white shadow-xl rounded-lg border border-blue-100 z-50">
                  <div className="p-4 space-y-2">
                    {academicItems.map(({ label, href, description }) => (
                      <Link
                        key={href}
                        href={href}
                        className="group block p-4 rounded-lg transition-all duration-200 hover:bg-blue-50 focus:bg-blue-50 focus:outline-none border border-transparent hover:border-blue-200"
                      >
                        <div className="text-sm font-medium text-blue-900 group-hover:text-blue-800">
                          {label}
                        </div>
                        <p className="text-sm text-blue-600 leading-snug">
                          {description}
                        </p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {navigationItems.map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                className="group inline-flex h-10 w-max items-center justify-center rounded-lg bg-transparent px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:bg-white hover:text-black hover:border hover:border-gray-200 hover:shadow-md focus:bg-white focus:text-black focus:outline-none disabled:pointer-events-none disabled:opacity-50 cursor-pointer"
              >
                {label}
              </Link>
            ))}
          </div>

          {/* Desktop Dashboard/Login/Logout Buttons */}
          {user ? (
            <div className="hidden lg:flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                className="border-blue-400 text-white hover:bg-blue-400 bg-transparent transition-all duration-200 hover:border-blue-300 focus:bg-blue-400 cursor-pointer"
              >
                <Link
                  href={getDashboardUrl(user.role)}
                  className="flex items-center justify-center"
                >
                  <LayoutDashboard className="h-4 w-4 mr-2" />
                  DASHBOARD
                </Link>
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-red-400 text-white hover:bg-red-600 bg-transparent transition-all duration-200 hover:border-red-300 focus:bg-red-600 cursor-pointer"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4 mr-2" />
                LOGOUT
              </Button>
            </div>
          ) : (
            <Button
              variant="outline"
              size="sm"
              className="hidden lg:flex border-green-400 text-white hover:bg-green-600 bg-transparent transition-all duration-200 hover:border-green-300 focus:bg-green-600 cursor-pointer"
            >
              <Link
                href={"/login"}
                className="flex items-center justify-center"
              >
                <User className="h-4 w-4 mr-2" />
                LOGIN
              </Link>
            </Button>
          )}

          {/* Mobile Login/Logout Button */}
          {user ? (
            <Button
              variant="outline"
              size="sm"
              className="lg:hidden border-red-400 text-white hover:bg-red-600 bg-transparent transition-all duration-200 hover:border-red-300 focus:bg-red-600 cursor-pointer"
              aria-label="Logout"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              LOGOUT
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              className="lg:hidden border-green-400 text-white hover:bg-green-600 bg-transparent transition-all duration-200 hover:border-green-300 focus:bg-green-600 cursor-pointer"
              aria-label="Login"
            >
              <Link
                href={"/login"}
                className="flex items-center justify-center"
              >
                <User className="h-4 w-4 mr-2" />
                LOGIN
              </Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
