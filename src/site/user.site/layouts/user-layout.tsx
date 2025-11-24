import { Outlet } from "react-router-dom";
import { NavUser } from "../ui/nav-user";
import { Bell, MessageSquare } from "lucide-react";
import { SearchBox } from "../components/search-box";
import { BreadcrumbPath } from "../components/bread-crumb-path";
import { accessTokenStore } from "@/stores/auth";
import Cookies from "js-cookie";
import { COOKIE_KEYS } from "@/constants";

export default function UserLayout() {
  const data = {
    user: {
      name: "shadcn",
      email: "m@example.com",
      avatar: "/avatars/shadcn.jpg",
    },
  };

  const token = accessTokenStore.get() || Cookies.get(COOKIE_KEYS.at);
  const isAuth = !!token;

  console.log("object");

  return (
    <div className="min-h-screen flex flex-col">
      <header className="flex h-16 shrink-0 items-center gap-2 sticky top-0 border-b px-4 z-50 bg-white">
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
            <NavUser isAuth={isAuth} user={data.user} />
          </div>
        </div>
      </header>

      {/* Sửa lại phần content */}
      <div className="@container/main bg-[#f3f5f7] flex-1 min-h-0 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
}
