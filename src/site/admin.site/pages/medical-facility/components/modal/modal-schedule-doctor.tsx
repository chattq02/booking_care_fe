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
import type { IResponseGetUsersDepartment } from "../../../specialty/type";

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
    doctor: IResponseGetUsersDepartment,
    type: "create" | "update"
  ) => void;
  hideModal: () => void;
}

interface IProps {}

const generateFakeData = () => {
  const today = dayjs();
  const fakeConfigs: ScheduleConfig[] = [
    {
      id: v4(),
      slotDuration: 30,
      workStartTime: today.set("hour", 8).set("minute", 0),
      workEndTime: today.set("hour", 12).set("minute", 0),
      selectedDates: [
        today.add(1, "day"),
        today.add(2, "day"),
        today.add(3, "day"),
      ],
      daySchedules: [
        {
          date: today.add(1, "day").format("YYYY-MM-DD"),
          dayOfWeek: today.add(1, "day").format("ddd"),
          slots: [
            { id: v4(), startTime: "08:00", endTime: "08:30", selected: true },
            { id: v4(), startTime: "08:30", endTime: "09:00", selected: false },
            { id: v4(), startTime: "09:00", endTime: "09:30", selected: true },
            { id: v4(), startTime: "09:30", endTime: "10:00", selected: false },
            { id: v4(), startTime: "10:00", endTime: "10:30", selected: true },
            { id: v4(), startTime: "10:30", endTime: "11:00", selected: false },
            { id: v4(), startTime: "11:00", endTime: "11:30", selected: true },
            { id: v4(), startTime: "11:30", endTime: "12:00", selected: false },
          ],
        },
        {
          date: today.add(2, "day").format("YYYY-MM-DD"),
          dayOfWeek: today.add(2, "day").format("ddd"),
          slots: [
            { id: v4(), startTime: "08:00", endTime: "08:30", selected: false },
            { id: v4(), startTime: "08:30", endTime: "09:00", selected: true },
            { id: v4(), startTime: "09:00", endTime: "09:30", selected: true },
            { id: v4(), startTime: "09:30", endTime: "10:00", selected: false },
            { id: v4(), startTime: "10:00", endTime: "10:30", selected: true },
            { id: v4(), startTime: "10:30", endTime: "11:00", selected: true },
            { id: v4(), startTime: "11:00", endTime: "11:30", selected: false },
            { id: v4(), startTime: "11:30", endTime: "12:00", selected: true },
          ],
        },
        {
          date: today.add(3, "day").format("YYYY-MM-DD"),
          dayOfWeek: today.add(3, "day").format("ddd"),
          slots: [
            { id: v4(), startTime: "08:00", endTime: "08:30", selected: true },
            { id: v4(), startTime: "08:30", endTime: "09:00", selected: true },
            { id: v4(), startTime: "09:00", endTime: "09:30", selected: true },
            { id: v4(), startTime: "09:30", endTime: "10:00", selected: false },
            { id: v4(), startTime: "10:00", endTime: "10:30", selected: true },
            { id: v4(), startTime: "10:30", endTime: "11:00", selected: false },
            { id: v4(), startTime: "11:00", endTime: "11:30", selected: true },
            { id: v4(), startTime: "11:30", endTime: "12:00", selected: true },
          ],
        },
      ],
      price: 150000,
      configName: "Khám thường - Buổi sáng",
    },
    {
      id: v4(),
      slotDuration: 45,
      workStartTime: today.set("hour", 13).set("minute", 0),
      workEndTime: today.set("hour", 17).set("minute", 0),
      selectedDates: [
        today.add(1, "day"),
        today.add(4, "day"),
        today.add(5, "day"),
      ],
      daySchedules: [
        {
          date: today.add(1, "day").format("YYYY-MM-DD"),
          dayOfWeek: today.add(1, "day").format("ddd"),
          slots: [
            { id: v4(), startTime: "13:00", endTime: "13:45", selected: true },
            { id: v4(), startTime: "13:45", endTime: "14:30", selected: false },
            { id: v4(), startTime: "14:30", endTime: "15:15", selected: true },
            { id: v4(), startTime: "15:15", endTime: "16:00", selected: true },
            { id: v4(), startTime: "16:00", endTime: "16:45", selected: false },
            { id: v4(), startTime: "16:45", endTime: "17:00", selected: true },
          ],
        },
        {
          date: today.add(4, "day").format("YYYY-MM-DD"),
          dayOfWeek: today.add(4, "day").format("ddd"),
          slots: [
            { id: v4(), startTime: "13:00", endTime: "13:45", selected: false },
            { id: v4(), startTime: "13:45", endTime: "14:30", selected: true },
            { id: v4(), startTime: "14:30", endTime: "15:15", selected: true },
            { id: v4(), startTime: "15:15", endTime: "16:00", selected: false },
            { id: v4(), startTime: "16:00", endTime: "16:45", selected: true },
            { id: v4(), startTime: "16:45", endTime: "17:00", selected: true },
          ],
        },
        {
          date: today.add(5, "day").format("YYYY-MM-DD"),
          dayOfWeek: today.add(5, "day").format("ddd"),
          slots: [
            { id: v4(), startTime: "13:00", endTime: "13:45", selected: true },
            { id: v4(), startTime: "13:45", endTime: "14:30", selected: true },
            { id: v4(), startTime: "14:30", endTime: "15:15", selected: false },
            { id: v4(), startTime: "15:15", endTime: "16:00", selected: true },
            { id: v4(), startTime: "16:00", endTime: "16:45", selected: true },
            { id: v4(), startTime: "16:45", endTime: "17:00", selected: false },
          ],
        },
      ],
      price: 200000,
      configName: "Khám chuyên sâu - Buổi chiều",
    },
    {
      id: v4(),
      slotDuration: 60,
      workStartTime: today.set("hour", 18).set("minute", 0),
      workEndTime: today.set("hour", 21).set("minute", 0),
      selectedDates: [today.add(6, "day"), today.add(7, "day")],
      daySchedules: [
        {
          date: today.add(6, "day").format("YYYY-MM-DD"),
          dayOfWeek: today.add(6, "day").format("ddd"),
          slots: [
            { id: v4(), startTime: "18:00", endTime: "19:00", selected: true },
            { id: v4(), startTime: "19:00", endTime: "20:00", selected: false },
            { id: v4(), startTime: "20:00", endTime: "21:00", selected: true },
          ],
        },
        {
          date: today.add(7, "day").format("YYYY-MM-DD"),
          dayOfWeek: today.add(7, "day").format("ddd"),
          slots: [
            { id: v4(), startTime: "18:00", endTime: "19:00", selected: false },
            { id: v4(), startTime: "19:00", endTime: "20:00", selected: true },
            { id: v4(), startTime: "20:00", endTime: "21:00", selected: true },
          ],
        },
      ],
      price: 300000,
      configName: "Khám ngoài giờ - Buổi tối",
    },
  ];

  return fakeConfigs;
};
export const DoctorScheduleModal = forwardRef<DoctorScheduleRef, IProps>(
  ({}, ref) => {
    const [visible, setVisible] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();
    const [modal, modalElement] = Modal.useModal();
    const [form] = Form.useForm();
    const [scheduleConfigs, setScheduleConfigs] = useState<ScheduleConfig[]>([
      {
        id: v4(),
        slotDuration: 30,
        workStartTime: dayjs().set("hour", 8).set("minute", 0),
        workEndTime: dayjs().set("hour", 17).set("minute", 0),
        selectedDates: [],
        daySchedules: [],
        price: 0,
        configName: "Cấu hình 1",
      },
    ]);
    const [showValidation, setShowValidation] = useState(false);

    const setLoading = useSetAtom(loadingAtom);
    const [modalType, setModalType] = useState<"create" | "update">("create");

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
        config.configName.trim() !== "" &&
        config.selectedDates.length > 0 &&
        config.price > 0 &&
        hasSelectedSlotsForAllDays
      );
    }, []);

    // Kiểm tra tất cả config có hợp lệ không
    const areAllConfigsValid = useCallback((): boolean => {
      return scheduleConfigs.every((config) => isConfigValid(config));
    }, [scheduleConfigs, isConfigValid]);

    // Kiểm tra config cuối cùng có hợp lệ không (dùng cho thêm tiếp)
    const isLastConfigValid = useCallback((): boolean => {
      if (scheduleConfigs.length === 0) return false;
      const lastConfig = scheduleConfigs[scheduleConfigs.length - 1];
      return isConfigValid(lastConfig);
    }, [scheduleConfigs, isConfigValid]);

    // Hàm tạo timeline slots với useCallback để tối ưu performance
    const generateTimeSlots = useCallback(
      (startTime: Dayjs, endTime: Dayjs, duration: number): TimeSlot[] => {
        const slots: TimeSlot[] = [];
        let currentTime = startTime;

        while (currentTime.isBefore(endTime)) {
          const slotEndTime = currentTime.add(duration, "minute");
          if (slotEndTime.isAfter(endTime)) break;

          slots.push({
            id: v4(),
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

    // Cập nhật schedules cho một config - GIỮ LẠI THÔNG TIN ĐÃ CHỌN
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
            // Giữ lại thông tin slots đã chọn nếu ngày đã tồn tại
            return existingDay;
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

    // Xử lý khi chọn nhiều ngày cho một config - GIỮ LẠI SLOTS ĐÃ CHỌN
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

    // Xử lý khi thay đổi slot duration - CẬP NHẬT SLOTS MÀ VẪN GIỮ TRẠNG THÁI CHỌN
    const handleSlotDurationChange = (configId: string, value: number) => {
      setScheduleConfigs((prev) =>
        prev.map((config) => {
          if (config.id !== configId) return config;

          if (config.selectedDates.length === 0) {
            return { ...config, slotDuration: value };
          }

          // Tạo slots mới với duration mới, nhưng giữ lại trạng thái selected nếu có
          const updatedSchedules = config.daySchedules.map((daySchedule) => {
            const newSlots = generateTimeSlots(
              config.workStartTime,
              config.workEndTime,
              value
            );

            // Giữ lại trạng thái selected từ slots cũ nếu có
            const oldSelectedSlots = daySchedule.slots.filter(
              (slot) => slot.selected
            );
            if (oldSelectedSlots.length > 0) {
              newSlots.forEach((newSlot) => {
                const wasSelected = oldSelectedSlots.some(
                  (oldSlot) =>
                    oldSlot.startTime === newSlot.startTime &&
                    oldSlot.endTime === newSlot.endTime
                );
                if (wasSelected) {
                  newSlot.selected = true;
                }
              });
            }

            return {
              ...daySchedule,
              slots: newSlots,
            };
          });

          return {
            ...config,
            slotDuration: value,
            daySchedules: updatedSchedules,
          };
        })
      );
    };

    // Xử lý khi thay đổi giờ làm việc - SỬ DỤNG RANGE PICKER
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

          // Tạo slots mới với giờ làm việc mới, nhưng giữ lại trạng thái selected nếu có
          const updatedSchedules = config.daySchedules.map((daySchedule) => {
            const newSlots = generateTimeSlots(
              startTime,
              endTime,
              config.slotDuration
            );

            // Giữ lại trạng thái selected từ slots cũ nếu có
            const oldSelectedSlots = daySchedule.slots.filter(
              (slot) => slot.selected
            );
            if (oldSelectedSlots.length > 0) {
              newSlots.forEach((newSlot) => {
                const wasSelected = oldSelectedSlots.some(
                  (oldSlot) =>
                    oldSlot.startTime === newSlot.startTime &&
                    oldSlot.endTime === newSlot.endTime
                );
                if (wasSelected) {
                  newSlot.selected = true;
                }
              });
            }

            return {
              ...daySchedule,
              slots: newSlots,
            };
          });

          return {
            ...config,
            workStartTime: startTime,
            workEndTime: endTime,
            daySchedules: updatedSchedules,
          };
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

    // Xử lý chọn/bỏ chọn slot
    const handleSlotToggle = (
      configId: string,
      date: string,
      slotId: string
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
                    slots: day.slots.map((slot) =>
                      slot.id === slotId
                        ? { ...slot, selected: !slot.selected }
                        : slot
                    ),
                  }
                : day
            ),
          };
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
      if (!isLastConfigValid()) {
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
        configName: `Cấu hình ${scheduleConfigs.length + 1}`,
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
        content: `Bạn có chắc chắn muốn xóa cấu hình "${configToRemove.configName}" ?`,
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
    const onFinish = (values: any) => {
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
          configName: config.configName,
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
                  startTime: slot.startTime,
                  endTime: slot.endTime,
                  selected: slot.selected,
                };
              }),
            };
          }),
          selectedDates: config.selectedDates.map((day) =>
            day.format("YYYY-MM-DD")
          ),
        };
      });

      console.log("slots", slots);

      messageApi.success("Cấu hình lịch làm việc thành công!");

      // Reset validation sau khi submit thành công
      setShowValidation(false);
    };

    const onFinishFailed = (errorInfo: any) => {
      console.log("Failed:", errorInfo);
      setShowValidation(true);
      messageApi.error("Vui lòng kiểm tra lại thông tin!");
    };

    const showModal = (
      doctor: IResponseGetUsersDepartment,
      type: "create" | "update"
    ) => {
      setVisible(true);
      // Reset form khi mở modal
      form.resetFields();

      const fakeConfigs = generateFakeData();
      setScheduleConfigs(fakeConfigs);

      setShowValidation(false); // Tắt validate khi mở modal
    };

    const hideModal = () => {
      setVisible(false);
      setShowValidation(false); // Tắt validate khi đóng modal
    };

    useImperativeHandle(ref, () => ({
      showModal,
      hideModal,
    }));

    // Component cho một config
    const renderScheduleConfig = (config: ScheduleConfig) => {
      const isValid = isConfigValid(config);
      const shouldShowValidation = showValidation && !isValid;
      const hasUnselectedDays = config.daySchedules.some(
        (day) => !day.slots.some((slot) => slot.selected)
      );

      return (
        <Card
          key={config.id}
          title={
            <Space>
              {config.configName}
              {shouldShowValidation && (
                <Badge
                  status="error"
                  text="Chưa hoàn thành"
                  style={{ color: "#ff4d4f", fontSize: "12px" }}
                />
              )}
            </Space>
          }
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
                  maxTagCount="responsive"
                  defaultValue={config.selectedDates}
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

          {/* Timeline slots */}
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
                        <Col span={24} key={daySchedule.date}>
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
                                  key={slot.id}
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
            maxHeight: "80vh",
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
