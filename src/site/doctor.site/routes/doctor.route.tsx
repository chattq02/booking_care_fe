import type { RouteObject } from "react-router-dom";
import { PATH_ROUTE_DOCTOR } from "../lib/enums/path";
import PrivateRouteDoctor from "../layouts/private-route-doctor";
import Login from "@/pages/auth/login/login";
import DoctorLayout from "../layouts/doctor-layout";
import Home from "../pages/home/home";
import ListPatient from "../pages/list-patient/list-patient";
import { withSuspense } from "@/layouts/with-suspense";
import { LazyListAppointment } from "./lazy-compoents";

export const doctorRoutes: RouteObject[] = [
  {
    element: <PrivateRouteDoctor auth={false} redirect="/" />,
    children: [
      { path: PATH_ROUTE_DOCTOR.LOGIN, element: <Login role="Doctor" /> },
    ],
  },
  {
    element: (
      <PrivateRouteDoctor auth={true} redirect={PATH_ROUTE_DOCTOR.LOGIN} />
    ),
    children: [
      {
        element: <DoctorLayout />,
        children: [
          { path: PATH_ROUTE_DOCTOR.HOME, element: <Home /> },
          {
            path: PATH_ROUTE_DOCTOR.APPOINTMENT_LIST,
            element: withSuspense(LazyListAppointment),
          },
          {
            path: PATH_ROUTE_DOCTOR.PATIENTS_LIST,
            element: <ListPatient />,
          },
        ],
      },
    ],
  },
];
