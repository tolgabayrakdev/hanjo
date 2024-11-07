import { lazy } from "react";
import { createBrowserRouter } from "react-router-dom";

const NotFoundPage = lazy(() => import("./pages/NotFound"));

const HomePage = lazy(() => import("./pages/Home"));
const SignInPage = lazy(() => import("./pages/authentication/SignIn"));
const SignUpPage = lazy(() => import("./pages/authentication/SignUp"));


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
        path: "/*",
        element: <NotFoundPage />

    }
]);

export default routes;