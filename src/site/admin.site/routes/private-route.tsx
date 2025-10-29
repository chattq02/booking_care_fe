import NotFound from "@/site/NotFound";
import AdminLayout from "../layouts/admin-layout";
import Dashboard from "../pages/dashboard/dashboard";
import InfoDoctor from "../pages/info-doctor/info-doctor";
import type { RouteObject } from "react-router-dom";

export const adminPrivateRoutes: RouteObject = {
  path: "/",
  element: <AdminLayout />,
  children: [
    {
      path: "/",
      element: <Dashboard />,
    },
    {
      path: "/danh-sach-bac-si",
      element: <InfoDoctor />,
    },
    {
      path: "*",
      element: <NotFound />,
    },
  ],
};
