import React, { useState } from "react";
import { Select, Button, Avatar, Flex, Empty, Input } from "antd";
import { ChevronLeft, ChevronRight } from "lucide-react";
import dayjs, { Dayjs } from "dayjs";
import SearchBox from "../../info-doctor/components/search-box";

dayjs.locale("vi");

interface Task {
  id: string;
  title: string;
  description: string;
  day: number; // 0-6 (Thứ 2-Chủ Nhật)
  user: User;
}

interface User {
  id: string;
  name: string;
  avatar: string;
}

interface DayColor {
  color: string;
  backgroundColor: string;
}

const mockUsers: User[] = [
  {
    id: "1",
    name: "Yess Kligg",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Yess",
  },
  {
    id: "2",
    name: "Adam",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Adam",
  },
  {
    id: "3",
    name: "Jonathan",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jonathan",
  },
  {
    id: "3",
    name: "Jonathan",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jonathan",
  },
  {
    id: "3",
    name: "Jonathan",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jonathan",
  },
  {
    id: "3",
    name: "Jonathan",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jonathan",
  },
];

const mockTasks: Task[] = [
  {
    id: "1",
    title: "Điều hòa không khí",
    description: "Bảo dưỡng định kỳ\n+ 16 công việc",
    day: 0, // Thứ 2
    user: mockUsers[0],
  },
  {
    id: "2",
    title: "Điều hòa không khí",
    description: "Bảo dưỡng định kỳ\n+ 16 công việc",
    day: 1, // Thứ 3
    user: mockUsers[0],
  },
  {
    id: "3",
    title: "Điều hòa không khí",
    description: "Bảo dưỡng định kỳ\n+ 16 công việc",
    day: 3, // Thứ 5
    user: mockUsers[0],
  },
  {
    id: "4",
    title: "Điều hòa không khí",
    description: "Bảo dưỡng định kỳ\n+ 16 công việc",
    day: 5, // Thứ 7
    user: mockUsers[0],
  },
  {
    id: "5",
    title: "Hệ thống điện",
    description: "Kiểm tra tổng thể\n+ 8 công việc",
    day: 2, // Thứ 4
    user: mockUsers[1],
  },
  {
    id: "6",
    title: "Hệ thống điện",
    description: "Kiểm tra tổng thể\n+ 8 công việc",
    day: 4, // Thứ 6
    user: mockUsers[1],
  },
  {
    id: "7",
    title: "Hệ thống điện",
    description: "Kiểm tra tổng thể\n+ 8 công việc",
    day: 6, // Chủ Nhật
    user: mockUsers[1],
  },
  {
    id: "8",
    title: "Hệ thống nước",
    description: "Bảo trì đường ống\n+ 12 công việc",
    day: 1, // Thứ 3
    user: mockUsers[2],
  },
  {
    id: "9",
    title: "Hệ thống nước",
    description: "Bảo trì đường ống\n+ 12 công việc",
    day: 3, // Thứ 5
    user: mockUsers[2],
  },
  {
    id: "10",
    title: "Hệ thống nước",
    description: "Bảo trì đường ống\n+ 12 công việc",
    day: 5, // Thứ 7
    user: mockUsers[2],
  },
];

const dayNames = [
  "THỨ HAI",
  "THỨ BA",
  "THỨ TƯ",
  "THỨ NĂM",
  "THỨ SÁU",
  "THỨ BẢY",
  "CHỦ NHẬT",
];

const dayColors: Record<number, DayColor> = {
  0: { color: "#1890FF", backgroundColor: "#dbeafe" }, // Thứ 2
  1: { color: "#1890FF", backgroundColor: "#dbeafe" }, // Thứ 3
  2: { color: "#1890FF", backgroundColor: "#dbeafe" }, // Thứ 4
  3: { color: "#1890FF", backgroundColor: "#dbeafe" }, // Thứ 5
  4: { color: "#1890FF", backgroundColor: "#dbeafe" }, // Thứ 6
  5: { color: "#1890FF", backgroundColor: "#dbeafe" }, // Thứ 7
  6: { color: "red", backgroundColor: "#fef2f2" }, // Chủ Nhật
};

