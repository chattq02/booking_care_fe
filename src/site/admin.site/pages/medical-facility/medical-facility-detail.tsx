import { Switch, Avatar, Tabs } from "antd";

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

const LazyMedicalFacilityDetail: React.FC = () => {
  const { id } = useParams();

  return (
    <div
      className="w-full flex flex-col"
      style={{ padding: "5px 20px", marginBottom: "15px" }}
    >
      {/* Sticky container: header + tabs */}
      <div className="sticky top-0 z-20 bg-white">
        {/* Header */}
        <div className="rounded-md p-4 flex items-center justify-between border-b border-gray-200">
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

        {/* Tabs */}
        <Tabs
          defaultActiveKey="1"
          items={[
            {
              key: "profile",
              icon: <SettingOutlined />,
              label: "Thông tin",
              children: <InfoBasic />,
            },
            {
              key: "scheduleFacility",
              icon: <LockOutlined />,
              label: "Lịch làm việc",
              children: <ScheduleFacility facilityId={Number(id)} />,
            },
            {
              key: "listDoctor",
              icon: <KeyOutlined />,
              label: "Danh sách bác sĩ",
              children: <ListDoctor facilityId={Number(id)} />,
            },
            {
              key: "specialtyFacility",
              icon: <BellOutlined />,
              label: "Chuyên khoa",
              children: <SpecialtyFacility facilityId={Number(id)} />,
            },
          ]}
        />
      </div>

      {/* Nội dung dưới sticky tabs (nếu có thêm) */}
      <div className="mt-4">{/* Các nội dung khác của trang */}</div>
    </div>
  );
};

export default LazyMedicalFacilityDetail;
