import { lazy } from "react";

export const LazyListAppointment = lazy(
  () => import("../pages/list-appointment/list-appointment")
);
