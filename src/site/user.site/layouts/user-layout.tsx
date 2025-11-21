import { Outlet } from "react-router-dom";
import { NavUser } from "../ui/nav-user";
import { Bell, MessageSquare } from "lucide-react";
import { SearchBox } from "../components/search-box";
import { BreadcrumbPath } from "../components/bread-crumb-path";

export default function UserLayout() {
  const data = {
    user: {
      name: "shadcn",
      email: "m@example.com",
      avatar: "/avatars/shadcn.jpg",
    },
  };
  return (
    <div className="h-screen flex flex-col">
      <header className="flex h-16 shrink-0 items-center gap-2 sticky top-0 border-b px-4 z-10 bg-white">
        <div className="flex flex-1 items-center gap-2 px-3">
          <BreadcrumbPath />
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

      {/* Quan trọng: min-h-0 để flex item có thể co lại */}
      <div className="@container/main bg-[#f3f5f7] flex-1">
        <Outlet />
      </div>
    </div>
  );
}
