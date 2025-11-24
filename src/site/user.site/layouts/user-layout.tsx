import { Outlet } from "react-router-dom";
import { NavUser } from "../ui/nav-user";
import { Bell, MessageSquare, Menu } from "lucide-react";
import { SearchBox } from "../components/search-box";
import { BreadcrumbPath } from "../components/bread-crumb-path";
import { accessTokenStore, userAtom } from "@/stores/auth";
import Cookies from "js-cookie";
import { COOKIE_KEYS } from "@/constants";
import { useAtomValue } from "jotai";
import { useState } from "react";
import { Drawer, Button } from "antd";

export default function UserLayout() {
  const user = useAtomValue(userAtom);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const data = {
    user: {
      name: user?.fullName ?? "",
      email: user?.email ?? "",
      avatar: "",
    },
  };

  const token = accessTokenStore.get() || Cookies.get(COOKIE_KEYS.at);
  const isAuth = !!token;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="flex h-16 shrink-0 items-center gap-2 sticky top-0 border-b px-4 lg:px-6 z-50 bg-white">
        {/* Mobile menu button - Hiển thị trên mobile */}
        <div className="flex lg:hidden">
          <Button
            type="text"
            icon={<Menu size={20} />}
            onClick={() => setMobileMenuOpen(true)}
            className="flex items-center justify-center"
          />
        </div>

        {/* Breadcrumb - Ẩn trên mobile, hiển thị trên tablet và desktop */}
        <div className="hidden sm:flex flex-1 items-center gap-2 px-3 min-w-0">
          <BreadcrumbPath />
        </div>

        {/* Search box - Hiển thị khác nhau tùy breakpoint */}
        <div className="hidden md:block relative md:w-1/3 lg:w-1/4 xl:w-1/5 min-w-[200px]">
          <SearchBox />
        </div>

        {/* Navigation icons and user */}
        <div className="ml-auto px-3">
          <div className="flex items-center gap-4 lg:gap-6">
            {/* Message icon - Ẩn trên mobile, hiển thị trên tablet trở lên */}
            <div className="hidden sm:block">
              <MessageSquare
                size={20}
                className="text-gray-600 hover:text-blue-600 transition-colors cursor-pointer"
              />
            </div>

            {/* Bell icon - Ẩn trên mobile, hiển thị trên tablet trở lên */}
            <div className="hidden sm:block">
              <Bell
                size={20}
                className="text-gray-600 hover:text-blue-600 transition-colors cursor-pointer"
              />
            </div>

            {/* User navigation */}
            <NavUser isAuth={isAuth} user={data.user} />
          </div>
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      <Drawer
        title="Menu"
        placement="left"
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        width={280}
        className="lg:hidden"
      >
        <div className="flex flex-col space-y-4">
          {/* Mobile Breadcrumb */}
          <div className="sm:hidden">
            <div className="font-semibold text-gray-900 mb-2">Đường dẫn</div>
            <BreadcrumbPath />
          </div>

          {/* Mobile Navigation Items */}
          <div className="flex flex-col space-y-3 pt-4">
            <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 cursor-pointer">
              <MessageSquare size={18} />
              <span>Tin nhắn</span>
            </div>
            <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 cursor-pointer">
              <Bell size={18} />
              <span>Thông báo</span>
            </div>
          </div>
        </div>
      </Drawer>

      {/* Main Content */}
      <div className="@container/main bg-[#f3f5f7] flex-1 min-h-0 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
}
