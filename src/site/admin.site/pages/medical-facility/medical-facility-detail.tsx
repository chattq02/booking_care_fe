import React, { useRef, useEffect, useState } from "react";
import { Menu, Switch, Avatar } from "antd";

import {
  LockOutlined,
  KeyOutlined,
  BellOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import InfoBasic from "./components/info-basic";
import ListDoctor from "./components/list-doctor";
import ScheduleFacility from "./components/schedule-facility";
import SpecialtyFacility from "./components/specialty-facility";

type SectionKey =
  | "profile"
  | "scheduleFacility"
  | "listDoctor"
  | "specialtyFacility";

const LazyMedicalFacilityDetail: React.FC = () => {
  // refs cho mỗi section (consistently typed)
  const profileRef = useRef<HTMLDivElement | null>(null);
  const scheduleFacilityRef = useRef<HTMLDivElement | null>(null);
  const listDoctorRef = useRef<HTMLDivElement | null>(null);
  const specialtyFacilityRef = useRef<HTMLDivElement | null>(null);

  // mapping cho menu -> ref
  const sectionRefs: Record<
    SectionKey,
    React.RefObject<HTMLDivElement | null>
  > = {
    profile: profileRef,
    scheduleFacility: scheduleFacilityRef,
    listDoctor: listDoctorRef,
    specialtyFacility: specialtyFacilityRef,
  };

  // state active menu (scrollspy)
  const [activeKey, setActiveKey] = useState<SectionKey>("profile");

  // Hàm cuộn có offset (để tránh header sticky che)
  const scrollToSection = (
    ref: React.RefObject<HTMLDivElement>,
    offset = 90
  ) => {
    const el = ref.current;
    if (!el) return;
    // offset dương: trừ đi offset (header height). Mặc định 90px, thay nếu header khác.
    const y = el.getBoundingClientRect().top + window.pageYOffset - offset;
    window.scrollTo({ top: y, behavior: "smooth" });
  };

  // Thay thế useEffect với logic đơn giản hơn
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 50; // Offset cho header

      // Tìm section nào đang ở gần top nhất
      const sections = Object.entries(sectionRefs).map(([key, ref]) => ({
        key: key as SectionKey,
        offsetTop: ref.current?.offsetTop || 0,
        height: ref.current?.offsetHeight || 0,
      }));

      const currentSection = sections.reduce((prev, curr) => {
        return Math.abs(curr.offsetTop - scrollPosition) <
          Math.abs(prev.offsetTop - scrollPosition)
          ? curr
          : prev;
      });

      setActiveKey(currentSection.key);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const onMenuClick = ({ key }: { key: string }) => {
    const k = key as SectionKey;
    setActiveKey(k);
    // scroll với offset 90 (tùy chỉnh nếu header cao hơn/thấp hơn)
    scrollToSection(sectionRefs[k] as React.RefObject<HTMLDivElement>, 90);
  };

  return (
    <div
      className="flex w-full gap-5"
      style={{ padding: "5px 20px", marginBottom: "15px" }}
    >
      {/* Main content */}
      <div className="flex-1 overflow-x-auto">
        {/* Header / Avatar */}
        <div className="flex flex-col w-full gap-4 mt-[16.5px]">
          <div
            ref={profileRef}
            data-section="profile"
            className="bg-white rounded-md p-4 flex items-center justify-between"
          >
            <div className="flex items-center space-x-4">
              <Avatar size={64} src="https://i.pravatar.cc/100" />
              <div>
                <h2 className="text-lg font-semibold">Alex Thompson</h2>
                <p className="text-sm text-gray-500">CEO / Co-Founder</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">Switch to invisible</span>
              <Switch />
            </div>
          </div>

          <InfoBasic ref={profileRef} />
          <ListDoctor ref={listDoctorRef} />
          <SpecialtyFacility ref={specialtyFacilityRef} />
          <ScheduleFacility ref={scheduleFacilityRef} />
        </div>
      </div>

      {/* Sidebar - sticky */}
      <aside>
        <div
          className="bg-white rounded-md shadow-sm p-3 w-[220px]"
          style={{ position: "sticky", top: 85 }}
        >
          <Menu
            mode="vertical"
            className="border-0!"
            selectedKeys={[activeKey]}
            onClick={onMenuClick}
            items={[
              {
                key: "profile",
                icon: <SettingOutlined />,
                label: "Thông tin",
              },
              {
                key: "listDoctor",
                icon: <KeyOutlined />,
                label: "Danh sách bác sĩ",
              },
              {
                key: "specialtyFacility",
                icon: <BellOutlined />,
                label: "Chuyên khoa",
              },
              {
                key: "scheduleFacility",
                icon: <LockOutlined />,
                label: "Lịch làm việc",
              },
            ]}
          />
        </div>
      </aside>
    </div>
  );
};

export default LazyMedicalFacilityDetail;
