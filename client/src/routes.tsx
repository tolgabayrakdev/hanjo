import { lazy } from "react";
import { createBrowserRouter } from "react-router-dom";

const NotFoundPage = lazy(() => import("./pages/errors/NotFound"));

const HomePage = lazy(() => import("./pages/Home"));
const SignInPage = lazy(() => import("./pages/auth/SignIn"));
const SignUpPage = lazy(() => import("./pages/auth/SignUp"));


const DashboardLayout = lazy(() => import("./layouts/DashboardLayout"));
const DashboardIndexPage = lazy(() => import("./pages/dashboard/Index"));
const DashboardSettingsPage = lazy(() => import("./pages/dashboard/Settings"));

const routes = createBrowserRouter([
    {
        path: "/",
        element: <HomePage />
    },
    {
        path: "/dashboard",
        element: <DashboardLayout />,
        children: [
            {
                path: "",
                element: <DashboardIndexPage />
            },
            {
                path: "settings",
                element: <DashboardSettingsPage />
            }
        ]
    },
    {
        path: "/sign-in",
        element: <SignInPage />
    },
    {
        path: "/sign-up",
        element: <SignUpPage />
    },
    {
        path: "*",
        element: <NotFoundPage />
    }

]);

export default routes;