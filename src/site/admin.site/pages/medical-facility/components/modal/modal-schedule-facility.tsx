import { forwardRef, useImperativeHandle, useState } from "react";
import { Modal, Button, Form, TimePicker, Select, Flex } from "antd";
import dayjs, { Dayjs } from "dayjs";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { useUpdateScheduleFacility } from "../../hooks/use-schedule";
import type { ISlots, IWorkSchedule } from "../../type";
import { v4 } from "uuid";

interface WorkShift {
  session: "morning" | "afternoon" | "evening";
  range: [Dayjs | null, Dayjs | null];
}

interface HospitalScheduleFormValues {
  dayOfWeek: string[];
  workShifts: WorkShift[];
}

export interface HospitalScheduleRef {
  showModal: (data: ISlots | undefined) => void;
  hideModal: () => void;
}

interface IProps {}

const { Option } = Select;

export const HospitalScheduleModal = forwardRef<HospitalScheduleRef, IProps>(
  ({}, ref) => {
    const [visible, setVisible] = useState(false);
    const [form] = Form.useForm<HospitalScheduleFormValues>();

    const update = useUpdateScheduleFacility();

    const showModal = (data: ISlots | undefined) => {
      setVisible(true);
      const formValues = convertDataToFormValues(data);
      form.setFieldsValue(formValues);
    };

    // Convert ISlots to form values
    const convertDataToFormValues = (
      data: ISlots | undefined
    ): HospitalScheduleFormValues => {
      console.log("data", data);
      if (!data) {
        return {
          dayOfWeek: [],
          workShifts: [
            {
              session: "morning",
              range: [dayjs("08:00", "HH:mm"), dayjs("12:00", "HH:mm")],
            },
            {
              session: "afternoon",
              range: [dayjs("13:30", "HH:mm"), dayjs("17:30", "HH:mm")],
            },
          ],
        };
      }

      // Lấy các ngày có dữ liệu
      const daysWithData = Object.entries(data)
        .filter(([_, sessions]) => sessions.length > 0)
        .map(([day]) => day);

      // Tạo workShifts từ dữ liệu mẫu (lấy từ thứ 2)
      const workShifts: WorkShift[] = data.monday.map((session) => ({
        session: session.session as "morning" | "afternoon" | "evening",
        range: [
          dayjs(session.startTime, "HH:mm"),
          dayjs(session.endTime, "HH:mm"),
        ] as [Dayjs, Dayjs],
      }));

      return {
        dayOfWeek: daysWithData,
        workShifts:
          workShifts.length > 0
            ? workShifts
            : [
                {
                  session: "morning",
                  range: [dayjs("08:00", "HH:mm"), dayjs("12:00", "HH:mm")],
                },
                {
                  session: "afternoon",
                  range: [dayjs("13:30", "HH:mm"), dayjs("17:30", "HH:mm")],
                },
              ],
      };
    };

    const hideModal = () => setVisible(false);

    useImperativeHandle(ref, () => ({
      showModal,
      hideModal,
    }));

    const onFinish = (values: HospitalScheduleFormValues) => {
      // Tạo object schedule với tất cả các ngày đều là mảng rỗng
      const schedule: ISlots = {
        monday: [],
        tuesday: [],
        wednesday: [],
        thursday: [],
        friday: [],
        saturday: [],
        sunday: [],
      };

      // Chỉ thêm dữ liệu cho những ngày được chọn
      values.dayOfWeek.forEach((day) => {
        schedule[day] = values.workShifts.map((shift) => ({
          startTime: shift.range[0]?.format("HH:mm") || "",
          endTime: shift.range[1]?.format("HH:mm") || "",
          session: shift.session,
        }));
      });

      const dataSave: IWorkSchedule = {
        type: "FACILITY",
        slots: schedule,
        status: "NORMAL",
      };

      update.mutate(dataSave, {
        onSuccess: () => {
          hideModal();
        },
      });
    };

    return (
      <Modal
        title="Cấu hình lịch làm việc bệnh viện"
        open={visible}
        onCancel={hideModal}
        width={500}
        styles={{
          body: { maxHeight: "70vh", overflowY: "auto" },
        }}
        footer={[
          <Button key="cancel" onClick={hideModal}>
            Hủy
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={() => form.submit()} // submit form khi click
          >
            Lưu cấu hình
          </Button>,
        ]}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            dayOfWeek: [],
            workShifts: [
              {
                session: "morning",
                range: [dayjs("09:00", "HH:mm"), dayjs("10:00", "HH:mm")],
              },
            ],
          }}
        >
          <Form.Item
            name="dayOfWeek"
            label="Thứ trong tuần"
            rules={[{ required: true, message: "Vui lòng chọn thứ" }]}
          >
            <Select mode="multiple" placeholder="Chọn thứ">
              {[
                { value: "monday", label: "Thứ 2" },
                { value: "tuesday", label: "Thứ 3" },
                { value: "wednesday", label: "Thứ 4" },
                { value: "thursday", label: "Thứ 5" },
                { value: "friday", label: "Thứ 6" },
                { value: "saturday", label: "Thứ 7" },
                { value: "sunday", label: "Chủ nhật" },
              ].map((day) => (
                <Option key={day.value} value={day.value}>
                  {day.label}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.List name="workShifts">
            {(fields, { add, remove }) => (
              <>
                {fields.map((field, _) => (
                  <Flex
                    key={field.key}
                    align="center"
                    gap={20}
                    style={{
                      width: "100%",
                    }}
                  >
                    <Form.Item
                      {...field}
                      key={v4()}
                      name={[field.name, "session"]}
                      label="Ca làm việc"
                      style={{
                        width: 100,
                      }}
                    >
                      <Select
                        placeholder="Chọn ca"
                        disabled={true}
                        options={[
                          { value: "morning", label: "Ca sáng" },
                          { value: "afternoon", label: "Ca chiều" },
                          { value: "evening", label: "Ca tối" },
                        ]}
                      />
                    </Form.Item>

                    <Form.Item
                      {...field}
                      key={v4()}
                      name={[field.name, "range"]}
                      label="Giờ bắt đầu"
                      rules={[
                        {
                          required: true,
                          message: "",
                        },
                      ]}
                      style={{
                        flex: 1,
                      }}
                    >
                      <TimePicker.RangePicker
                        format="HH:mm"
                        needConfirm={false}
                        placeholder={["Bắt đầu", "Kết thúc"]}
                      />
                    </Form.Item>

                    <Button
                      style={{
                        marginTop: 8,
                      }}
                      danger
                      type="text"
                      icon={<DeleteOutlined />}
                      onClick={() => remove(field.name)}
                    />
                  </Flex>
                ))}

                {fields.length < 3 && (
                  <Button
                    type="dashed"
                    icon={<PlusOutlined />}
                    onClick={() =>
                      add({
                        session:
                          fields.length === 0
                            ? "morning"
                            : fields.length === 1
                            ? "afternoon"
                            : "evening",
                        start: null,
                        end: null,
                      })
                    }
                  >
                    Thêm ca làm việc
                  </Button>
                )}
              </>
            )}
          </Form.List>
        </Form>
      </Modal>
    );
  }
);
