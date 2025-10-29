import type { RouteObject } from "react-router-dom";
import Login from "../pages/auth/login/login";

export const adminPublicRoutes: RouteObject[] = [
  {
    path: "/login",
    element: <Login />,
  },
];
