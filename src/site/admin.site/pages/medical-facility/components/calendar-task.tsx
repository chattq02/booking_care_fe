import { useRef } from "react";
import { Empty, Spin, Tooltip } from "antd";
import dayjs, { Dayjs } from "dayjs";
import { useGetUsersDepartment } from "../../specialty/hooks/use-specialty";
import { useParams } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getFirstLetter } from "@/helpers/helper";
import {
  DoctorScheduleModal,
  type DoctorScheduleRef,
} from "./modal/modal-schedule-doctor";
import type { IResponseGetUsersDepartment } from "../../specialty/type";
import { CirclePlus } from "lucide-react";

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

interface IProps {
  currentDate: Dayjs;
  keyWord: string;
  departmentId?: number;
}

export default function CalendarTask({
  currentDate,
  keyWord,
  departmentId,
}: IProps) {
  const doctorScheduleRef = useRef<DoctorScheduleRef>(null);
  const { id } = useParams();
  const { data: listUser, isLoading } = useGetUsersDepartment(
    departmentId,
    {
      keyword: keyWord,
      page: 1,
      per_page: 150,
      facilityId: Number(id),
    },
    departmentId !== undefined
  );

  console.log("listUser", listUser);
  // Get the start of the week (Thứ 2)
  const getWeekStart = (date: Dayjs) => {
    const day = date.day();
    const diff = day === 0 ? 6 : day - 1;
    return date.subtract(diff, "day");
  };

  const weekStart = getWeekStart(currentDate);
  const weekDays = Array.from({ length: 7 }, (_, i) => weekStart.add(i, "day"));
  // Kiểm tra xem ngày có phải là hôm nay không
  const isToday = (date: Dayjs) => {
    return date.format("YYYY-MM-DD") === dayjs().format("YYYY-MM-DD");
  };
  const getTasksForDay = (task: Task) => {
    // doctorScheduleRef.current?.showModal();
    console.log("task", task);
    // return mockTasks.filter((task) => task.day === dayIndex);
  };

  const TaskCard = ({ task }: { task: Task }) => (
    <div
      className="bg-white rounded-md p-3 border border-gray-200 hover:shadow-sm transition-shadow cursor-pointer"
      onClick={() => getTasksForDay(task)}
    >
      <div className="text-sm font-semibold text-gray-800">{task.title}</div>
      <div className="text-xs text-gray-600 mt-1 whitespace-pre-line leading-tight">
        {task.description}
      </div>
    </div>
  );

  const handleClickUser = (user: IResponseGetUsersDepartment) => {
    doctorScheduleRef.current?.showModal(user, "create");
  };

  return (
    <div className="bg-white rounded-md mt-4 border border-gray-200 max-h-[calc(100vh-290px)] overflow-y-auto">
      {/* Fixed Days Header */}
      <div className="grid grid-cols-8 border-b border-gray-200 bg-white sticky top-0 z-6">
        <div className="p-4 bg-gray-50 border-r border-gray-200 "></div>
        {weekDays.map((day, idx) => (
          <div
            key={idx}
            style={{
              backgroundColor: dayColors[idx].backgroundColor,
            }}
            className="p-4 text-center border-r border-gray-300 last:border-0 bg-blue-100 relative"
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
        {isLoading ? (
          <Spin spinning />
        ) : (
          <>
            {listUser?.data && listUser?.data?.length > 0 ? (
              listUser?.data.map((user) => (
                <div
                  key={user.id}
                  className="grid grid-cols-8 border-b border-gray-200 last:border-b-0"
                >
                  {/* User Info - Fixed on left */}
                  <div
                    className="p-4 bg-gray-50 border-r border-gray-200 flex flex-col items-center justify-start pt-6 sticky left-0 z-5"
                    onClick={() => handleClickUser(user)}
                  >
                    <Avatar
                      style={{
                        height: 65,
                        width: 65,
                      }}
                      className="border"
                    >
                      <AvatarImage
                        src={user?.avatar ?? ""}
                        alt={user?.fullName}
                      />
                      <AvatarFallback color="#DBEAFE">
                        {getFirstLetter(user?.fullName ?? "")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="text-[14px] font-bold text-gray-700 mt-3 text-center">
                      {user.fullName}
                    </div>
                  </div>

                  {/* Tasks for each day */}
                  {/* {Array.from({ length: 7 }).map((_, dayIdx) => {
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
                        {dayTasks.length > 0 ? (
                          dayTasks.map((task) => (
                            <TaskCard key={task.id} task={task} />
                          ))
                        ) : (
                          <div className="flex justify-end items-end h-full cursor-pointer">
                            <Tooltip placement="top" title={"Thêm lịch"}>
                              <CirclePlus color="#1890FF" />
                            </Tooltip>
                          </div>
                        )}
                      </div>
                    );
                  })} */}
                </div>
              ))
            ) : (
              <Empty className="py-6" />
            )}
          </>
        )}
      </div>
      <DoctorScheduleModal
        ref={doctorScheduleRef}
        departmentId={Number(departmentId)}
        facilityId={Number(id)}
      />
    </div>
  );
}
