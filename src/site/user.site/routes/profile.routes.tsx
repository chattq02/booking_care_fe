import { PATH_ROUTE } from "../libs/enum/path";
import { lazy } from "react";

const Profile = lazy(() => import("../pages/profile/profile"));

export const profileRoutes = [
  { path: PATH_ROUTE.PROFILE, element: <Profile /> },
];
