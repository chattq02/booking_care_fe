import { Flex, DatePicker, ConfigProvider, Tag, Empty, Spin } from "antd";
import { ClockCircleOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import viVN from "antd/locale/vi_VN";
import { useGetScheduleDoctor } from "../hooks/useDoctor";
import { useState } from "react";
import type { ISlot } from "@/site/user.site/types/schedule";

dayjs.locale("vi");

interface IProps {
  doctorId: number;
  onClickSlot: (slot: ISlot) => void;
}

export default function TabSchedule({ doctorId, onClickSlot }: IProps) {
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const { data: scheduleData, isLoading: isScheduleLoading } =
    useGetScheduleDoctor({
      doctorId: Number(doctorId),
      date: selectedDate ? selectedDate.format("YYYY-MM-DD") : "",
    });

  return (
    <div style={{ padding: "24px 0" }}>
      {isScheduleLoading ? (
        <Spin spinning />
      ) : (
        <>
          <Flex
            align="center"
            style={{ marginBottom: 24, borderRadius: 12 }}
            gap={15}
          >
            <div>
              <h4>📅 Chọn ngày khám</h4>
            </div>
            <ConfigProvider locale={viVN}>
              <DatePicker
                allowClear={false}
                value={selectedDate}
                onChange={setSelectedDate}
                format={(date) => {
                  const formatted = date.format("dddd - DD/MM/YYYY"); // vd: "chủ nhật - 23/11/2025"
                  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
                }}
                disabledDate={(current) =>
                  current && current < dayjs().startOf("day")
                }
                placeholder="Chọn ngày khám"
                size="large"
              />
            </ConfigProvider>
          </Flex>
          {scheduleData && scheduleData?.length > 0 ? (
            scheduleData?.map((item) => (
              <div key={item.id} style={{ marginBottom: 24 }}>
                {/* Header thông tin config */}
                <div
                  className="border border-b-0 rounded-t-md"
                  style={{
                    background: "#f0f8ff",
                    padding: "12px 16px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 16,
                      flexWrap: "wrap",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "16px",
                        fontWeight: 600,
                        color: "#1890ff",
                      }}
                    >
                      {item.configName}
                    </span>
                    <div
                      style={{
                        display: "flex",
                        gap: 12,
                        fontSize: "14px",
                        color: "#666",
                      }}
                    >
                      <span>
                        🕒 {item.workStartTime} - {item.workEndTime}
                      </span>
                      <span>⏱️ {item.slotDuration} phút</span>
                      <span>
                        💰 {new Intl.NumberFormat("vi-VN").format(item.price)}{" "}
                        VND
                      </span>
                    </div>
                  </div>
                </div>

                {/* Các ngày trong lịch */}
                {item.daySchedules?.map((daySchedule) => (
                  <div key={`${daySchedule.date}`} style={{ marginBottom: 20 }}>
                    {/* Các slot */}
                    <Flex
                      gap={15}
                      wrap="wrap"
                      className="border border-t-0 rounded-b-md"
                      style={{
                        padding: "20px",
                        background: "#fff",
                      }}
                    >
                      {daySchedule.slots?.map((slot, index) => (
                        <Tag
                          key={`${daySchedule.date}-${index}`}
                          color={slot.selected ? "blue" : "default"}
                          style={{
                            cursor: "pointer",
                            padding: "8px 12px",
                            margin: 0,
                            flexShrink: 0,
                            borderRadius: "6px",
                            border: `1px solid ${
                              slot.selected ? "#1890ff" : "#d9d9d9"
                            }`,
                            background: slot.selected ? "#e6f7ff" : "#fff",
                            color: slot.selected ? "#1890ff" : "#000",
                            fontWeight: 500,
                            fontSize: "14px",
                            transition: "all 0.3s ease",
                            boxShadow: slot.selected
                              ? "0 2px 4px rgba(24, 144, 255, 0.2)"
                              : "none",
                            overflow: "hidden",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform =
                              "translateY(-2px)";
                            e.currentTarget.style.boxShadow =
                              "0 4px 8px rgba(0, 0, 0, 0.1)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = "translateY(0)";
                            e.currentTarget.style.boxShadow = slot.selected
                              ? "0 2px 4px rgba(24, 144, 255, 0.2)"
                              : "none";
                          }}
                          onClick={() =>
                            onClickSlot({
                              ...slot,
                              price: item.price || 0,
                              selectedDate: selectedDate,
                            })
                          }
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 4,
                            }}
                          >
                            <ClockCircleOutlined style={{ fontSize: "12px" }} />
                            <span>
                              {slot.startTime} - {slot.endTime}
                            </span>
                          </div>
                        </Tag>
                      ))}
                    </Flex>
                  </div>
                ))}
              </div>
            ))
          ) : (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description="Không có lịch khám nào"
              style={{
                margin: "40px 0",
                color: "#999",
              }}
            />
          )}
        </>
      )}
    </div>
  );
}
