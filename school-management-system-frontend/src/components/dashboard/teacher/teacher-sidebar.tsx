/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import {
  Home,
  UserCircle,
  LogOut,
  ChevronDown,
  GraduationCap,
  Calendar,
  Trophy,
  Edit,
  Settings,
  CalendarIcon,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { logout } from "@/redux/features/auth/authSlice";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

// Menu items with nested structure
const menuItems = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
  {
    title: "Dashboard",
    url: "/teacher/dashboard",
    icon: Home,
  },
  {
    title: "Attendance",
    icon: Calendar,
    submenu: [
      {
        title: "View Attendance",
        url: "/teacher/attendance",
      },
      {
        title: "Mark Attendance",
        url: "/teacher/attendance/mark",
      },
    ],
  },
  {
    title: "Exam",
    icon: CalendarIcon,
    submenu: [
      {
        title: "All Exams",
        url: "/teacher/exam",
      },
      {
        title: "Add Exam",
        url: "/teacher/exam/create",
      },
    ],
  },
  {
    title: "Result",
    icon: Trophy,
    submenu: [
      {
        title: "All Results",
        url: "/teacher/result",
      },
      {
        title: "Add Result",
        url: "/teacher/result/create",
      },
    ],
  },
  {
    title: "Teacher",
    icon: GraduationCap,
    submenu: [
      {
        title: "All Teachers",
        url: "/teacher/teacher",
      },
      {
        title: "Add Teacher",
        url: "/teacher/teacher/create",
      },
    ],
  },
  {
    title: "Student",
    icon: UserCircle,
    submenu: [
      {
        title: "All Students",
        url: "/teacher/student",
      },
      {
        title: "Add Student",
        url: "/teacher/student/create",
      },
    ],
  },
];

export function TeacherSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});

  const toggleMenu = (title: string) => {
    setOpenMenus((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  const isActive = (url: string) => {
    return pathname === url;
  };

  const isMenuActive = (item: any) => {
    if (item.url && isActive(item.url)) return true;
    if (item.submenu) {
      return item.submenu.some((subItem: any) => isActive(subItem.url));
    }
    return false;
  };

  const handleLogout = () => {
    dispatch(logout());
    router.push("/");
  };

  const handleProfileClick = () => {
    router.push("/teacher/dashboard");
  };

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-3 px-4 py-4 border-b border-sidebar-border">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/80 shadow-sm">
            <span className="text-lg font-bold text-primary-foreground">S</span>
          </div>
          <div className="flex flex-col">
            <span className="text-base font-semibold text-sidebar-foreground">
              Teacher Dashboard
            </span>
            <span className="text-xs text-muted-foreground">
              Management Portal
            </span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-medium text-muted-foreground px-4 py-2">
            School Management
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  {item.submenu ? (
                    <Collapsible
                      open={openMenus[item.title] || isMenuActive(item)}
                      onOpenChange={() => toggleMenu(item.title)}
                    >
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton
                          isActive={isMenuActive(item)}
                          className="justify-between hover:bg-sidebar-accent/50 transition-colors duration-200"
                        >
                          <div className="flex items-center">
                            <item.icon className="mr-3 h-4 w-4" />
                            <span className="font-medium">{item.title}</span>
                          </div>
                          <ChevronDown
                            className={`h-4 w-4 transition-transform duration-200 ${
                              openMenus[item.title] || isMenuActive(item)
                                ? "rotate-180"
                                : ""
                            }`}
                          />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub className="ml-6 mt-1 space-y-1">
                          {item.submenu.map((subItem) => (
                            <SidebarMenuSubItem key={subItem.title}>
                              <SidebarMenuSubButton
                                asChild
                                isActive={isActive(subItem.url)}
                                className="hover:bg-sidebar-accent/30 transition-colors duration-200"
                              >
                                <a
                                  href={subItem.url}
                                  className="flex items-center"
                                >
                                  {subItem.title.includes("Update") ||
                                  subItem.title.includes("Edit") ? (
                                    <Edit className="mr-2 h-3 w-3 text-muted-foreground" />
                                  ) : subItem.title.includes("Create") ||
                                    subItem.title.includes("Add") ? (
                                    <Settings className="mr-2 h-3 w-3 text-muted-foreground" />
                                  ) : null}
                                  <span className="text-sm">
                                    {subItem.title}
                                  </span>
                                </a>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </Collapsible>
                  ) : (
                    <SidebarMenuButton
                      asChild
                      isActive={isActive(item.url)}
                      className="hover:bg-sidebar-accent/50 transition-colors duration-200"
                    >
                      <a href={item.url} className="flex items-center">
                        <item.icon className="mr-3 h-4 w-4" />
                        <span className="font-medium">{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="p-3 border-t border-sidebar-border">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex w-full items-center gap-3 rounded-lg p-3 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors duration-200">
                <Avatar className="h-8 w-8 ring-2 ring-sidebar-border">
                  <AvatarImage
                    src={
                      user?.profilePicture ||
                      "/placeholder.svg?height=32&width=32"
                    }
                    alt="Teacher"
                  />
                  <AvatarFallback className="bg-primary text-primary-foreground text-sm font-medium">
                    {user?.name?.charAt(0).toUpperCase() || "T"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-1 flex-col text-left">
                  <span className="text-sm font-medium">
                    {user?.name || "Teacher"}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {user?.email || "teacher@example.com"}
                  </span>
                </div>
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={handleProfileClick}
              >
                <UserCircle className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="cursor-pointer text-red-600 focus:text-red-600"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
