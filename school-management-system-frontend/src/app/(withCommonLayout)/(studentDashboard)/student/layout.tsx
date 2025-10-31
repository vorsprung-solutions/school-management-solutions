 
import { StudentSidebar } from "@/components/dashboard/student/student-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <StudentSidebar />
      <main className="flex-1 w-full">
        <SidebarTrigger />
        <div className="w-full">{children}</div>
      </main>
    </SidebarProvider>
  );
}
