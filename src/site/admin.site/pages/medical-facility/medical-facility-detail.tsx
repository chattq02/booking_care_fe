import React, { useEffect, useState } from "react";
import { Menu, Switch, Avatar } from "antd";
import { useInView } from "react-intersection-observer";

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
import { useParams } from "react-router-dom";

type SectionKey =
  | "profile"
  | "scheduleFacility"
  | "listDoctor"
  | "specialtyFacility";

const LazyMedicalFacilityDetail: React.FC = () => {
  const { id } = useParams();
  // Sử dụng useInView cho mỗi tiêu đề section
  const [profileTitleRef, profileInView] = useInView({
    threshold: 0.1,
    rootMargin: "-50px 0px 0px 0px",
  });

  const [scheduleFacilityTitleRef, scheduleFacilityInView] = useInView({
    threshold: 0.1,
    rootMargin: "-90px 0px 0px 0px",
  });

  const [listDoctorTitleRef, listDoctorInView] = useInView({
    threshold: 0.1,
    rootMargin: "-90px 0px 0px 0px",
  });

  const [specialtyFacilityTitleRef, specialtyFacilityInView] = useInView({
    threshold: 0.1,
    rootMargin: "-90px 0px 0px 0px",
  });

  // Thêm các ref object để lưu trữ element thực tế
  const profileElementRef = React.useRef<HTMLElement | null>(null);
  const scheduleFacilityElementRef = React.useRef<HTMLElement>(null);
  const listDoctorElementRef = React.useRef<HTMLElement>(null);
  const specialtyFacilityElementRef = React.useRef<HTMLElement>(null);

  // Callback ref kết hợp - vừa cho useInView vừa lưu element
  const createCombinedRef = (
    inViewRef: (node?: Element | null) => void,
    elementRef: React.RefObject<HTMLElement>
  ) => {
    return (node: HTMLElement | null) => {
      inViewRef(node);
      if (node) {
        elementRef.current = node;
      }
    };
  };

  const combinedProfileRef = createCombinedRef(
    profileTitleRef,
    profileElementRef as React.RefObject<HTMLElement>
  );
  const combinedScheduleFacilityRef = createCombinedRef(
    scheduleFacilityTitleRef,
    scheduleFacilityElementRef as React.RefObject<HTMLElement>
  );
  const combinedListDoctorRef = createCombinedRef(
    listDoctorTitleRef,
    listDoctorElementRef as React.RefObject<HTMLElement>
  );
  const combinedSpecialtyFacilityRef = createCombinedRef(
    specialtyFacilityTitleRef,
    specialtyFacilityElementRef as React.RefObject<HTMLElement>
  );

  // state active menu
  const [activeKey, setActiveKey] = useState<SectionKey>("profile");

  // Theo dõi section nào đang trong view
  useEffect(() => {
    const sections = [
      { key: "profile" as SectionKey, inView: profileInView },
      { key: "listDoctor" as SectionKey, inView: listDoctorInView },
      {
        key: "specialtyFacility" as SectionKey,
        inView: specialtyFacilityInView,
      },
      { key: "scheduleFacility" as SectionKey, inView: scheduleFacilityInView },
    ];

    // Tìm section đầu tiên đang trong view
    const firstInView = sections.find((section) => section.inView);
    if (firstInView) {
      setActiveKey(firstInView.key);
    }
  }, [
    profileInView,
    listDoctorInView,
    specialtyFacilityInView,
    scheduleFacilityInView,
  ]);

  // Hàm cuộn có offset
  const scrollToSection = (element: HTMLElement, offset = 90) => {
    const y = element.getBoundingClientRect().top + window.pageYOffset - offset;
    window.scrollTo({ top: y, behavior: "smooth" });
  };

  const onMenuClick = ({ key }: { key: string }) => {
    const sectionKey = key as SectionKey;

    // Tìm element tương ứng và scroll đến
    let targetElement: HTMLElement | null = null;

    switch (sectionKey) {
      case "profile":
        targetElement = profileElementRef.current;
        break;
      case "listDoctor":
        targetElement = listDoctorElementRef.current;
        break;
      case "specialtyFacility":
        targetElement = specialtyFacilityElementRef.current;
        break;
      case "scheduleFacility":
        targetElement = scheduleFacilityElementRef.current;
        break;
    }

    if (targetElement) {
      scrollToSection(targetElement, 100);
    }

    // Cập nhật active key ngay lập tức
    setActiveKey(sectionKey);
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
            data-section="profile"
            ref={combinedProfileRef}
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

          <InfoBasic />

          <ListDoctor ref={combinedListDoctorRef} facilityId={Number(id)} />

          <SpecialtyFacility
            ref={combinedSpecialtyFacilityRef}
            facilityId={Number(id)}
          />

          <ScheduleFacility ref={combinedScheduleFacilityRef} />
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
