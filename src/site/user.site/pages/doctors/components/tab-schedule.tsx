import {
  Flex,
  DatePicker,
  ConfigProvider,
  Tag,
  Empty,
  Spin,
  Select,
} from "antd";
import { ClockCircleOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import viVN from "antd/locale/vi_VN";
import { useGetScheduleDoctor } from "../hooks/useDoctor";
import { useState, useEffect } from "react";
import type { ISlot } from "@/site/user.site/types/schedule";
import { useSearchParams } from "react-router-dom";

dayjs.locale("vi");

interface IProps {
  doctorId: number;
  onClickSlot: (slot: ISlot, departmentSlot: IOption | undefined) => void;
  list_departments: { id: number; name: string }[];
}

export interface IOption {
  value: number;
  label: string;
}

export default function TabSchedule({
  list_departments,
  doctorId,
  onClickSlot,
}: IProps) {
  const [searchParams, setSearchParams] = useSearchParams();

  // Lấy giá trị từ URL params nếu có, nếu không thì dùng giá trị mặc định
  const initialDate = searchParams.get("date")
    ? dayjs(searchParams.get("date"))
    : dayjs();

  const initialDepartmentId = searchParams.get("departmentId");

  // Tìm department tương ứng từ list_departments
  const initialDepartment = initialDepartmentId
    ? list_departments.find((dept) => dept.id === Number(initialDepartmentId))
    : undefined;

  const [selectedDate, setSelectedDate] = useState(initialDate);
  const [department, setDepartment] = useState<IOption | undefined>(
    initialDepartment
      ? {
          value: initialDepartment.id,
          label: initialDepartment.name,
        }
      : undefined
  );

  const { data: scheduleData, isLoading: isScheduleLoading } =
    useGetScheduleDoctor({
      doctorId: Number(doctorId),
      date: selectedDate ? selectedDate.format("YYYY-MM-DD") : "",
      departmentId: Number(department?.value || 0),
    });

  // Hàm cập nhật URL params
  const updateSearchParams = (params: {
    date?: string;
    departmentId?: string;
  }) => {
    const newParams = new URLSearchParams(searchParams);

    if (params.date !== undefined) {
      if (params.date) {
        newParams.set("date", params.date);
      } else {
        newParams.delete("date");
      }
    }

    if (params.departmentId !== undefined) {
      if (params.departmentId) {
        newParams.set("departmentId", params.departmentId);
      } else {
        newParams.delete("departmentId");
      }
    }

    setSearchParams(newParams);
  };

  const handleDateChange = (date: dayjs.Dayjs | null) => {
    if (date) {
      setSelectedDate(date);
      updateSearchParams({ date: date.format("YYYY-MM-DD") });
    }
  };

  const handleDepartmentChange = (
    _value: number,
    option?:
      | {
          value: number;
          label: string;
        }
      | {
          value: number;
          label: string;
        }[]
      | undefined
  ) => {
    const dept = option as IOption;
    setDepartment(dept);
    updateSearchParams({
      departmentId: dept?.value ? dept.value.toString() : "",
    });
  };

  // Xử lý khi component mount để đồng bộ state với URL params
  useEffect(() => {
    const dateParam = searchParams.get("date");
    const deptParam = searchParams.get("departmentId");

    if (dateParam && dayjs(dateParam).isValid()) {
      setSelectedDate(dayjs(dateParam));
    }

    if (deptParam) {
      const dept = list_departments.find((d) => d.id === Number(deptParam));
      if (dept) {
        setDepartment({
          value: dept.id,
          label: dept.name,
        });
      }
    }
  }, []);

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
            wrap
          >
            <div>
              <h4>📅 Chọn ngày khám</h4>
            </div>
            <ConfigProvider locale={viVN}>
              <DatePicker
                allowClear={false}
                value={selectedDate}
                onChange={handleDateChange}
                format={(date) => {
                  const formatted = date.format("dddd - DD/MM/YYYY");
                  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
                }}
                disabledDate={(current) =>
                  current && current < dayjs().startOf("day")
                }
                placeholder="Chọn ngày khám"
                size="large"
              />
            </ConfigProvider>
            <Select
              value={department?.value}
              style={{ width: 250 }}
              placeholder="Chọn chuyên khoa"
              popupMatchSelectWidth={false}
              size="large"
              onChange={handleDepartmentChange}
              options={list_departments?.map((val) => ({
                value: val.id,
                label: val.name,
              }))}
            />
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
                          color={!slot.isBlock ? "blue" : "red"}
                          style={{
                            cursor: !slot.isBlock ? "pointer" : "not-allowed",
                            pointerEvents: !slot.isBlock ? "auto" : "none",
                            padding: "8px 12px",
                            margin: 0,
                            flexShrink: 0,
                            borderRadius: "6px",
                            border: `1px solid ${
                              !slot.isBlock ? "#1890ff" : "#d9d9d9"
                            }`,
                            background: !slot.isBlock ? "#e6f7ff" : "#fff",
                            color: !slot.isBlock ? "#1890ff" : "#000",
                            fontWeight: 500,
                            fontSize: "14px",
                            transition: "all 0.3s ease",
                            boxShadow: !slot.isBlock
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
                            e.currentTarget.style.boxShadow = !slot.isBlock
                              ? "0 2px 4px rgba(24, 144, 255, 0.2)"
                              : "none";
                          }}
                          onClick={() =>
                            onClickSlot(
                              {
                                ...slot,
                                price: item.price || 0,
                                selectedDate: selectedDate,
                              },
                              department ?? undefined
                            )
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
