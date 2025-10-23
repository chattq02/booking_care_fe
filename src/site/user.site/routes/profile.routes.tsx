import { PATH_ROUTE } from "../lib/enums/path";
import { lazy } from "react";

const Profile = lazy(() => import("../pages/profile/profile"));

export const profileRoutes = [
  { path: PATH_ROUTE.PROFILE, element: <Profile /> },
];
