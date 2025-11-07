import { Tabs, Button } from "antd";
import HolidaySchedule from "./components/holiday-schedule";
import FixedSchedule from "./components/fixed-schedule";
import type { TabsProps } from "antd";
import { PlusOutlined } from "@ant-design/icons";

const ScheduleCalendar: React.FC = () => {
  const onChange = (key: string) => {
    console.log(key);
  };

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "Lịch cố định",
      children: <FixedSchedule />,
    },
    {
      key: "2",
      label: "Lịch nghỉ",
      children: <HolidaySchedule />,
    },
  ];

  return (
    <div
      className="bg-white rounded-md"
      style={{ margin: "15px 20px", padding: "5px 20px" }}
    >
      <Tabs
        defaultActiveKey="1"
        items={items}
        onChange={onChange}
        tabBarExtraContent={{
          right: (
            <Button type="primary" icon={<PlusOutlined />}>
              Thêm mới
            </Button>
          ),
        }}
      />
    </div>
  );
};

export default ScheduleCalendar;
