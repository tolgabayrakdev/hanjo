import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Outlet } from "react-router-dom";

export default function DashboardLayout() {
    return (
        
        <SidebarProvider>
            <AppSidebar />
            <main className="flex-1 overflow-auto">
                <SidebarTrigger />
                <section className="mt-2 ml-2 p-3">
                    <Outlet />
                </section>
            </main>
        </SidebarProvider>
    )
}
