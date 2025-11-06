import * as React from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
} from "@/components/ui/sidebar";

import {
  BriefcaseBusiness,
  CalendarDays,
  ChartColumnStacked,
  GraduationCap,
  Hospital,
  Info,
  MapPin,
  TicketPlus,
  UserStar,
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import { PATH_ROUTE } from "@/site/user.site/lib/enums/path";
import { NavMain } from "./nav-main";
import { PATH_ROUTE_ADMIN } from "../libs/enums/path";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const nav = useNavigate();

  const navMain = [
    {
      title: "Tổng quan",
      url: "/",
      icon: <ChartColumnStacked size={20} />,
      isCollapsed: false,
    },
    {
      title: "Quản lý bác sĩ",
      url: "#",
      icon: <UserStar size={20} />,
      isActive: true,
      items: [
        {
          name: "Danh sách bác sĩ",
          icon: <Info size={20} />,
          link: PATH_ROUTE_ADMIN.LIST_DOCTOR,
        },
        {
          name: "Khung giờ khám",
          icon: <CalendarDays size={20} />,
          link: PATH_ROUTE_ADMIN.MEDICAL_SCHEDULE,
        },
      ],
    },
    {
      title: "Quản lý y tế",
      url: "#",
      icon: <Hospital size={20} />,
      isActive: true,
      items: [
        {
          name: "Cơ sở y tế",
          icon: <MapPin size={20} />,
          link: PATH_ROUTE_ADMIN.MEDICAL_FACILITY,
        },
        {
          name: "Hàm vị, học vị",
          icon: <GraduationCap size={20} />,
          link: PATH_ROUTE_ADMIN.ACADEMIC_TITLE,
        },
        {
          name: "Chuyên khoa",
          icon: <BriefcaseBusiness size={20} />,
          link: PATH_ROUTE_ADMIN.SPECIALTY,
        },
        {
          name: "Gói khám",
          icon: <TicketPlus size={20} />,
          link: PATH_ROUTE.GENERALEXAMINATION,
        },
      ],
    },
  ];

  return (
    <Sidebar {...props}>
      <SidebarHeader
        className="border-sidebar-border h-16 cursor-pointer flex items-center justify-center text-center border-b font-bold text-[24px] text-[#5ca2b9]"
        onClick={() => nav(PATH_ROUTE.HOME)}
      >
        Booking Care Admin
      </SidebarHeader>
      <SidebarContent className="gap-0">
        <NavMain items={navMain} />
      </SidebarContent>
    </Sidebar>
  );
}