export default function TaskSchedule() {
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [selectedOperation, setSelectedOperation] = useState(
    "12 hoạt động được chọn"
  );
  const [selectedHotel, setSelectedHotel] = useState("Chọn khách sạn");

  // Get the start of the week (Thứ 2)
  const getWeekStart = (date: Dayjs) => {
    const day = date.day();
    const diff = day === 0 ? 6 : day - 1;
    return date.subtract(diff, "day");
  };

  const weekStart = getWeekStart(currentDate);
  const weekDays = Array.from({ length: 7 }, (_, i) => weekStart.add(i, "day"));

  const handlePrevWeek = () => {
    setCurrentDate(currentDate.subtract(1, "week"));
  };

  const handleNextWeek = () => {
    setCurrentDate(currentDate.add(1, "week"));
  };

  const handleToday = () => {
    setCurrentDate(dayjs());
  };

  // Kiểm tra xem ngày có phải là hôm nay không
  const isToday = (date: Dayjs) => {
    return date.format("YYYY-MM-DD") === dayjs().format("YYYY-MM-DD");
  };

  const getTasksForDay = (dayIndex: number) => {
    return mockTasks.filter((task) => task.day === dayIndex);
  };

  const TaskCard = ({ task }: { task: Task }) => (
    <div className="bg-white rounded-md p-3 border border-gray-200 hover:shadow-sm transition-shadow cursor-pointer">
      <div className="text-sm font-semibold text-gray-800">{task.title}</div>
      <div className="text-xs text-gray-600 mt-1 whitespace-pre-line leading-tight">
        {task.description}
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-md p-5.5">
      <Flex gap={10} align="center" className="mb-5!" justify="space-between">
        <Flex gap={10} align="center">
          <div className="h-6 w-[5px] bg-[#9afaeb] rounded" />
          <h3 className="text-xl font-semibold" data-section="listDoctor">
            Lịch hẹn khám bệnh
          </h3>
        </Flex>
        <Button type="primary">Cấu hình lịch khám</Button>
      </Flex>
      <div className="max-w-full mx-auto">
        {/* Header Controls */}
        <div className="bg-white">
          <Flex justify="space-between">
            <Flex align="center" gap={15}>
              <SearchBox value="AA" onSearch={() => {}} />
              <Select
                // value={selectedHotel}
                onChange={setSelectedHotel}
                style={{ width: 160 }}
                placeholder="Chọn phòng ban"
                options={[
                  { label: "Chọn khách sạn", value: "Chọn khách sạn" },
                  { label: "Khách sạn A", value: "Khách sạn A" },
                  { label: "Khách sạn B", value: "Khách sạn B" },
                ]}
              />
            </Flex>
            <Flex
              align="center"
              gap={15}
              className="text-gray-700 font-bold text-[16px]"
            >
              <Button type="default" onClick={handleToday}>
                Hôm nay
              </Button>
              <Button
                onClick={handlePrevWeek}
                icon={<ChevronLeft size={14} />}
              ></Button>
              {weekStart.format("DD/MM/YYYY")} -{" "}
              {weekStart.add(6, "day").format("DD/MM/YYYY")}
              <Button
                onClick={handleNextWeek}
                icon={<ChevronRight size={14} />}
              ></Button>
            </Flex>
          </Flex>
        </div>

        {/* Calendar Grid Container */}
        <div className="bg-white rounded-md mt-4 overflow-hidden border border-gray-200 max-h-[calc(100vh-290px)] overflow-y-scroll">
          {/* Fixed Days Header */}
          <div className="grid grid-cols-8 border-b border-gray-200 bg-white sticky top-0 z-6">
            <div className="p-4 bg-gray-50 border-r border-gray-200 "></div>
            {weekDays.map((day, idx) => (
              <div
                key={idx}
                style={{
                  backgroundColor: dayColors[idx].backgroundColor,
                }}
                className="p-4 text-center border-r border-gray-300 bg-blue-100 relative"
              >
                <div
                  className="text-xs font-semibold uppercase tracking-wide "
                  style={{
                    color: dayColors[idx].color,
                  }}
                >
                  {dayNames[idx]}
                </div>
                <div
                  className={`text-xl font-bold mt-1 ${
                    isToday(day) ? "text-red-500 " : "text-gray-900"
                  }`}
                >
                  {day.format("DD")}
                </div>
              </div>
            ))}
          </div>

          {/* Scrollable Users and Tasks */}
          <div>
            {mockUsers && mockUsers?.length > 0 ? (
              mockUsers.map((user) => (
                <div
                  key={user.id}
                  className="grid grid-cols-8 border-b border-gray-200 last:border-b-0"
                >
                  {/* User Info - Fixed on left */}
                  <div className="p-4 bg-gray-50 border-r border-gray-200 flex flex-col items-center justify-start pt-6 sticky left-0 z-5">
                    <Avatar size={48} src={user.avatar} />
                    <div className="text-xs font-medium text-gray-700 mt-3 text-center">
                      {user.name}
                    </div>
                  </div>

                  {/* Tasks for each day */}
                  {Array.from({ length: 7 }).map((_, dayIdx) => {
                    const dayTasks = mockTasks.filter(
                      (task) => task.day === dayIdx && task.user.id === user.id
                    );

                    const isToday = weekDays[dayIdx].isSame(dayjs(), "day");
                    return (
                      <div
                        key={dayIdx}
                        className={`p-3 border-r border-gray-200 ${
                          isToday ? "bg-amber-50" : "bg-white"
                        } `}
                      >
                        {dayTasks.map((task) => (
                          <TaskCard key={task.id} task={task} />
                        ))}
                      </div>
                    );
                  })}
                </div>
              ))
            ) : (
              <Empty className="py-6" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
