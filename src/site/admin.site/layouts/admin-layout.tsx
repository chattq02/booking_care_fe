import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Outlet } from "react-router-dom";
import { NavUser } from "../ui/nav-user";
import { Bell, MessageSquare } from "lucide-react";
import { BreadcrumbPath } from "../components/bread-crumb-path";
import { AppSidebar } from "../ui/app-sidebar";
import { useAtomValue } from "jotai";
import { userAtom } from "@/stores/auth";

export default function AdminLayout() {
  const user = useAtomValue(userAtom);

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 sticky top-0 border-b px-4 z-10 bg-white">
          <div className="flex flex-1 items-center gap-2 px-3">
            <SidebarTrigger />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <BreadcrumbPath />
          </div>
          <div className="ml-auto px-3">
            <div className="flex items-center gap-6">
              <div>
                <MessageSquare size={20} />
              </div>
              <div>
                <Bell size={20} className="block" />
              </div>
              <NavUser
                user={{
                  name: user?.fullName ?? "",
                  email: user?.email ?? "",
                  avatar: "",
                }}
              />
            </div>
          </div>
        </header>
        <div className="@container/main bg-[#f3f5f7] flex flex-1 flex-col">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
