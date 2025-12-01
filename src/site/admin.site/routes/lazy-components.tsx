// src/routes/admin/lazy-components.tsx
import { lazy } from "react";

// Lazy import tất cả các component
export const LazyDashboard = lazy(() => import("../pages/dashboard/dashboard"));
export const LazyInfoDoctor = lazy(
  () => import("../pages/info-doctor/info-doctor")
);
export const LazyAcademicTitle = lazy(
  () => import("../pages/academic-title/academic-title")
);
export const LazySpecialty = lazy(() => import("../pages/specialty/specialty"));

export const LazyMedicalFacility = lazy(
  () => import("../pages/medical-facility/medical-facility")
);

export const LazyMedicalFacilityDetail = lazy(
  () => import("../pages/medical-facility/medical-facility-detail")
);
