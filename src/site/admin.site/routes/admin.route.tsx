import NotFound from "@/site/NotFound";
import AdminLayout from "../layouts/admin-layout";
import type { RouteObject } from "react-router-dom";
import Login from "../../../pages/auth/login/login";
import GuardRouteLayout from "../layouts/private-router";
import { PATH_ROUTE_ADMIN } from "../libs/enums/path";
import { withSuspense } from "../../../layouts/with-suspense";
import {
  LazyAcademicTitle,
  LazyDashboard,
  LazyInfoDoctor,
  LazyMedicalFacility,
  LazyMedicalFacilityDetail,
  LazySpecialty,
} from "./lazy-components";
import SelectFacilities from "@/pages/auth/select-facilities/select-facilities";

export const adminRoutes: RouteObject[] = [
  // Public routes - không cần auth
  {
    element: <GuardRouteLayout auth={false} redirect="/" />,
    children: [{ path: "/login", element: <Login role="Admin" /> }],
  },
  {
    element: <GuardRouteLayout auth={true} redirect={PATH_ROUTE_ADMIN.LOGIN} />,
    children: [
      {
        path: PATH_ROUTE_ADMIN.SELECT_FACILITIES,
        element: <SelectFacilities />,
      },
    ],
  },
  {
    element: <GuardRouteLayout auth={true} redirect={PATH_ROUTE_ADMIN.LOGIN} />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          {
            path: "/",
            element: withSuspense(LazyDashboard),
          },
          {
            path: "/danh-sach-bac-si",
            element: withSuspense(LazyInfoDoctor),
          },
          {
            path: PATH_ROUTE_ADMIN.ACADEMIC_TITLE,
            element: withSuspense(LazyAcademicTitle),
          },
          {
            path: PATH_ROUTE_ADMIN.SPECIALTY,
            element: withSuspense(LazySpecialty),
          },
          {
            path: PATH_ROUTE_ADMIN.MEDICAL_FACILITY,
            element: withSuspense(LazyMedicalFacility),
          },
          {
            path: `${PATH_ROUTE_ADMIN.MEDICAL_FACILITY}/:id/:name`,
            element: withSuspense(LazyMedicalFacilityDetail),
          },
          {
            path: "*",
            element: <NotFound />,
          },
        ],
      },
    ],
  },
];
