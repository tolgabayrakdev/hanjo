import { lazy } from "react";
import { createBrowserRouter } from "react-router-dom";

const NotFoundPage = lazy(() => import("./pages/NotFound"));

const HomePage = lazy(() => import("./pages/Home"));
const SignInPage = lazy(() => import("./pages/authentication/SignIn"));
const SignUpPage = lazy(() => import("./pages/authentication/SignUp"));

const DashboardLayout = lazy(() => import("./layouts/DashboardLayout"));
const DashboardPage = lazy(() => import("./pages/dashboard/Index"));
const DashboardSettingsPage = lazy(() => import("./pages/dashboard/Settings"));
const DashboardTasksPage = lazy(() => import("./pages/dashboard/Tasks"));
const DashboardContactsPage = lazy(() => import("./pages/dashboard/Contacts"));
const DashboardBudgetsPage = lazy(() => import("./pages/dashboard/Budgets"));

const routes = createBrowserRouter([
    {
        path: "/",
        element: <HomePage />
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
        path: "/dashboard",
        element: <DashboardLayout />,
        children: [
            { path: "", element: <DashboardPage />, index: true },
            { path: "settings", element: <DashboardSettingsPage /> },
            { path: "tasks", element: <DashboardTasksPage /> },
            { path: "contacts", element: <DashboardContactsPage /> },
            { path: "budgets", element: <DashboardBudgetsPage /> },
        ]
    },
    {
        path: "/*",
        element: <NotFoundPage />

    }
],{future: {
    v7_fetcherPersist: true,
    v7_normalizeFormMethod: true,
    v7_partialHydration: true,
    v7_relativeSplatPath: true,
    v7_skipActionErrorRevalidation: true
}});

export default routes;