import { memo, useCallback, useMemo, Suspense } from "react";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Outlet } from "react-router-dom";
import { NavUser } from "../ui/nav-user";
import { Bell, MessageSquare } from "lucide-react";
import { BreadcrumbPath } from "../components/bread-crumb-path";
import LoadingProvider from "@/layouts/loading";
import { Separator } from "@/components/ui/separator";
import AppSidebar from "../ui/app-sidebar";
import { debounce } from "lodash";

// Optimized SidebarTrigger
const OptimizedSidebarTrigger = memo(() => {
  const handleClick = useCallback(
    debounce((e: React.MouseEvent) => {
      e.preventDefault();
      // Xử lý click
    }, 1000),
    []
  );

  return <SidebarTrigger onClick={handleClick} className="sidebar-trigger" />;
});

// Memoize các component
const MemoizedNavUser = memo(NavUser);
const MemoizedBreadcrumbPath = memo(BreadcrumbPath);
const MemoizedOutLet = memo(Outlet);
const OptimizedSidebarProvider = memo(SidebarProvider);

const SidebarSkeleton = () => (
  <div className="w-64 bg-gray-100 animate-pulse">
    <div className="h-16 bg-gray-200 mb-4"></div>
    <div className="space-y-2 p-4">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="h-8 bg-gray-200 rounded"></div>
      ))}
    </div>
  </div>
);

function AdminLayout() {
  const headerContent = useMemo(
    () => (
      <header className="flex h-16 shrink-0 items-center gap-2 sticky top-0 border-b px-4 z-10 bg-white">
        <div className="flex flex-1 items-center gap-2 px-3">
          <OptimizedSidebarTrigger />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <MemoizedBreadcrumbPath />
        </div>
        <div className="ml-auto px-3">
          <div className="flex items-center gap-6">
            <div>
              <MessageSquare size={20} />
            </div>
            <div>
              <Bell size={20} className="block" />
            </div>
            <MemoizedNavUser />
          </div>
        </div>
      </header>
    ),
    []
  );

  const mainContent = useMemo(
    () => (
      <div className="@container/main bg-[#f3f5f7] flex flex-1 flex-col">
        <LoadingProvider>
          <MemoizedOutLet />
        </LoadingProvider>
      </div>
    ),
    []
  );

  return (
    <OptimizedSidebarProvider>
      <AppSidebar />
      <SidebarInset>
        {headerContent}
        <Suspense fallback={<SidebarSkeleton />}>{mainContent}</Suspense>
      </SidebarInset>
    </OptimizedSidebarProvider>
  );
}

export default memo(AdminLayout);
