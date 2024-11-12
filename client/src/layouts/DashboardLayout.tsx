import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/toaster";
import AuthWrapper from "@/providers/AuthProvider";
import { Outlet } from "react-router-dom";

function DashboardLayout() {
    return (
        <SidebarProvider>
            <AppSidebar />
            <main className="flex-1 overflow-auto">
                <SidebarTrigger />
                <Toaster />
                <section className="mt-2 ml-2 p-3">
                    <Outlet />
                </section>
            </main>
        </SidebarProvider>
    )
}

export default AuthWrapper(DashboardLayout);