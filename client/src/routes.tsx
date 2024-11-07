import { lazy } from "react";
import { createBrowserRouter } from "react-router-dom";

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
    }
]);

export default routes;