import NotFound from "@/site/NotFound";
import AdminLayout from "../layouts/admin-layout";
import Dashboard from "../pages/dashboard/dashboard";
import InfoDoctor from "../pages/info-doctor/info-doctor";
import type { RouteObject } from "react-router-dom";
import Login from "../pages/auth/login/login";
import GuardRouteLayout from "../layouts/private-router";

export const adminRoutes: RouteObject[] = [
  {
    element: <GuardRouteLayout auth={false} redirect="/" />, // public route
    children: [{ path: "/login", element: <Login /> }],
  },
  {
    element: <GuardRouteLayout auth={true} redirect="/login" />, // private route
    children: [
      {
        element: <AdminLayout />,
        children: [
          { path: "/", element: <Dashboard /> },
          { path: "/danh-sach-bac-si", element: <InfoDoctor /> },
          { path: "*", element: <NotFound /> },
        ],
      },
    ],
  },
];
