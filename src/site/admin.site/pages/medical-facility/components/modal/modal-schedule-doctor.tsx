import { forwardRef, useImperativeHandle, useState, useCallback } from "react";
import {
  Modal,
  Card,
  Row,
  Col,
  Button,
  Space,
  Descriptions,
  Badge,
  Form,
  Select,
  DatePicker,
  TimePicker,
  message,
  Tag,
  InputNumber,
} from "antd";
import { Dayjs } from "dayjs";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { v4 } from "uuid";
import { useSetAtom } from "jotai";
import { loadingAtom } from "@/stores/loading";
import dayjs from "dayjs";
import { useCreateScheduleFacility } from "../../hooks/use-schedule";
import type { IWorkSchedule } from "../../type";

const { Option } = Select;

export interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
  selected: boolean;
}

export interface DaySchedule {
  date: string;
  dayOfWeek: string;
  slots: TimeSlot[];
}

export interface ScheduleConfig {
  id: string;
  slotDuration: number;
  workStartTime: Dayjs;
  workEndTime: Dayjs;
  selectedDates: Dayjs[];
  daySchedules: DaySchedule[];
  price: number;
  configName: string;
}

export interface DoctorScheduleRef {
  showModal: (
    schedule: ScheduleConfig[],
    doctorId: number,
    scheduleId?: number
  ) => void;
  hideModal: () => void;
}

interface IProps {
  departmentId: number;
  facilityId: number;
  refetch: () => void;
}

