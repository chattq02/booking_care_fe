import NotFound from "@/site/NotFound";
import AdminLayout from "../layouts/admin-layout";
import Dashboard from "../pages/dashboard/dashboard";
import InfoDoctor from "../pages/info-doctor/info-doctor";
import type { RouteObject } from "react-router-dom";
import Login from "../../../pages/auth/login/login";
import GuardRouteLayout from "../../../layouts/private-router";
import { PATH_ROUTE_ADMIN } from "../libs/enums/path";
import MedicalSchedule from "../pages/medical-schedule/medical-schedule";
import AcademicTitle from "../pages/academic-title/academic-title";
import Specialty from "../pages/specialty/specialty";
import MedicalFacility from "../pages/medical-facility/medical-facility";

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
          {
            path: PATH_ROUTE_ADMIN.MEDICAL_SCHEDULE,
            element: <MedicalSchedule />,
          },
          {
            path: PATH_ROUTE_ADMIN.ACADEMIC_TITLE,
            element: <AcademicTitle />,
          },
          {
            path: PATH_ROUTE_ADMIN.SPECIALTY,
            element: <Specialty />,
          },
          {
            path: PATH_ROUTE_ADMIN.MEDICAL_FACILITY,
            element: <MedicalFacility />,
          },
          { path: "*", element: <NotFound /> },
        ],
      },
    ],
  },
];
