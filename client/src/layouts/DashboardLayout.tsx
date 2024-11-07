import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Outlet } from "react-router-dom";

export default function DashboardLayout() {
    return (
        <SidebarProvider>
            <AppSidebar />
            <main className="p-1">
                <SidebarTrigger />
                <section className="mt-6 ml-10">
                    <Outlet />
                </section>
            </main>
        </SidebarProvider>
    )
}
