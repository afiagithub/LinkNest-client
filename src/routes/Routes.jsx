import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import Home from "../pages/Home";
import Register from "../pages/Register";
import Login from "../pages/Login";
import PrivateRoute from "../protected/PrivateRoute";
import DashboardLayout from "../layouts/DashboardLayout";
import UserHome from "../pages/dashboardpages/UserHome";
import AddFriend from "../pages/dashboardpages/AddFriend";
import ManageReq from "../pages/dashboardpages/ManageReq";
import ManageUser from "../pages/dashboardpages/ManageUser";

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
        element: <PrivateRoute><DashboardLayout/></PrivateRoute>,
        children: [
            {
                index: true,
                element: <UserHome/>
            },
            {
                path: 'add-friend',
                element: <AddFriend/>
            },
            {
                path: 'manage-req',
                element: <ManageReq/>
            },
            {
                path: 'update-profile',
                element: <ManageUser/>
            }
        ]
    }
]);