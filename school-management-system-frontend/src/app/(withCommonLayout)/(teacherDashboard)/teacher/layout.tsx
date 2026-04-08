import { TeacherSidebar } from "@/components/dashboard/teacher/teacher-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { NuqsAdapter } from "nuqs/adapters/next/app";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <NuqsAdapter>
      <SidebarProvider>
        <TeacherSidebar />
        <main className="flex-1 w-full">
          <SidebarTrigger />
          <div className="w-full">{children}</div>
        </main>
      </SidebarProvider>
    </NuqsAdapter>
  );
}
