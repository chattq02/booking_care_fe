import Login from "@/pages/auth/login/login";
import { PATH_ROUTE } from "../lib/enums/path";
import { lazy } from "react";
import Home from "../pages/home/home";
import UserLayout from "../layouts/user-layout";
import type { RouteObject } from "react-router-dom";
import ListFacility from "../pages/facility/list-facility";
import ListDoctor from "../pages/doctors/list-doctor";

const Doctors = lazy(() => import("../pages/doctors/doctors"));

export const userRoutes: RouteObject[] = [
  {
    path: PATH_ROUTE.LOGIN,
    element: <Login role="User" />,
  },
  {
    element: <UserLayout />,
    children: [
      { path: PATH_ROUTE.HOME, element: <Home /> },
      { path: `${PATH_ROUTE.DOCTORS}/:id`, element: <Doctors /> },
      { path: PATH_ROUTE.LISTFACILITY, element: <ListFacility /> },
      { path: PATH_ROUTE.LISTDOCTOR, element: <ListDoctor /> },
    ],
  },
];
