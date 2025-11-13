import { Button, Flex, Spin } from "antd";
import { forwardRef, useRef } from "react";
import {
  HospitalScheduleModal,
  type HospitalScheduleRef,
} from "./modal/modal-schedule-facility";
import { useGetListSchedule } from "../hooks/use-schedule";
import type { ISlots } from "../type";

interface IProps {
  facilityId: number;
}

const ScheduleFacility = forwardRef<HTMLDivElement, IProps>(
  ({ facilityId }, ref) => {
    const hospitalScheduleModalRef = useRef<HospitalScheduleRef>(null);

    const { data: listSchedule, isLoading } = useGetListSchedule({
      Id: Number(facilityId),
      type: "FACILITY",
      keyword: "",
      page: 1,
      per_page: 50,
    });

    const slots: ISlots | undefined = listSchedule?.data[0]?.slots;

    const id_schedule = listSchedule?.data[0]?.id;

    const days = [
      { key: "monday", name: "Thứ 2", color: "green" },
      { key: "tuesday", name: "Thứ 3", color: "green" },
      { key: "wednesday", name: "Thứ 4", color: "green" },
      { key: "thursday", name: "Thứ 5", color: "green" },
      { key: "friday", name: "Thứ 6", color: "green" },
      { key: "saturday", name: "Thứ 7", color: "orange" },
      { key: "sunday", name: "Chủ nhật", color: "red" },
    ] as const;

    // Hàm lấy session name bằng tiếng Việt
    const getSessionName = (session: string) => {
      switch (session) {
        case "morning":
          return "sáng";
        case "afternoon":
          return "chiều";
        case "evening":
          return "tối";
        default:
          return session;
      }
    };

    const handleOpenSchedule = (
      slots: ISlots | undefined,
      type: "create" | "edit"
    ) => {
      hospitalScheduleModalRef.current?.showModal(slots, type);
    };

    if (isLoading) {
      return <Spin spinning />;
    }

    return (
      <>
        <div className="bg-white rounded-md px-5.5 py-4.5">
          <Flex
            gap={10}
            align="center"
            justify="space-between"
            className="mb-5!"
          >
            <Flex gap={10} align="center">
              <div className="h-6 w-[5px] bg-[#9afaeb] rounded" />
              <h3
                className="text-xl font-semibold"
                ref={ref}
                data-section="scheduleFacility"
              >
                Lịch làm việc
              </h3>
            </Flex>
            <Button
              type="primary"
              htmlType="submit"
              onClick={() => handleOpenSchedule(slots, "create")}
            >
              Điều chỉnh
            </Button>
          </Flex>

          <div className="grid grid-cols-7 rounded-md h-[300px]">
            {days.map((day, index) => {
              const daySlots = slots?.[day.key] || [];
              const isEmpty = daySlots.length === 0;
              const isLast = index === days.length - 1;

              return (
                <div
                  key={day.key}
                  className={`border-l border-b border-t border-[#c5c5c5cb] flex flex-col ${
                    isLast ? "border-r" : ""
                  } ${isEmpty ? "bg-red-200" : "bg-gray-50"} overflow-hidden`}
                >
                  <div className="border-b border-[#c5c5c5cb]">
                    <div
                      className={`font-semibold p-2 text-center  ${
                        day.key === "sunday"
                          ? "bg-red-50 text-red-600"
                          : day.key === "saturday"
                          ? "bg-orange-50 text-orange-600"
                          : "bg-blue-50 text-blue-600"
                      }`}
                    >
                      {day.name}
                    </div>
                  </div>

                  {daySlots.length === 0 ? (
                    <div
                      className="text-center py-5 font-bold hover:bg-[#f5faeb] cursor-pointer flex-1 overflow-auto"
                      onClick={() =>
                        handleOpenSchedule(
                          {
                            [day.key]: daySlots,
                          },
                          "edit"
                        )
                      }
                    >
                      Nghỉ
                    </div>
                  ) : (
                    <div
                      className="px-2.5 space-y-4 py-5 hover:bg-[#f5faeb] cursor-pointer flex-1 overflow-auto"
                      onClick={() =>
                        handleOpenSchedule(
                          {
                            [day.key]: daySlots,
                          },
                          "edit"
                        )
                      }
                    >
                      {daySlots.map((slot, index) => (
                        <div
                          key={index}
                          className={`border rounded p-2 text-sm border-l-4 ${
                            slot.session === "morning"
                              ? "bg-blue-100 border-blue-500"
                              : slot.session === "afternoon"
                              ? "bg-green-100 border-green-500"
                              : "bg-purple-100 border-purple-500"
                          }`}
                        >
                          <div className="font-semibold capitalize">
                            Ca {getSessionName(slot.session)}
                          </div>
                          <div className="text-gray-600">
                            {slot.startTime} - {slot.endTime}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
        <HospitalScheduleModal
          ref={hospitalScheduleModalRef}
          id_schedule={id_schedule}
          slots_detail={slots}
        />
      </>
    );
  }
);

export default ScheduleFacility;
