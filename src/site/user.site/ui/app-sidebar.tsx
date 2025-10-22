import * as React from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { Calendar } from "@/components/ui/calendar";
import { vi } from "date-fns/locale";
import {
  BedSingle,
  BellRing,
  BookPlus,
  HeartPulse,
  IdCard,
  Syringe,
  TestTubeDiagonal,
} from "lucide-react";
import { PATH_ROUTE } from "../libs/enum/path";
import { NavMain } from "./nav-main";
import { useNavigate } from "react-router-dom";
import { DialogCreateAppointment } from "../components/create-appointment-dialog";

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
          name: "Bệnh viện",
          icon: <BedSingle size={20} />,
          link: PATH_ROUTE.SPECIALISTEXAMINATION,
        },
        {
          name: "Bác sĩ",
          icon: <IdCard size={20} />,
          link: PATH_ROUTE.DOCTORS,
        },
        {
          name: "Tiêm chủng",
          icon: <Syringe size={20} />,
          link: PATH_ROUTE.GENERALEXAMINATION,
        },
        {
          name: "Xét nghiệm",
          icon: <TestTubeDiagonal size={20} />,
          link: PATH_ROUTE.GENERALEXAMINATION,
        },
        {
          name: "Phòng khám",
          icon: <HeartPulse size={20} />,
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
        <div className="flex justify-center">
          <Calendar
            mode="single"
            captionLayout="dropdown"
            className="w-full"
            locale={vi}
            classNames={{
              today: "bg-[#01aaa8] text-white rounded-sm",
            }}
          />
        </div>
        <SidebarSeparator className="mx-0" />
        <div className="px-4 flex-col space-y-3">
          <DialogCreateAppointment />
        </div>
        <SidebarSeparator className="mx-0" />
        <SidebarMenuButton className="h-10 px-4 gap-2 cursor-pointer">
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
