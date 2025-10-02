import { AppSidebar } from "@/components/layout/app-sidebar";
import { Sidebar, SidebarInset, SidebarProvider, SidebarRail } from "@/components/ui/sidebar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
        <Sidebar>
            <AppSidebar />
            <SidebarRail />
        </Sidebar>
        <SidebarInset>
            <div className="min-h-screen">
                {children}
            </div>
        </SidebarInset>
    </SidebarProvider>
  );
}
