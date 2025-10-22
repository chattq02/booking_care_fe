import { PATH_ROUTE } from "../libs/enum/path";
import { lazy } from "react";

const Doctors = lazy(() => import("../pages/doctors/doctors"));

export const doctorRoutes = [
  { path: PATH_ROUTE.DOCTORS, element: <Doctors /> },
  { path: `${PATH_ROUTE.DOCTORS}/:id`, element: <Doctors /> },
];
