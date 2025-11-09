import React, { forwardRef, useImperativeHandle, useState } from "react";
import {
  Modal,
  Button,
  Form,
  InputNumber,
  TimePicker,
  DatePicker,
  Space,
} from "antd";
import dayjs, { Dayjs } from "dayjs";

const { RangePicker } = DatePicker;
const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

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
        width={"80vw"}
        style={{ top: 50 }}
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
          initialValues={{ slotDuration: 30, workTime: {}, dayOff: [] }}
        >
          <Form.Item
            name="slotDuration"
            label="Thời lượng mỗi slot (phút)"
            rules={[{ required: true, message: "Nhập thời lượng slot" }]}
          >
            <InputNumber min={5} max={240} />
          </Form.Item>

          <Form.Item label="Giờ làm việc hàng tuần">
            {daysOfWeek.map((day) => (
              <Form.Item
                key={day}
                label={day}
                style={{ marginBottom: 8 }}
                name={["workTime", day]}
              >
                <Space direction="vertical">
                  <Form.List name={["workTime", day]}>
                    {(fields, { add, remove }) => (
                      <>
                        {fields.map((field) => (
                          <Space key={field.key}>
                            <Form.Item
                              {...field}
                              name={[field.name, "start"]}
                              rules={[{ required: true }]}
                            >
                              <TimePicker format="HH:mm" />
                            </Form.Item>
                            <Form.Item
                              {...field}
                              name={[field.name, "end"]}
                              rules={[{ required: true }]}
                            >
                              <TimePicker format="HH:mm" />
                            </Form.Item>
                            <Button
                              type="link"
                              onClick={() => remove(field.name)}
                            >
                              Xóa
                            </Button>
                          </Space>
                        ))}
                        <Button
                          type="dashed"
                          onClick={() => add()}
                          style={{ marginTop: 4 }}
                        >
                          Thêm khung giờ
                        </Button>
                      </>
                    )}
                  </Form.List>
                </Space>
              </Form.Item>
            ))}
          </Form.Item>

          <Form.Item name="dayOff" label="Ngày nghỉ bệnh viện">
            <RangePicker />
          </Form.Item>
        </Form>
      </Modal>
    );
  }
);
