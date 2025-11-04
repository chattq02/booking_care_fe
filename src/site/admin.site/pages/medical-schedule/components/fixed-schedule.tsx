import React from "react";
import { Tag } from "antd";

const FixedSchedule: React.FC = () => {
  const days = [
    "Thứ 2",
    "Thứ 3",
    "Thứ 4",
    "Thứ 5",
    "Thứ 6",
    "Thứ 7",
    "Chủ nhật",
  ];

  const events = [
    { day: "Thứ 2", title: "Lịch khám", time: "09:00 - 10:00" },
    { day: "Thứ 2", title: "Lịch khám", time: "10:30 - 10:40" },
  ];

  return (
    <div className="p-4">
      <div className="grid grid-cols-7 border rounded overflow-hidden">
        {days.map((day) => (
          <div key={day} className="border p-2 min-h-[500px] bg-gray-50">
            <div className="font-semibold text-center mb-2">{day}</div>
            {events
              .filter((e) => e.day === day)
              .map((event, index) => (
                <div
                  key={index}
                  className="bg-blue-100 border-l-4 border-blue-500 rounded p-2 mb-2 text-sm shadow-sm"
                >
                  <div className="font-semibold text-blue-700">
                    {event.title}
                  </div>
                  <div>{event.time}</div>
                </div>
              ))}
          </div>
        ))}
      </div>

      <div className="flex gap-4 mt-4">
        <div className="flex items-center gap-2">
          <Tag color="blue" />
          Lịch khám
        </div>
        <div className="flex items-center gap-2">
          <Tag color="green" />
          Lịch tư vấn trực tuyến
        </div>
      </div>
    </div>
  );
};

export default FixedSchedule;
