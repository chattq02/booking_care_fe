// src/routes/user.routes.tsx
import UserLayout from "@/site/user.site/layouts/user-layout";
import { PATH_ROUTE } from "../libs/enum/path";
import NotFound from "@/site/NotFound";
import { lazy } from "react";
import { doctorRoutes } from "./doctor.routes";
import Home from "../pages/home/home";
import { profileRoutes } from "./profile.routes";

const GeneralExamination = lazy(
  () => import("../pages/general-examination/general-examination")
);
const Specialty = lazy(() => import("../pages/specialty/specialty"));

export const userRoutes = {
  path: "/",
  element: <UserLayout />,
  children: [
    ...doctorRoutes,
    ...profileRoutes,
    { path: PATH_ROUTE.HOME, element: <Home /> },
    { path: PATH_ROUTE.GENERALEXAMINATION, element: <GeneralExamination /> },
    { path: PATH_ROUTE.SPECIALISTEXAMINATION, element: <Specialty /> },
    {
      path: "*",
      element: <NotFound />,
    },
  ],
};
