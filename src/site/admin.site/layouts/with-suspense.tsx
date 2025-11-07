import { Skeleton } from "antd";
import { Suspense } from "react";

export const withSuspense = (Component: React.ComponentType) => (
  <Suspense fallback={<Skeleton active />}>
    <Component />
  </Suspense>
);
