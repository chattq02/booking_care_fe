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

    console.log("listSchedule", slots);

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
              onClick={() => hospitalScheduleModalRef.current?.showModal(slots)}
            >
              Điều chỉnh
            </Button>
          </Flex>

          <div className="grid grid-cols-7 border rounded ">
            {days.map((day) => {
              const daySlots = slots?.[day.key] || [];
              const isEmpty = daySlots.length === 0;

              return (
                <div
                  key={day.key}
                  className={`border h-[300px] ${
                    isEmpty ? "bg-red-200" : "bg-gray-50"
                  }`}
                >
                  <div className="border-b">
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
                    <div className="text-center mt-5 font-bold">Nghỉ</div>
                  ) : (
                    <div className={`px-2 py-5 flex flex-col gap-2`}>
                      {daySlots.map((slot, index) => (
                        <div
                          key={index}
                          className={`border rounded p-2 mb-2 text-sm border-l-4 ${
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
        <HospitalScheduleModal ref={hospitalScheduleModalRef} />
      </>
    );
  }
);

export default ScheduleFacility;
