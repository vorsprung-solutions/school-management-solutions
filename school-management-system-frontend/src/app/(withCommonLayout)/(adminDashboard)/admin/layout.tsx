import type React from "react" 
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AdminSidebar } from "@/components/dashboard/admin/admin-sidebar"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AdminSidebar />
      <main className="flex-1 w-full">
        <SidebarTrigger />
        <div className="w-full">{children}</div>
      </main>
    </SidebarProvider>
  )
}
