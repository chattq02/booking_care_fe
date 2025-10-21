import { AppSidebar } from "@/site/user.site/ui/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Outlet } from "react-router-dom";
import { NavUser } from "../ui/nav-user";
import { Bell, MessageSquare } from "lucide-react";
import { SearchBox } from "../components/search-box";
import { Button } from "@/components/ui/button";

export default function UserLayout() {
  const data = {
    user: {
      name: "shadcn",
      email: "m@example.com",
      avatar: "/avatars/shadcn.jpg",
    },
    calendars: [
      {
        name: "My Calendars",
        items: ["Personal", "Work", "Family"],
      },
      {
        name: "Favorites",
        items: ["Holidays", "Birthdays"],
      },
      {
        name: "Other",
        items: ["Travel", "Reminders", "Deadlines"],
      },
    ],
  };
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 sticky top-0 border-b px-4 bg-white z-99999">
          <div className="flex flex-1 items-center gap-2 px-3">
            <SidebarTrigger />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <Button>Today</Button>
                </BreadcrumbItem>
                <BreadcrumbItem>
                  <BreadcrumbPage className="line-clamp-1">
                    October 2024
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="relative w-1/4">
            <SearchBox />
          </div>
          <div className="ml-auto px-3">
            <div className="flex items-center gap-6">
              <div>
                <MessageSquare size={20} />
              </div>
              <div>
                <Bell size={20} className="block" />
              </div>
              <NavUser user={data.user} />
            </div>
          </div>
        </header>
        <div className="bg-[#f3f5f7]">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
