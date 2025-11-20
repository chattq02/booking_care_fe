import * as React from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { BedSingle, BellRing, BookPlus, IdCard, Syringe } from "lucide-react";

import { NavMain } from "./nav-main";
import { useNavigate } from "react-router-dom";
import { PATH_ROUTE } from "../lib/enums/path";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const nav = useNavigate();

  const navMain = [
    {
      title: "Đặt khám",
      url: "#",
      icon: <BellRing size={20} />,
      isActive: true,
      items: [
        {
          name: "Cơ sở khám",
          icon: <BedSingle size={20} />,
          link: PATH_ROUTE.SPECIALISTEXAMINATION,
        },
        {
          name: "Bác sĩ",
          icon: <IdCard size={20} />,
          link: PATH_ROUTE.DOCTORS,
        },
        {
          name: "Gói khám",
          icon: <Syringe size={20} />,
          link: PATH_ROUTE.GENERALEXAMINATION,
        },
      ],
    },
  ];

  return (
    <Sidebar {...props}>
      <SidebarHeader
        className="border-sidebar-border h-16 flex items-center border-b "
        onClick={() => nav(PATH_ROUTE.HOME)}
      >
        <div className="font-bold text-[30px] text-[#5ca2b9] flex-1 cursor-pointer">
          Booking Care
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenuButton className="h-10 px-4 gap-2 mt-2 cursor-pointer">
          <div>
            <BookPlus size={20} />
          </div>
          <span className="text-[16px] font-bold">Gói khám</span>
        </SidebarMenuButton>
        <SidebarMenu>
          <SidebarSeparator className="mx-0" />
          <NavMain items={navMain} />
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}
