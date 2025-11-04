import { Tabs, Button } from "antd";
import HolidaySchedule from "./components/holiday-schedule";
import FixedSchedule from "./components/fixed-schedule";

const ScheduleCalendar: React.FC = () => {
  return (
    <div className="p-4 bg-white rounded shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <Tabs
          defaultActiveKey="2"
          items={[
            { key: "1", label: "Lịch cố định" },
            { key: "2", label: "Lịch nghỉ" },
            { key: "3", label: "Lịch làm việc linh hoạt" },
          ]}
        />
        <Button type="primary">Thêm mới (F2)</Button>
      </div>
      <HolidaySchedule />
      <FixedSchedule />
    </div>
  );
};

export default ScheduleCalendar;
