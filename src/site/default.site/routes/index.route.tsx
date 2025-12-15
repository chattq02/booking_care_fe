import type { RouteObject } from "react-router-dom";

import VerifyEmail from "@/site/doctor.site/pages/verify-email/verify-email";
import { PATH_ROUTE_INDEX } from "../libs/enums/path";
import NotFound from "@/site/NotFound";

export const indexRoutes: RouteObject[] = [
  {
    path: PATH_ROUTE_INDEX.VERIFY_EMAIL,
    element: <VerifyEmail />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
];
