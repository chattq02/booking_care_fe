import { Flex, Tabs } from "antd";
import InfoBasic from "./components/info-basic";
import ListDoctor from "./components/list-doctor";
import ScheduleFacility from "./components/schedule-facility";
import SpecialtyFacility from "./components/specialty-facility";
import { useParams, useSearchParams } from "react-router-dom";
import {
  Award,
  BadgeInfo,
  CalendarDays,
  CalendarPlus2,
  Pill,
  Users,
} from "lucide-react";
import TaskSchedule from "./components/task-schedule";
import Medicine from "./components/medicine/medicine";

const LazyMedicalFacilityDetail: React.FC = () => {
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  const hasId = Boolean(id);

  const validTabs = [
    "profile",
    "scheduleFacility",
    "listDoctor",
    "specialtyFacility",
    "medicalSchedule",
    "medicine",
  ];

  const tabFromUrl = searchParams.get("tab");
  const activeTab =
    hasId && validTabs.includes(tabFromUrl || "") ? tabFromUrl! : "profile";

  const handleTabChange = (key: string) => {
    setSearchParams({ tab: key });
  };

  // Danh sách tabs hiển thị
  const items = [
    {
      key: "profile",
      label: (
        <Flex align="center" gap={10}>
          <BadgeInfo size={18} />
          Thông tin
        </Flex>
      ),
      children: <InfoBasic facilityId={Number(id)} />,
    },
    {
      key: "scheduleFacility",
      label: (
        <Flex align="center" gap={10}>
          <CalendarDays size={18} /> Lịch làm việc
        </Flex>
      ),
      children: <ScheduleFacility facilityId={Number(id)} />,
    },
    {
      key: "medicalSchedule",
      label: (
        <Flex align="center" gap={10}>
          <CalendarPlus2 size={18} /> Lịch khám
        </Flex>
      ),
      children: <TaskSchedule />,
    },
    {
      key: "listDoctor",
      label: (
        <Flex align="center" gap={10}>
          <Users size={18} /> Danh sách bác sĩ
        </Flex>
      ),
      children: <ListDoctor facilityId={Number(id)} />,
    },
    {
      key: "specialtyFacility",
      label: (
        <Flex align="center" gap={10}>
          <Award size={18} /> Chuyên khoa
        </Flex>
      ),
      children: <SpecialtyFacility facilityId={Number(id)} />,
    },
    {
      key: "medicine",
      label: (
        <Flex align="center" gap={10}>
          <Pill size={18} /> Kho thuốc
        </Flex>
      ),
      children: <Medicine facilityId={Number(id)} />,
    },
  ];

  // Nếu không có id -> chỉ giữ lại tab profile
  const filteredItems = hasId
    ? items
    : items.filter((t) => t.key === "profile");

  return (
    <div className="w-full px-5 mb-4">
      <Tabs
        activeKey={activeTab}
        onChange={handleTabChange}
        className="[&_.ant-tabs-nav]:sticky! [&_.ant-tabs-nav]:rounded-b-md [&_.ant-tabs-nav]:top-16! [&_.ant-tabs-nav]:bg-white! [&_.ant-tabs-nav]:z-50! [&_.ant-tabs-nav]:px-5"
        items={filteredItems}
      />
    </div>
  );
};

export default LazyMedicalFacilityDetail;
