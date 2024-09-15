import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import Home from "../pages/Home";
import Register from "../pages/Register";
import Login from "../pages/Login";
import PrivateRoute from "../protected/PrivateRoute";
import DashboardLayout from "../layouts/DashboardLayout";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <MainLayout/>,
        children: [
            {
                path: '/',
                element: <Home/>
            },
            {
                path: '/register',
                element: <Register/>
            },
            {
                path: '/login',
                element: <Login/>
            }
        ]
    },
    {
        path: 'dashboard',
        element: <PrivateRoute><DashboardLayout/></PrivateRoute>
    }
]);