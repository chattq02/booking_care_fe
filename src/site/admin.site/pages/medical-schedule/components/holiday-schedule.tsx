import React, { useState } from "react";
import { Calendar, Button, Tag, Select } from "antd";
import { LockOutlined } from "@ant-design/icons";
import dayjs, { Dayjs } from "dayjs";
import "dayjs/locale/vi";
import locale from "antd/es/calendar/locale/vi_VN";
import type { CalendarProps } from "antd";
dayjs.locale("vi");

interface Event {
  date: string;
  title: string;
  time: string;
  type: "lich_kham" | "lich_nghi" | "lich_tuvan";
}

const events: Event[] = [
  {
    date: "2025-11-03",
    title: "Lịch nghỉ",
    time: "10:30 - 10:40",
    type: "lich_nghi",
  },
  {
    date: "2025-11-04",
    title: "Lịch nghỉ",
    time: "06:00 - 18:00",
    type: "lich_nghi",
  },
];

// Custom locale với đầy đủ tên thứ
const customLocale: CalendarProps<Dayjs>["locale"] = {
  ...locale,
  lang: {
    ...locale.lang,
    shortWeekDays: [
      "Chủ nhật",
      "Thứ 2",
      "Thứ 3",
      "Thứ 4",
      "Thứ 5",
      "Thứ 6",
      "Thứ 7",
    ],
  },
};

const HolidaySchedule: React.FC = () => {
  const [month, setMonth] = useState(dayjs());

  const renderDateCell = (value: Dayjs) => {
    const dayEvents = events.filter(
      (e) => e.date === value.format("YYYY-MM-DD")
    );

    return (
      <div className="relative w-full h-full min-h-[120px] p-1 flex flex-col">
        {/* Nội dung sự kiện */}
        <div>
          {dayEvents.map((event, i) => (
            <div
              key={i}
              className={`rounded p-1 text-xs border-l-4 ${
                event.type === "lich_nghi"
                  ? "bg-red-50 border-red-500 text-red-600"
                  : event.type === "lich_kham"
                  ? "bg-blue-50 border-blue-500 text-blue-600"
                  : "bg-green-50 border-green-500 text-green-600"
              }`}
            >
              <div className="flex items-center justify-between font-medium">
                <span className="truncate">{event.title}</span>
                {event.type === "lich_nghi" && (
                  <LockOutlined className="text-[10px] shrink-0" />
                )}
              </div>
              <div className="truncate">{event.time}</div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Custom header với Tailwind CSS
  const customHeaderRender = () => (
    <div className="flex justify-between items-center p-4 bg-linear-to-r from-blue-50 to-blue-100 border-b-2 border-blue-300 rounded-t-lg">
      <div className="flex gap-2 items-center">
        <Button
          onClick={() => setMonth(month.subtract(1, "month"))}
          className="flex items-center justify-center w-8 h-8 bg-white border border-gray-300 hover:bg-gray-50 rounded"
        >
          ‹
        </Button>
        <Select
          value={month.month()}
          style={{ width: 120 }}
          onChange={(m) => setMonth(month.month(m))}
          options={Array.from({ length: 12 }, (_, i) => ({
            label: `Tháng ${i + 1}`,
            value: i,
          }))}
        />
        <Select
          value={month.year()}
          style={{ width: 100 }}
          onChange={(y) => setMonth(month.year(y))}
          options={Array.from({ length: 5 }, (_, i) => ({
            label: `${2025 - 2 + i}`,
            value: 2025 - 2 + i,
          }))}
        />
        <Button
          onClick={() => setMonth(month.add(1, "month"))}
          className="flex items-center justify-center w-8 h-8 bg-white border border-gray-300 hover:bg-gray-50 rounded"
        >
          ›
        </Button>
      </div>
      <div className="text-lg font-semibold text-blue-800">
        {month.format("MMMM YYYY")}
      </div>
    </div>
  );

  return (
    <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-200">
      {customHeaderRender()}

      {/* Calendar wrapper với Tailwind styles */}
      <div className="border border-gray-200 rounded-b-lg overflow-hidden">
        <Calendar
          value={month}
          onPanelChange={(v) => setMonth(v)}
          headerRender={() => null}
          cellRender={(current, info) => {
            if (info.type === "date") return renderDateCell(current);
            return info.originNode;
          }}
          fullscreen={false}
          locale={customLocale}
          className="
            [&_.ant-picker-calendar-header]:hidden
            [&_.ant-picker-content_th]:bg-blue-100 
            [&_.ant-picker-content_th]:border-b 
            [&_.ant-picker-content_th]:border-blue-300 
            [&_.ant-picker-content_th]:font-semibold 
            [&_.ant-picker-content_th]:text-blue-800 
            [&_.ant-picker-content_th]:text-center 
            [&_.ant-picker-content_th]:py-4
            [&_.ant-picker-content_th]:text-sm
            [&_.ant-picker-cell]:border 
            [&_.ant-picker-cell]:border-gray-100 
            [&_.ant-picker-cell-in-view]:bg-white
            [&_.ant-picker-cell:hover]:bg-gray-50
            [&_.ant-picker-cell-today_.ant-picker-cell-inner]:border 
            [&_.ant-picker-cell-today_.ant-picker-cell-inner]:border-blue-500
            [&_.ant-picker-cell-inner]:w-full
            [&_.ant-picker-cell-inner]:min-h-[120px]
            [&_.ant-picker-cell-inner]:h-auto
            [&_.ant-picker-cell-inner]:p-0
            [&_.ant-picker-cell-inner]:flex
            [&_.ant-picker-cell-inner]:flex-col
            [&_.ant-picker-content]:text-base
          "
        />
      </div>

      {/* Legend */}
      <div className="flex gap-6 mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-500 rounded"></div>
          <span className="text-sm font-medium text-gray-700">Lịch khám</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-500 rounded"></div>
          <span className="text-sm font-medium text-gray-700">
            Lịch tư vấn trực tuyến
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-500 rounded"></div>
          <span className="text-sm font-medium text-gray-700">Lịch nghỉ</span>
        </div>
      </div>
    </div>
  );
};

export default HolidaySchedule;
