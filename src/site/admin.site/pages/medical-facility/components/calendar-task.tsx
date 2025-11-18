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
import scheduleAdmin from "@/site/admin.site/apis/schedule";
import { toast } from "sonner";

dayjs.locale("vi");

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

// Component chính
export default function CalendarTask({
  currentDate,
  keyWord,
  departmentId,
}: IProps) {
  const doctorScheduleRef = useRef<DoctorScheduleRef>(null);
  const { id } = useParams();
  const {
    data: listUser,
    isLoading,
    refetch,
  } = useGetUsersDepartment(
    departmentId,
    {
      keyword: keyWord,
      page: 1,
      per_page: 150,
      facilityId: Number(id),
    },
    departmentId !== undefined
  );

  // Hàm lấy tasks cho một ngày cụ thể của user
  const getTasksForDay = (user: IResponseGetUsersDepartment, date: Dayjs) => {
    const dateString = date.format("YYYY-MM-DD");
    const userSchedules: any[] = [];
    // Duyệt qua tất cả schedule configs
    user.schedules.forEach((schedule) => {
      schedule.slots.forEach((config) => {
        // Tìm daySchedule phù hợp với ngày
        const daySchedule = config.daySchedules.find(
          (day) => day.date === dateString
        );

        if (daySchedule) {
          // Lọc các slot đã được chọn (selected: true)
          const selectedSlots = daySchedule.slots.filter(
            (slot) => slot.selected
          );

          // Chuyển đổi sang định dạng task
          selectedSlots.forEach((slot) => {
            userSchedules.push({
              id: `${config.id}-${slot.startTime}`,
              title: config.configName,
              description: `${slot.startTime} - ${
                slot.endTime
              }\n${config.price.toLocaleString()} VND`,
              config: config,
              slot: slot,
              date: dateString,
              user: user,
            });
          });
        }
      });
    });

    return userSchedules;
  };

  // Hàm xử lý khi click vào task
  const handleTaskClick = async (day: Dayjs, doctorId: number) => {
    try {
      const result = await scheduleAdmin.getScheduleByDay({
        doctorId: doctorId,
        facilityId: Number(id),
        departmentId: departmentId || 0,
        date: day.format("YYYY-MM-DD"),
      });

      if (result && result.data) {
        doctorScheduleRef.current?.showModal(result.data, "update");
      }
    } catch (error) {
      toast.error("Lỗi khi lấy lịch hẹn bác sĩ");
    }
  };

  const TaskCard = ({ taskCount }: { taskCount: number }) => (
    <div className=" bg-linear-to-br from-white to-blue-50 rounded-lg p-4 border border-blue-100 hover:shadow-md transition-all duration-200 cursor-pointer">
      <div className="text-sm font-semibold text-gray-700 mb-1 text-center">
        Tổng số ca khám
      </div>
      <div className="text-2xl font-bold text-blue-700 text-center">
        {taskCount}
      </div>
    </div>
  );

  const handleClickUser = (user: IResponseGetUsersDepartment) => {
    doctorScheduleRef.current?.showModal(user, "create");
  };

  const handleAddSchedule = (
    user: IResponseGetUsersDepartment,
    date: Dayjs
  ) => {
    doctorScheduleRef.current?.showModal(user, "create");
  };

  // Get the start of the week (Thứ 2)
  const getWeekStart = (date: Dayjs) => {
    const day = date.day();
    const diff = day === 0 ? 6 : day - 1;
    return date.subtract(diff, "day");
  };

  const weekStart = getWeekStart(currentDate);
  const weekDays = Array.from({ length: 7 }, (_, i) => weekStart.add(i, "day"));

  const isToday = (date: Dayjs) => {
    return date.format("YYYY-MM-DD") === dayjs().format("YYYY-MM-DD");
  };

  return (
    <div className="bg-white rounded-md mt-4 border border-gray-200 max-h-[calc(100vh-290px)] overflow-y-auto">
      {/* Fixed Days Header */}
      <div className="grid grid-cols-8 border-b border-gray-200 bg-white sticky top-0 z-6">
        <div className="p-4 bg-gray-50 border-r border-gray-200"></div>
        {weekDays.map((day, idx) => (
          <div
            key={idx}
            style={{
              backgroundColor: dayColors[idx].backgroundColor,
            }}
            className="p-4 text-center border-r border-gray-300 last:border-0 bg-blue-100 relative"
          >
            <div
              className="text-xs font-semibold uppercase tracking-wide"
              style={{
                color: dayColors[idx].color,
              }}
            >
              {dayNames[idx]}
            </div>
            <div
              className={`text-xl font-bold mt-1 ${
                isToday(day) ? "text-red-500" : "text-gray-900"
              }`}
            >
              {day.format("DD")}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {day.format("MM/YYYY")}
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
              listUser.data.map((user) => (
                <div
                  key={user.id}
                  className="grid grid-cols-8 border-b border-gray-200 last:border-b-0 min-h-[120px]"
                >
                  {/* User Info - Fixed on left */}
                  <div
                    className="p-4 bg-gray-50 border-r border-gray-200 flex flex-col items-center justify-center pt-6 sticky left-0 z-5 cursor-pointer"
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
                  {weekDays.map((day, dayIdx) => {
                    const dayTasks = getTasksForDay(user, day);
                    const today = isToday(day);

                    return (
                      <div
                        key={dayIdx}
                        className={`p-2 border-r border-gray-200 flex items-center justify-center ${
                          today ? "bg-amber-50" : "bg-white"
                        }`}
                      >
                        {dayTasks.length > 0 ? (
                          <div onClick={() => handleTaskClick(day, user.id)}>
                            <TaskCard taskCount={dayTasks.length} />
                          </div>
                        ) : (
                          <div
                            className="flex justify-center items-center h-full cursor-pointer"
                            onClick={() => handleAddSchedule(user, day)}
                          >
                            <Tooltip placement="top" title={"Thêm lịch"}>
                              <CirclePlus color="#1890FF" size={20} />
                            </Tooltip>
                          </div>
                        )}
                      </div>
                    );
                  })}
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
        refetch={refetch}
        departmentId={Number(departmentId)}
        facilityId={Number(id)}
      />
    </div>
  );
}
