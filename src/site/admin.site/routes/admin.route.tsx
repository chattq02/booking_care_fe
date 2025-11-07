import NotFound from "@/site/NotFound";
import AdminLayout from "../layouts/admin-layout";

import type { RouteObject } from "react-router-dom";
import Login from "../../../pages/auth/login/login";
import GuardRouteLayout from "../../../layouts/private-router";
import { PATH_ROUTE_ADMIN } from "../libs/enums/path";

import { withSuspense } from "../layouts/with-suspense";
import {
  LazyAcademicTitle,
  LazyDashboard,
  LazyInfoDoctor,
  LazyMedicalFacility,
  LazyMedicalFacilityDetail,
  LazyMedicalSchedule,
  LazySpecialty,
} from "./lazy-components";

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
          {
            path: "/",
            element: withSuspense(LazyDashboard),
          },
          {
            path: "/danh-sach-bac-si",
            element: withSuspense(LazyInfoDoctor),
          },
          {
            path: PATH_ROUTE_ADMIN.MEDICAL_SCHEDULE,
            element: withSuspense(LazyMedicalSchedule),
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
