import { Outlet } from "react-router-dom";

function DashboardLayout() {
    return (
        <section>
            <Outlet />
        </section>
    )
}


export default DashboardLayout;