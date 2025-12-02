import { MedicineBoxOutlined } from "@ant-design/icons";
import {
  Modal,
  Space,
  Form,
  Input,
  Select,
  Row,
  Col,
  message,
  InputNumber,
  DatePicker,
  Switch,
} from "antd";
import type dayjs from "dayjs";
import React, { useState } from "react";

interface Medicine {
  id: number;
  name: string;
  brand?: string;
  dosage: number;
  unit: string;
  quantity: number;
  frequency: string;
  duration: string;
  mealTime?: string;
  instruction?: string;
  note?: string;
  startDate?: dayjs.Dayjs;
  endDate?: dayjs.Dayjs;
  hasRefill?: boolean;
  isGeneric?: boolean;
  requiresPrescription?: boolean;
}

interface AddMedicineModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (medicine: Medicine) => void;
  editingMedicine: Medicine | null;
}
const { TextArea } = Input;
const { Option } = Select;

// Component con cho popup thêm đơn thuốc
const AddMedicineModal: React.FC<AddMedicineModalProps> = ({
  visible,
  onClose,
  onSave,
  editingMedicine,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  // Khởi tạo form với dữ liệu nếu đang edit
  React.useEffect(() => {
    if (visible) {
      if (editingMedicine) {
        form.setFieldsValue(editingMedicine);
      } else {
        form.resetFields();
      }
    }
  }, [visible, editingMedicine, form]);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();

      // Giả lập delay
      setTimeout(() => {
        onSave(values as Medicine);
        form.resetFields();
        setLoading(false);
        onClose();
        message.success(
          editingMedicine
            ? "Cập nhật thuốc thành công!"
            : "Thêm thuốc mới thành công!"
        );
      }, 500);
    } catch (error) {
      setLoading(false);
      message.error("Vui lòng kiểm tra lại thông tin!");
    }
  };

  const frequencyOptions = [
    { value: "1 lần/ngày", label: "1 lần/ngày" },
    { value: "2 lần/ngày", label: "2 lần/ngày" },
    { value: "3 lần/ngày", label: "3 lần/ngày" },
    { value: "4 lần/ngày", label: "4 lần/ngày" },
    { value: "Mỗi 6 giờ", label: "Mỗi 6 giờ" },
    { value: "Mỗi 8 giờ", label: "Mỗi 8 giờ" },
    { value: "Mỗi 12 giờ", label: "Mỗi 12 giờ" },
    { value: "Khi cần", label: "Khi cần" },
  ];

  const mealOptions = [
    { value: "Trước ăn", label: "Trước ăn" },
    { value: "Sau ăn", label: "Sau ăn" },
    { value: "Trong bữa ăn", label: "Trong bữa ăn" },
    { value: "Không quan trọng", label: "Không quan trọng" },
  ];

  const unitOptions = [
    { value: "mg", label: "mg" },
    { value: "g", label: "g" },
    { value: "ml", label: "ml" },
    { value: "viên", label: "viên" },
    { value: "ống", label: "ống" },
    { value: "gói", label: "gói" },
  ];

  return (
    <Modal
      title={
        <Space>
          <MedicineBoxOutlined />
          <span>{editingMedicine ? "Chỉnh sửa thuốc" : "Thêm thuốc mới"}</span>
        </Space>
      }
      open={visible}
      onCancel={onClose}
      onOk={handleSubmit}
      confirmLoading={loading}
      okText={editingMedicine ? "Cập nhật" : "Thêm"}
      cancelText="Hủy"
      width={600}
      styles={{
        body: {
          paddingTop: "16px",
          paddingBottom: "16px",
        },
      }}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          quantity: 1,
          hasRefill: false,
        }}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="name"
              label="Tên thuốc"
              rules={[{ required: true, message: "Vui lòng nhập tên thuốc" }]}
            >
              <Input placeholder="Ví dụ: Paracetamol" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="brand" label="Nhãn hiệu">
              <Input placeholder="Ví dụ: Panadol" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              name="dosage"
              label="Liều lượng"
              rules={[{ required: true, message: "Vui lòng nhập liều lượng" }]}
            >
              <InputNumber
                style={{ width: "100%" }}
                placeholder="500"
                min={0}
                addonAfter={
                  <Form.Item name="unit" noStyle>
                    <Select style={{ width: 80 }} defaultValue="mg">
                      {unitOptions.map((unit) => (
                        <Option key={unit.value} value={unit.value}>
                          {unit.label}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                }
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="quantity"
              label="Số lượng"
              rules={[{ required: true, message: "Vui lòng nhập số lượng" }]}
            >
              <InputNumber
                style={{ width: "100%" }}
                placeholder="10"
                min={1}
                addonAfter="cái"
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="frequency"
              label="Tần suất"
              rules={[{ required: true, message: "Vui lòng chọn tần suất" }]}
            >
              <Select placeholder="Chọn tần suất">
                {frequencyOptions.map((freq) => (
                  <Option key={freq.value} value={freq.value}>
                    {freq.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="duration"
              label="Thời gian dùng"
              rules={[
                { required: true, message: "Vui lòng nhập thời gian dùng" },
              ]}
            >
              <Input placeholder="Ví dụ: 7 ngày" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="mealTime" label="Thời điểm uống">
              <Select placeholder="Chọn thời điểm">
                {mealOptions.map((meal) => (
                  <Option key={meal.value} value={meal.value}>
                    {meal.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="startDate" label="Ngày bắt đầu">
              <DatePicker style={{ width: "100%" }} format="DD/MM/YYYY" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="endDate" label="Ngày kết thúc">
              <DatePicker style={{ width: "100%" }} format="DD/MM/YYYY" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item name="instruction" label="Hướng dẫn sử dụng">
          <TextArea
            rows={3}
            placeholder="Ví dụ: Uống với nhiều nước, không uống khi đói..."
          />
        </Form.Item>

        <Form.Item name="note" label="Ghi chú đặc biệt">
          <TextArea
            rows={2}
            placeholder="Ví dụ: Không dùng cho phụ nữ có thai..."
          />
        </Form.Item>

        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              name="hasRefill"
              label="Được tái kê"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="isGeneric"
              label="Thuốc generic"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="requiresPrescription"
              label="Cần kê đơn"
              valuePropName="checked"
              initialValue={true}
            >
              <Switch />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default AddMedicineModal;
