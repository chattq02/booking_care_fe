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
  Tickets,
  Users,
} from "lucide-react";
import TaskSchedule from "./components/task-schedule";

const LazyMedicalFacilityDetail: React.FC = () => {
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  // Danh sách tab hợp lệ
  const validTabs = [
    "profile",
    "scheduleFacility",
    "listDoctor",
    "specialtyFacility",
    "package",
    "medicalSchedule",
  ];

  // Lấy tab từ URL và validate
  const tabFromUrl = searchParams.get("tab");
  const activeTab = validTabs.includes(tabFromUrl || "")
    ? tabFromUrl!
    : "profile";

  const handleTabChange = (key: string) => {
    setSearchParams({ tab: key });
  };

  return (
    <div className="w-full px-5 mb-4">
      <Tabs
        activeKey={activeTab}
        onChange={handleTabChange}
        className="[&_.ant-tabs-nav]:sticky! [&_.ant-tabs-nav]:rounded-b-md [&_.ant-tabs-nav]:top-16! [&_.ant-tabs-nav]:bg-white! [&_.ant-tabs-nav]:z-50! [&_.ant-tabs-nav]:px-5"
        items={[
          {
            key: "profile",
            label: (
              <Flex align="center" gap={10}>
                <div>
                  <BadgeInfo size={18} />
                </div>
                Thông tin
              </Flex>
            ),
            children: <InfoBasic />,
          },
          {
            key: "scheduleFacility",
            label: (
              <Flex align="center" gap={10}>
                <div>
                  <CalendarDays size={18} />
                </div>
                Lịch làm việc
              </Flex>
            ),
            children: <ScheduleFacility facilityId={Number(id)} />,
          },
          {
            key: "medicalSchedule",
            label: (
              <Flex align="center" gap={10}>
                <div>
                  <CalendarPlus2 size={18} />
                </div>
                Lịch khám
              </Flex>
            ),
            children: <TaskSchedule />,
          },
          {
            key: "listDoctor",
            label: (
              <Flex align="center" gap={10}>
                <div>
                  <Users size={18} />
                </div>
                Danh sách bác sĩ
              </Flex>
            ),
            children: <ListDoctor facilityId={Number(id)} />,
          },
          {
            key: "specialtyFacility",
            label: (
              <Flex align="center" gap={10}>
                <div>
                  <Award size={18} />
                </div>
                Chuyên khoa
              </Flex>
            ),
            children: <SpecialtyFacility facilityId={Number(id)} />,
          },
          {
            key: "package",
            label: (
              <Flex align="center" gap={10}>
                <div>
                  <Tickets size={18} />
                </div>
                Gói khám
              </Flex>
            ),
            children: <SpecialtyFacility facilityId={Number(id)} />,
          },
        ]}
      />
    </div>
  );
};

export default LazyMedicalFacilityDetail;
