import { Tabs } from "antd";
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
    <div className="w-full  px-5 mb-4">
      <Tabs
        defaultActiveKey="1"
        className="[&_.ant-tabs-nav]:sticky! [&_.ant-tabs-nav]:rounded-b-md [&_.ant-tabs-nav]:top-16! [&_.ant-tabs-nav]:bg-white! [&_.ant-tabs-nav]:z-50! [&_.ant-tabs-nav]:px-5"
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
  );
};

export default LazyMedicalFacilityDetail;
