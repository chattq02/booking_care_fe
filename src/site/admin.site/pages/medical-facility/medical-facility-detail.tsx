import React, { useRef, useEffect, useState } from "react";
import { Menu, Switch, Avatar } from "antd";

import {
  UserOutlined,
  LockOutlined,
  KeyOutlined,
  BellOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import InfoBasic from "./components/info-basic";
import ListDoctor from "./components/list-doctor";

type SectionKey =
  | "profile"
  | "basic"
  | "password"
  | "listDoctor"
  | "notifications"
  | "delete";

const LazyMedicalFacilityDetail: React.FC = () => {
  // refs cho mỗi section (consistently typed)
  const profileRef = useRef<HTMLDivElement | null>(null);
  const basicRef = useRef<HTMLDivElement | null>(null);
  const passwordRef = useRef<HTMLDivElement | null>(null);
  const listDoctorRef = useRef<HTMLDivElement | null>(null);
  const notificationsRef = useRef<HTMLDivElement | null>(null);
  const deleteRef = useRef<HTMLDivElement | null>(null);

  // mapping cho menu -> ref
  const sectionRefs: Record<
    SectionKey,
    React.RefObject<HTMLDivElement | null>
  > = {
    profile: profileRef,
    basic: basicRef,
    password: passwordRef,
    listDoctor: listDoctorRef,
    notifications: notificationsRef,
    delete: deleteRef,
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

  // Scroll-spy: IntersectionObserver để setActiveKey khi section hiển thị
  useEffect(() => {
    const observerOptions: IntersectionObserverInit = {
      root: null,
      // rootMargin cho vùng active (tùy chỉnh để phù hợp UX)
      // ví dụ: phần tử xuất hiện trong vùng 20% từ top -> active
      rootMargin: "-20% 0px -60% 0px",
      threshold: 0,
    };

    const observer = new IntersectionObserver((entries) => {
      const visible = entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

      if (visible.length > 0) {
        const id = visible[0].target.getAttribute(
          "data-section"
        ) as SectionKey | null;
        if (id) setActiveKey(id);
      }
    }, observerOptions);

    // observe only elements that exist
    Object.values(sectionRefs).forEach((r) => {
      if (r.current) observer.observe(r.current);
    });

    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // chỉ chạy 1 lần

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
      {/* Sidebar - sticky */}
      <aside>
        <div
          className="bg-white rounded-md shadow-sm p-3 w-[250px]"
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
                icon: <UserOutlined />,
                label: "Thông tin cơ sở",
              },
              {
                key: "basic",
                icon: <SettingOutlined />,
                label: "Chỉnh sửa thông tin",
              },
              {
                key: "password",
                icon: <LockOutlined />,
                label: "Lịch khám",
              },
              {
                key: "listDoctor",
                icon: <KeyOutlined />,
                label: "Danh sách bác sĩ",
              },
              {
                key: "notifications",
                icon: <BellOutlined />,
                label: "Chuyên khoa",
              },
            ]}
          />
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1">
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

          <InfoBasic ref={basicRef} />
          <ListDoctor ref={listDoctorRef} />
        </div>
      </main>
    </div>
  );
};

export default LazyMedicalFacilityDetail;
