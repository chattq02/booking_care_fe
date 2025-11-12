import { forwardRef, useImperativeHandle, useState } from "react";
import { Modal, Button, Form, TimePicker, Select, Flex } from "antd";
import dayjs, { Dayjs } from "dayjs";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { toast } from "sonner";
import { useUpdateScheduleFacility } from "../../hooks/use-schedule";
import type { IWorkSchedule } from "../../type";

interface WorkShift {
  session: string;
  range: [Dayjs | null, Dayjs | null];
}

interface HospitalScheduleFormValues {
  dayOfWeek: number;
  workShifts: WorkShift[];
}

export interface HospitalScheduleRef {
  showModal: () => void;
  hideModal: () => void;
}

interface IProps {}

const { Option } = Select;

export const HospitalScheduleModal = forwardRef<HospitalScheduleRef, IProps>(
  ({}, ref) => {
    const [visible, setVisible] = useState(false);
    const [form] = Form.useForm<HospitalScheduleFormValues>();

    const update = useUpdateScheduleFacility();

    const showModal = () => {
      form.resetFields();
      setVisible(true);
    };

    const hideModal = () => setVisible(false);

    useImperativeHandle(ref, () => ({
      showModal,
      hideModal,
    }));

    const onFinish = (values: HospitalScheduleFormValues) => {
      const formattedShifts = values.workShifts.map((shift) => ({
        session: shift.session,
        start: shift.range[0]?.format("HH:mm") || "",
        end: shift.range[1]?.format("HH:mm") || "",
      }));

      // const dataSave = {
      //   dayOfWeek: values.dayOfWeek,
      //   workShifts: formattedShifts,
      // };

      const schedule: IWorkSchedule = {
        all: [
          { startTime: "09:00", endTime: "12:00", session: "morning" },
          { startTime: "13:00", endTime: "17:00", session: "afternoon" },
          { startTime: "18:00", endTime: "22:00", session: "evening" },
        ],
      };

      const dataSave = {
        type: "FACILITY",
        slots: schedule,
        status: "NORMAL",
      };

      update.mutate(dataSave, {
        onSuccess: () => {
          hideModal();
        },
      });
      console.log("dataSave", dataSave);
      // setVisible(false);
    };

    return (
      <Modal
        title="Cấu hình lịch làm việc bệnh viện"
        open={visible}
        onCancel={hideModal}
        // width={500}
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
            dayOfWeek: "all",
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
            <Select placeholder="Chọn thứ">
              {[
                { value: "all", label: "Tất cả" },
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