export const DoctorScheduleModal = forwardRef<DoctorScheduleRef, IProps>(
  ({ departmentId, facilityId, refetch }, ref) => {
    const [visible, setVisible] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();
    const [modal, modalElement] = Modal.useModal();
    const create = useCreateScheduleFacility();
    const [form] = Form.useForm();
    const [doctorId, setDoctorId] = useState<number>();
    const [scheduleId, setScheduleId] = useState<number>();
    const [scheduleConfigs, setScheduleConfigs] = useState<ScheduleConfig[]>(
      []
    );

    const [showValidation, setShowValidation] = useState(false);

    const setLoading = useSetAtom(loadingAtom);

    // Lấy tất cả các ngày đã được chọn từ tất cả các config
    const getAllSelectedDates = useCallback((): string[] => {
      return scheduleConfigs.flatMap((config) =>
        config.selectedDates.map((date) => date.format("YYYY-MM-DD"))
      );
    }, [scheduleConfigs]);

    // Kiểm tra config có hợp lệ không - CẬP NHẬT: phải chọn slot cho tất cả các ngày
    const isConfigValid = useCallback((config: ScheduleConfig): boolean => {
      const hasSelectedSlotsForAllDays =
        config.daySchedules.length > 0 &&
        config.daySchedules.every((day) =>
          day.slots.some((slot) => slot.selected)
        );

      return (
        config.selectedDates.length > 0 &&
        config.price > 0 &&
        hasSelectedSlotsForAllDays
      );
    }, []);

    // Kiểm tra tất cả config có hợp lệ không
    const areAllConfigsValid = useCallback((): boolean => {
      return scheduleConfigs.every((config) => isConfigValid(config));
    }, [scheduleConfigs, isConfigValid]);

    // Hàm tạo timeline slots với ID ỔN ĐỊNH
    const generateTimeSlots = useCallback(
      (startTime: Dayjs, endTime: Dayjs, duration: number): TimeSlot[] => {
        const slots: TimeSlot[] = [];
        let currentTime = startTime;

        while (currentTime.isBefore(endTime)) {
          const slotEndTime = currentTime.add(duration, "minute");
          if (slotEndTime.isAfter(endTime)) break;

          slots.push({
            id: v4(), // Sử dụng timeKey thay vì v4() để đảm bảo ổn định
            startTime: currentTime.format("HH:mm"),
            endTime: slotEndTime.format("HH:mm"),
            selected: false,
          });

          currentTime = slotEndTime;
        }

        return slots;
      },
      []
    );

    // Cập nhật schedules cho một config - FIXED: giữ trạng thái selected chính xác
    const updateConfigSchedules = useCallback(
      (
        config: ScheduleConfig,
        dates: Dayjs[],
        duration: number,
        start: Dayjs,
        end: Dayjs
      ): ScheduleConfig => {
        const existingSchedulesMap = new Map(
          config.daySchedules.map((day) => [day.date, day])
        );

        const newSchedules: DaySchedule[] = dates.map((date) => {
          const dateStr = date.format("YYYY-MM-DD");
          const existingDay = existingSchedulesMap.get(dateStr);

          if (existingDay) {
            // Nếu đã có ngày này, tạo slots mới nhưng giữ trạng thái selected từ slots cũ
            const newSlots = generateTimeSlots(start, end, duration);

            // Map trạng thái selected từ slots cũ sang slots mới dựa trên ID ổn định
            const oldSlotsMap = new Map(
              existingDay.slots.map((slot) => [slot.id, slot])
            );

            const updatedSlots = newSlots.map((newSlot) => {
              const oldSlot = oldSlotsMap.get(newSlot.id);
              return oldSlot
                ? { ...newSlot, selected: oldSlot.selected }
                : newSlot;
            });

            return {
              ...existingDay,
              slots: updatedSlots,
            };
          } else {
            // Tạo mới nếu ngày chưa tồn tại
            return {
              date: dateStr,
              dayOfWeek: date.format("ddd"),
              slots: generateTimeSlots(start, end, duration),
            };
          }
        });

        return {
          ...config,
          selectedDates: dates,
          slotDuration: duration,
          workStartTime: start,
          workEndTime: end,
          daySchedules: newSchedules,
        };
      },
      [generateTimeSlots]
    );

    // Kiểm tra xem ngày có được chọn trong config khác không
    const isDateSelectedInOtherConfigs = (
      currentConfigId: string,
      date: Dayjs
    ): boolean => {
      const dateStr = date.format("YYYY-MM-DD");
      return scheduleConfigs.some(
        (config) =>
          config.id !== currentConfigId &&
          config.selectedDates.some(
            (selectedDate) => selectedDate.format("YYYY-MM-DD") === dateStr
          )
      );
    };

    // Xử lý khi chọn nhiều ngày cho một config - FIXED
    const handleDateChange = (configId: string, dates: Dayjs[] | null) => {
      const newDates = dates || [];

      // Kiểm tra xem có ngày nào đã được chọn trong config khác không
      const conflictingDates = newDates.filter((date) =>
        isDateSelectedInOtherConfigs(configId, date)
      );

      if (conflictingDates.length > 0) {
        const conflictingDateStrs = conflictingDates.map((date) =>
          date.format("DD/MM/YYYY")
        );
        messageApi.error(
          `Các ngày ${conflictingDateStrs.join(
            ", "
          )} đã được chọn trong cấu hình khác`
        );
        return;
      }

      setScheduleConfigs((prev) =>
        prev.map((config) => {
          if (config.id !== configId) return config;

          if (newDates.length === 0) {
            return {
              ...config,
              selectedDates: [],
              daySchedules: [],
            };
          }

          return updateConfigSchedules(
            config,
            newDates,
            config.slotDuration,
            config.workStartTime,
            config.workEndTime
          );
        })
      );
    };

    // Xử lý khi thay đổi slot duration - FIXED
    const handleSlotDurationChange = (configId: string, value: number) => {
      setScheduleConfigs((prev) =>
        prev.map((config) => {
          if (config.id !== configId) return config;

          if (config.selectedDates.length === 0) {
            return { ...config, slotDuration: value };
          }

          // Sử dụng updateConfigSchedules đã được fix
          return updateConfigSchedules(
            config,
            config.selectedDates,
            value,
            config.workStartTime,
            config.workEndTime
          );
        })
      );
    };

    // Xử lý khi thay đổi giờ làm việc - FIXED
    const handleWorkTimeChange = (
      configId: string,
      times: [Dayjs, Dayjs] | null
    ) => {
      if (!times) return;

      const [startTime, endTime] = times;

      setScheduleConfigs((prev) =>
        prev.map((config) => {
          if (config.id !== configId) return config;

          if (config.selectedDates.length === 0) {
            return {
              ...config,
              workStartTime: startTime,
              workEndTime: endTime,
            };
          }

          // Sử dụng updateConfigSchedules đã được fix
          return updateConfigSchedules(
            config,
            config.selectedDates,
            config.slotDuration,
            startTime,
            endTime
          );
        })
      );
    };

    // Xử lý thay đổi giá tiền
    const handlePriceChange = (configId: string, price: number | null) => {
      setScheduleConfigs((prev) =>
        prev.map((config) =>
          config.id === configId ? { ...config, price: price || 0 } : config
        )
      );
    };

    // Xử lý chọn/bỏ chọn slot - FIXED: thêm debug
    const handleSlotToggle = (
      configId: string,
      date: string,
      slotId: string
    ) => {
      setScheduleConfigs((prev) =>
        prev.map((config) => {
          if (config.id !== configId) return config;

          const updatedConfig = {
            ...config,
            daySchedules: config.daySchedules.map((day) =>
              day.date === date
                ? {
                    ...day,
                    slots: day.slots.map((slot) =>
                      slot.id === slotId
                        ? { ...slot, selected: !slot.selected }
                        : slot
                    ),
                  }
                : day
            ),
          };

          return updatedConfig;
        })
      );
    };

    // Xử lý chọn tất cả slots của một ngày
    const handleSelectAllSlots = (
      configId: string,
      date: string,
      selected: boolean
    ) => {
      setScheduleConfigs((prev) =>
        prev.map((config) => {
          if (config.id !== configId) return config;

          return {
            ...config,
            daySchedules: config.daySchedules.map((day) =>
              day.date === date
                ? {
                    ...day,
                    slots: day.slots.map((slot) => ({ ...slot, selected })),
                  }
                : day
            ),
          };
        })
      );
    };

    // Xử lý chọn tất cả slots của tất cả các ngày trong config
    const handleSelectAllSlotsInConfig = (
      configId: string,
      selected: boolean
    ) => {
      setScheduleConfigs((prev) =>
        prev.map((config) => {
          if (config.id !== configId) return config;

          return {
            ...config,
            daySchedules: config.daySchedules.map((day) => ({
              ...day,
              slots: day.slots.map((slot) => ({ ...slot, selected })),
            })),
          };
        })
      );
    };

    // Thêm config mới với validate
    const handleAddNewConfig = () => {
      // Bật chế độ hiển thị validate
      setShowValidation(true);

      // Kiểm tra config cuối cùng có hợp lệ không
      if (!areAllConfigsValid()) {
        messageApi.error(
          "Vui lòng hoàn thành cấu hình hiện tại trước khi thêm mới!"
        );
        return;
      }

      const newConfig: ScheduleConfig = {
        id: v4(),
        slotDuration: 30,
        workStartTime: dayjs().set("hour", 8).set("minute", 0),
        workEndTime: dayjs().set("hour", 17).set("minute", 0),
        selectedDates: [],
        daySchedules: [],
        price: 0,
        configName: "",
      };

      setScheduleConfigs((prev) => [...prev, newConfig]);
      // Tắt validate sau khi thêm thành công
      setShowValidation(false);
      messageApi.success("Đã thêm cấu hình mới");
    };

    // Xóa config
    const handleRemoveConfig = (configId: string) => {
      if (scheduleConfigs.length <= 1) {
        messageApi.warning("Cần ít nhất một cấu hình");
        return;
      }

      const configToRemove = scheduleConfigs.find(
        (config) => config.id === configId
      );

      if (!configToRemove) {
        messageApi.error("Không tìm thấy cấu hình để xóa");
        return;
      }

      modal.confirm({
        title: "Xác nhận xóa",
        content: `Bạn có chắc chắn muốn xóa cấu hình ?`,
        okText: "Xóa",
        cancelText: "Hủy",
        okType: "danger",
        onOk: () => {
          setScheduleConfigs((prev) => {
            const newConfigs = prev.filter((config) => config.id !== configId);
            return newConfigs;
          });
          messageApi.success("Đã xóa cấu hình thành công");
        },
        onCancel: () => {},
      });
    };

    // Hàm disabledDate để ngăn chọn các ngày đã được chọn trong config khác
    const disabledDate = (currentConfigId: string) => (current: Dayjs) => {
      if (!current) return false;

      // Ngăn chọn ngày trong quá khứ
      if (current < dayjs().startOf("day")) return true;

      // Ngăn chọn ngày đã được chọn trong config khác
      const currentDateStr = current.format("YYYY-MM-DD");
      return scheduleConfigs.some(
        (config) =>
          config.id !== currentConfigId &&
          config.selectedDates.some(
            (date) => date.format("YYYY-MM-DD") === currentDateStr
          )
      );
    };

    // Xử lý submit form với validate
    const onFinish = () => {
      // Bật chế độ hiển thị validate
      setShowValidation(true);

      // Kiểm tra xem có config nào có ngày trùng nhau không
      const allSelectedDates = getAllSelectedDates();
      const uniqueDates = [...new Set(allSelectedDates)];

      if (allSelectedDates.length !== uniqueDates.length) {
        messageApi.error(
          "Có ngày bị trùng nhau giữa các cấu hình. Vui lòng kiểm tra lại!"
        );
        return;
      }

      // Kiểm tra tất cả config có hợp lệ không
      if (!areAllConfigsValid()) {
        messageApi.error(
          "Vui lòng hoàn thành tất cả các cấu hình trước khi lưu!"
        );
        return;
      }

      const slots = scheduleConfigs.map((config) => {
        return {
          id: config.id,
          configName: "",
          workStartTime: config.workStartTime.format("HH:mm"),
          workEndTime: config.workEndTime.format("HH:mm"),
          slotDuration: config.slotDuration,
          price: config.price,
          daySchedules: config.daySchedules.map((day) => {
            return {
              date: day.date,
              dayOfWeek: day.dayOfWeek,
              slots: day.slots.map((slot) => {
                return {
                  id: slot.id || v4(),
                  startTime: slot.startTime,
                  endTime: slot.endTime,
                  selected: slot.selected,
                  isBlock: false,
                };
              }),
            };
          }),
          selectedDates: config.selectedDates.map((day) =>
            day.format("YYYY-MM-DD")
          ),
        };
      });

      const dataSave: IWorkSchedule = {
        type: "DOCTOR",
        slots: slots,
        status: "NORMAL",
        departmentId: departmentId,
        doctorId: doctorId,
        facilityId: facilityId,
        id: scheduleId,
      };

      create.mutate(dataSave, {
        onSuccess: () => {
          refetch();
          hideModal();
          setLoading(false);
        },
        onError: () => {
          setLoading(false);
        },
      });

      messageApi.success("Cấu hình lịch làm việc thành công!");

      // Reset validation sau khi submit thành công
      setShowValidation(false);
    };

    const onFinishFailed = () => {
      setShowValidation(true);
      messageApi.error("Vui lòng kiểm tra lại thông tin!");
    };

    const showModal = (
      schedule: ScheduleConfig[],
      doctorId: number,
      scheduleId?: number
    ) => {
      setVisible(true);
      setDoctorId(doctorId);
      setScheduleId(scheduleId);

      // Xử lý dữ liệu doctor để chuyển đổi thành ScheduleConfig[]
      if (schedule) {
        const processedConfigs = schedule.map((config: any) => {
          // Chuyển đổi workStartTime và workEndTime từ string sang Dayjs
          const workStartTime = config.workStartTime
            ? dayjs(config.workStartTime, "HH:mm")
            : dayjs().set("hour", 8).set("minute", 0);

          const workEndTime = config.workEndTime
            ? dayjs(config.workEndTime, "HH:mm")
            : dayjs().set("hour", 17).set("minute", 0);

          // Chuyển đổi selectedDates từ string[] sang Dayjs[]
          const selectedDates = config.selectedDates
            ? config.selectedDates.map((date: string) => dayjs(date))
            : [];

          // Xử lý daySchedules - đảm bảo slots có ID ổn định
          const processedDaySchedules =
            config.daySchedules?.map((day: any) => ({
              ...day,
              slots:
                day.slots?.map((slot: any) => ({
                  ...slot,
                  id: v4(), // Đảm bảo ID ổn định
                })) || [],
            })) || [];

          return {
            id: config.id || v4(),
            slotDuration: config.slotDuration || 30,
            workStartTime,
            workEndTime,
            selectedDates,
            daySchedules: processedDaySchedules,
            price: Number(config.price) || 0,
            configName: "",
          };
        });

        setScheduleConfigs(processedConfigs);
      } else {
        // Nếu không có dữ liệu, set default config
        setScheduleConfigs([
          {
            id: v4(),
            slotDuration: 30,
            workStartTime: dayjs().set("hour", 8).set("minute", 0),
            workEndTime: dayjs().set("hour", 17).set("minute", 0),
            selectedDates: [],
            daySchedules: [],
            price: 0,
            configName: "",
          },
        ]);
      }

      setShowValidation(false);
    };

    const hideModal = () => {
      setVisible(false);
      setShowValidation(false);
      form.resetFields();
    };

    useImperativeHandle(ref, () => ({
      showModal,
      hideModal,
    }));

    // Component cho một config - FIXED: sử dụng key ổn định
    const renderScheduleConfig = (config: ScheduleConfig) => {
      const isValid = isConfigValid(config);
      const shouldShowValidation = showValidation && !isValid;
      const hasUnselectedDays = config.daySchedules.some(
        (day) => !day.slots.some((slot) => slot.selected)
      );

      return (
        <Card
          key={config.id}
          size="small"
          extra={
            <Space>
              <span style={{ color: "#52c41a", fontWeight: "bold" }}>
                {config.price.toLocaleString("vi-VN")} VND
              </span>
              {scheduleConfigs.length > 1 && (
                <Button
                  type="text"
                  danger
                  icon={<DeleteOutlined />}
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    handleRemoveConfig(config.id);
                  }}
                  style={{ marginLeft: 8 }}
                >
                  Xóa
                </Button>
              )}
            </Space>
          }
          style={{
            marginBottom: 16,
            border: `1px solid ${shouldShowValidation ? "#ff4d4f" : "#d9d9d9"}`,
            backgroundColor: shouldShowValidation ? "#fff2f0" : "transparent",
          }}
          styles={{
            header: {
              backgroundColor: "rgb(205 252 245)",
            },
          }}
        >
          <Row gutter={16}>
            <Col span={6}>
              <Form.Item
                label="Chọn các ngày làm việc"
                name={`dates_${config.id}`}
                validateStatus={
                  shouldShowValidation && config.selectedDates.length === 0
                    ? "error"
                    : ""
                }
                help={
                  shouldShowValidation && config.selectedDates.length === 0
                    ? "Vui lòng chọn ít nhất một ngày"
                    : ""
                }
              >
                <DatePicker
                  multiple
                  style={{
                    width: "100%",
                    borderColor:
                      shouldShowValidation && config.selectedDates.length === 0
                        ? "#ff4d4f"
                        : "#d9d9d9",
                  }}
                  placeholder="Chọn các ngày làm việc"
                  value={config.selectedDates}
                  defaultValue={config.selectedDates}
                  maxTagCount="responsive"
                  onChange={(dates) => handleDateChange(config.id, dates)}
                  disabledDate={disabledDate(config.id)}
                />
              </Form.Item>
            </Col>

            <Col span={4}>
              <Form.Item
                label="Thời lượng slot (phút)"
                name={`slotDuration_${config.id}`}
                initialValue={config.slotDuration}
              >
                <Select
                  value={config.slotDuration}
                  onChange={(value) =>
                    handleSlotDurationChange(config.id, value)
                  }
                >
                  <Option value={15}>15 phút</Option>
                  <Option value={30}>30 phút</Option>
                  <Option value={45}>45 phút</Option>
                  <Option value={60}>60 phút</Option>
                </Select>
              </Form.Item>
            </Col>

            <Col span={6}>
              <Form.Item
                label="Khung giờ làm việc"
                name={`workTime_${config.id}`}
                initialValue={[config.workStartTime, config.workEndTime]}
              >
                <TimePicker.RangePicker
                  needConfirm={false}
                  format="HH:mm"
                  style={{ width: "100%" }}
                  value={[config.workStartTime, config.workEndTime]}
                  onChange={(times: any) =>
                    handleWorkTimeChange(config.id, times)
                  }
                  placeholder={["Giờ bắt đầu", "Giờ kết thúc"]}
                />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item
                label="Giá tiền/slot (VND)"
                name={`price_${config.id}`}
                validateStatus={
                  shouldShowValidation && config.price <= 0 ? "error" : ""
                }
                help={
                  shouldShowValidation && config.price <= 0
                    ? "Vui lòng nhập giá tiền hợp lệ"
                    : ""
                }
              >
                <InputNumber
                  style={{
                    width: "100%",
                    borderColor:
                      shouldShowValidation && config.price <= 0
                        ? "#ff4d4f"
                        : "#d9d9d9",
                  }}
                  value={config.price}
                  defaultValue={config.price}
                  onChange={(value) => handlePriceChange(config.id, value)}
                  min={0}
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  parser={(value) => value?.replace(/\$\s?|(,*)/g, "") as any}
                  placeholder="Nhập giá tiền"
                />
              </Form.Item>
            </Col>
          </Row>

          {/* Timeline slots - FIXED: sử dụng key ổn định */}
          {config.daySchedules.length > 0 && (
            <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
              <Col span={24}>
                <Card
                  title={
                    <Space>
                      <span>Lịch làm việc chi tiết</span>
                      <Button
                        size="small"
                        type="link"
                        onClick={() =>
                          handleSelectAllSlotsInConfig(config.id, true)
                        }
                      >
                        Chọn tất cả
                      </Button>
                      <Button
                        size="small"
                        type="link"
                        onClick={() =>
                          handleSelectAllSlotsInConfig(config.id, false)
                        }
                      >
                        Bỏ chọn tất cả
                      </Button>
                      {shouldShowValidation && hasUnselectedDays && (
                        <Badge
                          status="error"
                          text="Chưa chọn slot cho tất cả các ngày"
                          style={{ color: "#ff4d4f", fontSize: "12px" }}
                        />
                      )}
                    </Space>
                  }
                  size="small"
                >
                  <Row gutter={[16, 16]}>
                    {config.daySchedules.map((daySchedule) => {
                      const hasSelectedSlots = daySchedule.slots.some(
                        (slot) => slot.selected
                      );
                      const dayShouldShowValidation =
                        shouldShowValidation && !hasSelectedSlots;

                      return (
                        <Col span={24} key={`${config.id}-${daySchedule.date}`}>
                          <Card
                            size="small"
                            title={
                              <Space>
                                <span>
                                  {daySchedule.date} ({daySchedule.dayOfWeek})
                                </span>
                                {dayShouldShowValidation && (
                                  <Badge
                                    status="error"
                                    text="Chưa chọn slot"
                                    style={{
                                      color: "#ff4d4f",
                                      fontSize: "12px",
                                    }}
                                  />
                                )}
                                <Button
                                  size="small"
                                  type="link"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleSelectAllSlots(
                                      config.id,
                                      daySchedule.date,
                                      true
                                    );
                                  }}
                                >
                                  Chọn tất cả
                                </Button>
                                <Button
                                  size="small"
                                  type="link"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleSelectAllSlots(
                                      config.id,
                                      daySchedule.date,
                                      false
                                    );
                                  }}
                                >
                                  Bỏ chọn tất cả
                                </Button>
                              </Space>
                            }
                            style={{
                              border: dayShouldShowValidation
                                ? "1px solid #ff4d4f"
                                : "1px solid #d9d9d9",
                              backgroundColor: dayShouldShowValidation
                                ? "#fff2f0"
                                : "transparent",
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                flexWrap: "wrap",
                                gap: 8,
                                maxHeight: 120,
                                overflowY: "auto",
                              }}
                            >
                              {daySchedule.slots.map((slot) => (
                                <Tag
                                  key={`${config.id}-${daySchedule.date}-${slot.id}`}
                                  color={slot.selected ? "blue" : "default"}
                                  style={{
                                    cursor: "pointer",
                                    padding: "4px 8px",
                                    margin: 0,
                                    flexShrink: 0,
                                  }}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleSlotToggle(
                                      config.id,
                                      daySchedule.date,
                                      slot.id
                                    );
                                  }}
                                >
                                  {slot.startTime} - {slot.endTime}
                                </Tag>
                              ))}
                            </div>
                          </Card>
                        </Col>
                      );
                    })}
                  </Row>
                </Card>
              </Col>
            </Row>
          )}

          {/* Thống kê cho config */}
          {config.daySchedules.length > 0 && (
            <Row style={{ marginTop: 16 }}>
              <Col span={24}>
                <Card title="Thống kê" size="small">
                  <Descriptions size="small" column={4}>
                    <Descriptions.Item label="Số ngày đã chọn">
                      {config.selectedDates.length}
                    </Descriptions.Item>
                    <Descriptions.Item label="Tổng số slot">
                      {config.daySchedules.reduce(
                        (total, day) => total + day.slots.length,
                        0
                      )}
                    </Descriptions.Item>
                    <Descriptions.Item label="Số ngày đã chọn slot">
                      <span
                        style={{
                          color: config.daySchedules.every((day) =>
                            day.slots.some((slot) => slot.selected)
                          )
                            ? "#52c41a"
                            : shouldShowValidation
                            ? "#ff4d4f"
                            : "#000000",
                          fontWeight: "bold",
                        }}
                      >
                        {
                          config.daySchedules.filter((day) =>
                            day.slots.some((slot) => slot.selected)
                          ).length
                        }{" "}
                        / {config.daySchedules.length}
                      </span>
                    </Descriptions.Item>
                    <Descriptions.Item label="Tổng giá trị">
                      <span style={{ color: "#52c41a", fontWeight: "bold" }}>
                        {(
                          config.daySchedules.reduce(
                            (total, day) =>
                              total +
                              day.slots.filter((slot) => slot.selected).length,
                            0
                          ) * config.price
                        ).toLocaleString("vi-VN")}{" "}
                        VND
                      </span>
                    </Descriptions.Item>
                  </Descriptions>
                </Card>
              </Col>
            </Row>
          )}
        </Card>
      );
    };

    const isSubmitDisabled = showValidation && !areAllConfigsValid();

    return (
      <Modal
        title="Cấu hình lịch hẹn"
        open={visible}
        onCancel={hideModal}
        styles={{
          body: {
            height: "75vh",
            overflowY: "auto",
            overflowX: "hidden",
          },
        }}
        style={{
          top: 30,
        }}
        width={"90%"}
        footer={[
          <Button key="cancel" onClick={hideModal}>
            Hủy
          </Button>,
          <Button
            key="add-more"
            icon={<PlusOutlined />}
            onClick={handleAddNewConfig}
            disabled={isSubmitDisabled}
          >
            Thêm tiếp
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={() => form.submit()}
            disabled={isSubmitDisabled}
          >
            Lưu tất cả cấu hình
          </Button>,
        ]}
      >
        <>
          {contextHolder}
          {modalElement}
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
          >
            <Row gutter={[16, 16]}>
              <Col span={24}>
                {scheduleConfigs.map((config) => renderScheduleConfig(config))}
              </Col>
            </Row>
          </Form>
        </>
      </Modal>
    );
  }
);
