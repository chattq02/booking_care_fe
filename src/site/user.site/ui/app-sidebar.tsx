import * as React from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { Calendar } from "@/components/ui/calendar";
import { vi } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { CalendarDays, HandHeart, HeartPulse, Plus, SquareTerminal, User } from "lucide-react";
import { PATH_ROUTE } from "../libs/enum/path";
import { NavMain } from "./nav-main";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {

  const navMain = [{
    title: "Đặt khám",
    url: "#",
    icon: <SquareTerminal size={20} />,
    isActive: true,
    items: [
      {
        name: "Bệnh viện",
        icon: <HandHeart size={20} />,
        link: PATH_ROUTE.SPECIALISTEXAMINATION,
      },
      {
        name: "Bác sĩ",
        icon: <User size={20} />,
        link: PATH_ROUTE.DOCTORS,
      },
      {
        name: "Tiêm chủng",
        icon: <HeartPulse size={20} />,
        link: PATH_ROUTE.GENERALEXAMINATION,
      },
      {
        name: "Xét nghiệm",
        icon: <HeartPulse size={20} />,
        link: PATH_ROUTE.GENERALEXAMINATION,
      },
      {
        name: "Phòng khám",
        icon: <HeartPulse size={20} />,
        link: PATH_ROUTE.GENERALEXAMINATION,
      },
    ],
  }]

  return (
    <Sidebar {...props}>
      <SidebarHeader className="border-sidebar-border h-16 flex items-center border-b">
        <div className="font-bold text-[30px] text-[#5ca2b9] flex-1">
          Booking Care
        </div>
      </SidebarHeader>
      <SidebarContent>
        <Calendar mode="single" captionLayout="dropdown" locale={vi} />
        <SidebarSeparator className="mx-0" />
        <div className="px-4 flex-col space-y-3">
          <Button variant="outline" className="bg-white w-full">
            <Plus />
            Tạo lịch khám
          </Button>
          <SidebarSeparator className="mx-0" />
          <Button className="w-full bg-[#01aaa8]">
            <CalendarDays />
            Lịch khám của tôi
          </Button>
        </div>
        <SidebarMenuItem>
          <SidebarMenuButton className="h-10 px-4 gap-3 cursor-pointer">

            <span className="text-[16px] font-bold">aaaa</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
        <SidebarSeparator className="mx-0" />
        <SidebarMenu>
          <SidebarSeparator className="mx-0" />
          <NavMain items={navMain} />
        </SidebarMenu>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
