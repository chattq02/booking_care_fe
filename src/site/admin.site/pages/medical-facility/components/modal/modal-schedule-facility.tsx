import { forwardRef, useImperativeHandle, useState } from "react";
import { Modal, Button, Form, TimePicker, Select, Flex } from "antd";
import { Dayjs } from "dayjs";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { useUpdateScheduleFacility } from "../../hooks/use-schedule";
import type { ISlots, IWorkSchedule } from "../../type";
import { v4 } from "uuid";
import { useSetAtom } from "jotai";
import { loadingAtom } from "@/stores/loading";
import {
  convertDataToFormValues,
  convertFormValuesToSlots,
  mergeEditIntoDetail,
} from "../../helper";

export interface WorkShift {
  session: "morning" | "afternoon" | "evening";
  range: [Dayjs | null, Dayjs | null];
}

export interface HospitalScheduleFormValues {
  dayOfWeek: string[];
  workShifts: WorkShift[];
}

export interface HospitalScheduleRef {
  showModal: (
    data?: ISlots | undefined,
    type_modal?: "create" | "edit"
  ) => void;
  hideModal: () => void;
}

interface IProps {
  id_schedule: number | undefined;
  slots_detail: ISlots | undefined;
}

const { Option } = Select;

export const HospitalScheduleModal = forwardRef<HospitalScheduleRef, IProps>(
  ({ id_schedule, slots_detail }, ref) => {
    const [visible, setVisible] = useState(false);
    const [form] = Form.useForm<HospitalScheduleFormValues>();
    const update = useUpdateScheduleFacility({ id_schedule });
    const setLoading = useSetAtom(loadingAtom);
    const [modalType, setModalType] = useState<"create" | "edit">("create");

    const showModal = (
      data: ISlots | undefined,
      type_modal?: "create" | "edit"
    ) => {
      setVisible(true);
      setModalType(type_modal || "create");
      if (type_modal === "edit") {
        const formValues = convertDataToFormValues(data);
        form.setFieldsValue(formValues);
      } else {
        form.resetFields();
      }
    };

    const hideModal = () => setVisible(false);

    useImperativeHandle(ref, () => ({
      showModal,
      hideModal,
    }));

    const onFinish = (values: HospitalScheduleFormValues) => {
      const slotsByDay = convertFormValuesToSlots(values);

      const schedule = mergeEditIntoDetail(slots_detail, slotsByDay);

      const dataSave: IWorkSchedule = {
        type: "FACILITY",
        slots: schedule,
        status: "NORMAL",
      };
      setLoading(true);
      update.mutate(dataSave, {
        onSuccess: () => {
          hideModal();
          setLoading(false);
        },
        onError: () => {
          setLoading(false);
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
            workShifts: [],
          }}
        >
          <Form.Item
            name="dayOfWeek"
            label="Thứ trong tuần"
            rules={[{ required: true, message: "Vui lòng chọn thứ" }]}
          >
            <Select
              mode="multiple"
              placeholder="Chọn thứ"
              disabled={modalType === "edit"}
            >
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
                    style={{
                      width: "100%",
                    }}
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
