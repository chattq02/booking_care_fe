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
import { CalendarDays, HandHeart, HeartPulse, Plus, User } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router-dom";
import { PATH_ROUTE } from "../libs/enum/path";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const nav = useNavigate();

  const data_sidebar: {
    name: string;
    icon: React.ReactNode;
    link: string;
  }[] = [
    {
      name: "Chuyên khoa",
      icon: <HandHeart size={20} />,
      link: PATH_ROUTE.SPECIALISTEXAMINATION,
    },
    {
      name: "Bác sĩ",
      icon: <User size={20} />,
      link: PATH_ROUTE.DOCTORS,
    },
    {
      name: "Gói khám",
      icon: <HeartPulse size={20} />,
      link: PATH_ROUTE.GENERALEXAMINATION,
    },
  ];

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
            Tạo lịch hẹn
          </Button>
          <SidebarSeparator className="mx-0" />
          <Button className="w-full bg-[#01aaa8]">
            <CalendarDays />
            Lịch hẹn của tôi
          </Button>
        </div>
        <SidebarMenu>
          <SidebarSeparator className="mx-0" />
          {data_sidebar.map((item) => (
            <>
              <SidebarMenuItem key={uuidv4()} onClick={() => nav(item.link)}>
                <SidebarMenuButton className="h-10 px-4 gap-3 cursor-pointer">
                  <div>{item.icon}</div>
                  <span className="text-[16px] font-bold">{item.name}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarSeparator className="mx-0" />
            </>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
