/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import {
  Home,
  UserCircle,
  LogOut,
  ChevronDown,
  ImageIcon,
  GraduationCap,
  Users,
  Calendar,
  Bell,
  Briefcase,
  Trophy,
  Edit,
  Settings,
  LayoutDashboard,
  Info,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { selectCurrentUser, logout } from "@/redux/features/auth/authSlice";
import { toast } from "sonner";

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
    url: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "About Us",
    icon: Info,
    submenu: [
      {
        title: "About",
        url: "/admin/about",
      },
      {
        title: "Update About",
        url: "/admin/about/create",
      },
    ],
  },

  {
    title: "Banner",
    icon: ImageIcon,
    submenu: [
      {
        title: "All Banners",
        url: "/admin/banner",
      },
      {
        title: "Create Banner",
        url: "/admin/banner/create",
      },
    ],
  },
  {
    title: "Teacher",
    icon: GraduationCap,
    submenu: [
      {
        title: "All Teachers",
        url: "/admin/teacher",
      },
      {
        title: "Add Teacher",
        url: "/admin/teacher/create",
      },
    ],
  },
  {
    title: "Staff",
    icon: Users,
    submenu: [
      {
        title: "All Staff",
        url: "/admin/staff",
      },
      {
        title: "Add Staff",
        url: "/admin/staff/create",
      },
    ],
  },
  {
    title: "Student",
    icon: UserCircle,
    submenu: [
      {
        title: "All Students",
        url: "/admin/student",
      },
      {
        title: "Add Student",
        url: "/admin/student/create",
      },
    ],
  },
  {
    title: "Attendance",
    icon: Calendar,
    submenu: [
      {
        title: "View Attendance",
        url: "/admin/attendance",
      },
      {
        title: "Create Attendance",
        url: "/admin/attendance/create",
      },
    ],
  },
  {
    title: "Notice",
    icon: Bell,
    submenu: [
      {
        title: "All Notices",
        url: "/admin/notice",
      },
      {
        title: "Create Notice",
        url: "/admin/notice/create",
      },
    ],
  },
  {
    title: "Department",
    icon: Briefcase,
    submenu: [
      {
        title: "All Departments",
        url: "/admin/department",
      },
      {
        title: "Add Department",
        url: "/admin/department/create",
      },
    ],
  },
  {
    title: "Exam",
    icon: Edit,
    submenu: [
      {
        title: "All Exams",
        url: "/admin/exam",
      },
    ],
  },
  {
    title: "Result",
    icon: Trophy,
    submenu: [
      {
        title: "All Results",
        url: "/admin/result",
      },
      {
        title: "Add Result",
        url: "/admin/result/create",
      },
    ],
  },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const user = useAppSelector(selectCurrentUser);
  const dispatch = useAppDispatch();
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
    toast.success("Logged out successfully!");
    router.push("/");
  };

  const handleProfileClick = () => {
    router.push("/admin/dashboard");
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
              School Admin
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
                    src="/placeholder.svg?height=32&width=32"
                    alt="Admin"
                  />
                  <AvatarFallback className="bg-primary text-primary-foreground text-sm font-medium">
                    AD
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-1 flex-col text-left">
                  <span className="text-sm font-medium">
                    {user?.name || "Administrator"}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {user?.email || "admin@school.edu"}
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
                <span>Profile Settings</span>
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
