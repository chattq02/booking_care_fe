import { forwardRef, useImperativeHandle, useState } from "react";
import { Modal, Button, Form, TimePicker, Space, Select, Flex } from "antd";
import dayjs, { Dayjs } from "dayjs";
import {
  ArrowRightOutlined,
  DeleteOutlined,
  PlusOutlined,
} from "@ant-design/icons";

interface WorkTimeRange {
  start: string; // "HH:mm"
  end: string; // "HH:mm"
}

interface HospitalScheduleFormValues {
  slotDuration: number;
  workTime: Record<string, WorkTimeRange[]>;
  dayOff: Dayjs[]; // dùng Dayjs từ DatePicker
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
      // Chuyển dayjs thành string "YYYY-MM-DD"
      const formattedDayOff = values.dayOff.map((d) => d.format("YYYY-MM-DD"));

      const payload = {
        slotDuration: values.slotDuration,
        workTime: values.workTime,
        dayOff: formattedDayOff,
      };

      console.log("JSON ready to send:", JSON.stringify(payload, null, 2));
      setVisible(false);
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
          initialValues={{
            dayOfWeek: "Thứ 2",
            type: "Lịch khám",
            start: dayjs("09:00", "HH:mm"),
            end: dayjs("10:00", "HH:mm"),
            slotCount: 1,
            slotDuration: 30,
            maxDay: 30,
            active: true,
          }}
        >
          <Form.Item
            name="dayOfWeek"
            label="Thứ trong tuần"
            rules={[{ required: true, message: "Vui lòng chọn thứ" }]}
          >
            <Select placeholder="Chọn thứ">
              {[
                "Thứ 2",
                "Thứ 3",
                "Thứ 4",
                "Thứ 5",
                "Thứ 6",
                "Thứ 7",
                "Chủ nhật",
              ].map((day) => (
                <Option key={day} value={day}>
                  {day}
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
                    >
                      <Select
                        placeholder="Chọn ca"
                        style={{
                          width: 120,
                        }}
                        disabled={true}
                        options={[
                          { value: "morning", label: "Ca sáng" },
                          { value: "afternoon", label: "Ca chiều" },
                          { value: "evening", label: "Ca tối" },
                        ]}
                      />
                    </Form.Item>

                    <Space align="center" style={{ flex: 1, width: "100%" }}>
                      <Form.Item
                        {...field}
                        name={[field.name, "start"]}
                        label="Giờ bắt đầu"
                        rules={[
                          {
                            required: true,
                            message: "",
                          },
                        ]}
                      >
                        <TimePicker format="HH:mm" placeholder="HH:mm" />
                      </Form.Item>

                      <ArrowRightOutlined />

                      <Form.Item
                        {...field}
                        name={[field.name, "end"]}
                        label="Giờ kết thúc"
                        rules={[
                          {
                            required: true,
                            message: "",
                          },
                        ]}
                      >
                        <TimePicker format="HH:mm" placeholder="HH:mm" />
                      </Form.Item>

                      <Button
                        danger
                        type="text"
                        icon={<DeleteOutlined />}
                        onClick={() => remove(field.name)}
                      />
                    </Space>
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
