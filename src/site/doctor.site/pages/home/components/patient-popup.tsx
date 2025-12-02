import React, { useState, forwardRef, useImperativeHandle } from "react";
import {
  Modal,
  Descriptions,
  Button,
  Tag,
  Typography,
  Space,
  Avatar,
  Form,
  Input,
  Select,
  Divider,
  Tabs,
  Table,
  Row,
  Col,
  message,
  Card,
  Collapse,
  Badge,
  InputNumber,
  DatePicker,
  Switch,
} from "antd";
import {
  UserOutlined,
  MedicineBoxOutlined,
  FileTextOutlined,
  ClockCircleOutlined,
  PhoneOutlined,
  MailOutlined,
  CloseCircleOutlined,
  SaveOutlined,
  PrinterOutlined,
  FullscreenOutlined,
  FullscreenExitOutlined,
  HistoryOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;
const { TabPane } = Tabs;
const { Panel } = Collapse;

// Component con cho popup thêm đơn thuốc
const AddMedicineModal = ({ visible, onClose, onSave, editingMedicine }) => {
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
        onSave(values);
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

const PatientPopup = forwardRef((props, ref) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [patient, setPatient] = useState(null);
  const [form] = Form.useForm();
  const [conclusion, setConclusion] = useState("");
  const [prescription, setPrescription] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddMedicine, setShowAddMedicine] = useState(false);
  const [editingMedicine, setEditingMedicine] = useState(null);

  // Dữ liệu mẫu cho đơn thuốc
  const sampleMedicines = [
    {
      id: 1,
      name: "Paracetamol",
      brand: "Panadol",
      dosage: 500,
      unit: "mg",
      quantity: 20,
      frequency: "3 lần/ngày",
      duration: "7 ngày",
      mealTime: "Sau ăn",
      instruction: "Uống với nhiều nước",
      note: "Giảm đau, hạ sốt",
      startDate: dayjs(),
      endDate: dayjs().add(7, "days"),
      hasRefill: true,
      isGeneric: true,
      requiresPrescription: true,
    },
    {
      id: 2,
      name: "Amoxicillin",
      brand: "Amoxi",
      dosage: 250,
      unit: "mg",
      quantity: 14,
      frequency: "2 lần/ngày",
      duration: "10 ngày",
      mealTime: "Trong bữa ăn",
      instruction: "Uống đủ liệu trình",
      note: "Kháng sinh, hoàn thành liệu trình",
      startDate: dayjs(),
      endDate: dayjs().add(10, "days"),
      hasRefill: false,
      isGeneric: true,
      requiresPrescription: true,
    },
    {
      id: 3,
      name: "Vitamin C",
      brand: "C sủi",
      dosage: 1000,
      unit: "mg",
      quantity: 30,
      frequency: "1 lần/ngày",
      duration: "30 ngày",
      mealTime: "Sau ăn sáng",
      instruction: "Pha với 200ml nước",
      note: "Tăng sức đề kháng",
      startDate: dayjs(),
      endDate: dayjs().add(30, "days"),
      hasRefill: true,
      isGeneric: false,
      requiresPrescription: false,
    },
  ];

  // Dữ liệu mẫu cho lịch sử khám bệnh
  const sampleMedicalHistory = [
    {
      date: "2024-01-15",
      diagnosis: "Viêm họng cấp",
      doctor: "BS. Nguyễn Văn A",
      prescription: "Paracetamol, Amoxicillin",
    },
    {
      date: "2023-11-20",
      diagnosis: "Cảm cúm",
      doctor: "BS. Trần Thị B",
      prescription: "Vitamin C, Thuốc ho",
    },
    {
      date: "2023-09-10",
      diagnosis: "Khám tổng quát",
      doctor: "BS. Lê Văn C",
      prescription: "Không",
    },
  ];

  // Expose functions to parent component
  useImperativeHandle(ref, () => ({
    openPopup: (patientData) => {
      setPatient(patientData);
      setIsVisible(true);
      // Reset form with patient data
      form.setFieldsValue({
        diagnosis: patientData?.diagnosis || "",
        bloodPressure: patientData?.bloodPressure || "120/80 mmHg",
        heartRate: patientData?.heartRate || "75 bpm",
        temperature: patientData?.temperature || "36.5°C",
        weight: patientData?.weight || "65 kg",
        height: patientData?.height || "170 cm",
      });
      setConclusion(patientData?.conclusion || "");
      setPrescription(sampleMedicines);
    },
    closePopup: () => {
      setIsVisible(false);
    },
  }));

  const handleClose = () => {
    setIsVisible(false);
    setPatient(null);
    form.resetFields();
    setConclusion("");
    setPrescription([]);
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();

      // Giả lập lưu dữ liệu
      setTimeout(() => {
        message.success("Đã lưu thông tin khám bệnh thành công!");
        setLoading(false);
      }, 1000);
    } catch (error) {
      setLoading(false);
      message.error("Vui lòng kiểm tra lại thông tin!");
    }
  };

  const handlePrint = () => {
    message.info("Chức năng in đang được phát triển...");
  };

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  // Hàm xử lý thêm/cập nhật thuốc
  const handleSaveMedicine = (medicineData) => {
    if (editingMedicine) {
      // Cập nhật thuốc
      const updatedPrescription = prescription.map((med) =>
        med.id === editingMedicine.id
          ? { ...med, ...medicineData, id: med.id }
          : med
      );
      setPrescription(updatedPrescription);
      setEditingMedicine(null);
    } else {
      // Thêm thuốc mới
      const newMedicine = {
        id: prescription.length + 1,
        ...medicineData,
      };
      setPrescription([...prescription, newMedicine]);
    }
    setShowAddMedicine(false);
  };

  // Hàm xử lý xóa thuốc
  const handleDeleteMedicine = (id) => {
    Modal.confirm({
      title: "Xác nhận xóa",
      content: "Bạn có chắc chắn muốn xóa thuốc này khỏi đơn thuốc?",
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk: () => {
        const newPrescription = prescription.filter((med) => med.id !== id);
        setPrescription(newPrescription);
        message.success("Đã xóa thuốc thành công!");
      },
    });
  };

  // Hàm xử lý chỉnh sửa thuốc
  const handleEditMedicine = (medicine) => {
    setEditingMedicine(medicine);
    setShowAddMedicine(true);
  };

  // Cột cho bảng đơn thuốc
  const medicineColumns = [
    {
      title: "Tên thuốc",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <Space direction="vertical" size={0}>
          <Text strong>{text}</Text>
          {record.brand && (
            <Text type="secondary" style={{ fontSize: "12px" }}>
              {record.brand}
            </Text>
          )}
          {record.isGeneric && (
            <Tag color="blue" size="small">
              Generic
            </Tag>
          )}
        </Space>
      ),
    },
    {
      title: "Liều lượng",
      dataIndex: "dosage",
      key: "dosage",
      render: (dosage, record) => `${dosage} ${record.unit}`,
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
      render: (quantity) => <Tag color="geekblue">{quantity} cái</Tag>,
    },
    {
      title: "Hướng dẫn",
      key: "instruction",
      render: (_, record) => (
        <Space direction="vertical" size={2}>
          <Text>{record.frequency}</Text>
          <Text type="secondary" style={{ fontSize: "12px" }}>
            {record.mealTime} • {record.duration}
          </Text>
          {record.instruction && (
            <Text type="secondary" style={{ fontSize: "12px" }}>
              {record.instruction}
            </Text>
          )}
        </Space>
      ),
    },
    {
      title: "Ghi chú",
      dataIndex: "note",
      key: "note",
      render: (note) => (
        <Text type="secondary" style={{ fontSize: "12px" }}>
          {note}
        </Text>
      ),
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEditMedicine(record)}
          >
            Sửa
          </Button>
          <Button
            type="link"
            danger
            size="small"
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteMedicine(record.id)}
          >
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Modal
        title={
          <Space>
            <MedicineBoxOutlined />
            <span>Hồ sơ bệnh nhân</span>
            {patient && (
              <Badge
                count={patient.status === "waiting" ? "Chờ khám" : "Đang khám"}
                color={patient.status === "waiting" ? "orange" : "green"}
                style={{ marginLeft: 8 }}
              />
            )}
          </Space>
        }
        open={isVisible}
        onCancel={handleClose}
        footer={null}
        width={isFullScreen ? "100vw" : 1400}
        style={
          isFullScreen
            ? {
                top: 0,
                margin: 0,
                maxHeight: "100vh",
              }
            : {}
        }
        bodyStyle={{
          padding: isFullScreen ? "24px" : "16px",
          maxHeight: isFullScreen ? "calc(100vh - 108px)" : "80vh",
          overflow: "auto",
        }}
        destroyOnClose
      >
        {patient && (
          <div>
            {/* Layout với sidebar bên trái và content bên phải */}
            <Row gutter={[24, 24]}>
              {/* Sidebar trái - Thông tin bệnh nhân cố định */}
              <Col xs={24} md={8} lg={6}>
                <div
                  style={{
                    position: isFullScreen ? "sticky" : "relative",
                    top: 0,
                    height: "fit-content",
                  }}
                >
                  <Card
                    size="small"
                    bordered={false}
                    style={{
                      borderRadius: 8,
                      boxShadow: "0 2px 8px rgba(0,0,0,0.09)",
                      marginBottom: 16,
                      background:
                        "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
                    }}
                  >
                    <Row gutter={[16, 16]}>
                      <Col span={24} style={{ textAlign: "center" }}>
                        <Avatar
                          size={96}
                          style={{
                            backgroundColor: patient.avatarColor,
                            border: "4px solid white",
                            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                          }}
                          icon={<UserOutlined />}
                        />
                        <Title level={3} style={{ margin: "16px 0 8px 0" }}>
                          {patient.patientName}
                        </Title>
                        <Tag
                          color={
                            patient.status === "waiting" ? "orange" : "green"
                          }
                          style={{ fontSize: "14px", padding: "4px 12px" }}
                        >
                          {patient.status === "waiting"
                            ? "Chờ khám"
                            : "Đang khám"}
                        </Tag>
                      </Col>

                      <Col span={24}>
                        <Divider style={{ margin: "8px 0" }}>
                          Thông tin liên hệ
                        </Divider>
                        <Space direction="vertical" style={{ width: "100%" }}>
                          <Card
                            size="small"
                            style={{ background: "rgba(255,255,255,0.7)" }}
                          >
                            <Space
                              direction="vertical"
                              size={8}
                              style={{ width: "100%" }}
                            >
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 8,
                                }}
                              >
                                <PhoneOutlined
                                  style={{ color: "#1890ff", fontSize: "16px" }}
                                />
                                <Text strong>Số điện thoại:</Text>
                                <Text copyable>{patient.phone}</Text>
                              </div>
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 8,
                                }}
                              >
                                <MailOutlined
                                  style={{ color: "#1890ff", fontSize: "16px" }}
                                />
                                <Text strong>Email:</Text>
                                <Text>{patient.email}</Text>
                              </div>
                            </Space>
                          </Card>
                        </Space>
                      </Col>

                      <Col span={24}>
                        <Divider style={{ margin: "8px 0" }}>Lịch hẹn</Divider>
                        <Card
                          size="small"
                          style={{ background: "rgba(255,255,255,0.7)" }}
                        >
                          <Space
                            direction="vertical"
                            size={8}
                            style={{ width: "100%" }}
                          >
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 8,
                              }}
                            >
                              <ClockCircleOutlined
                                style={{ color: "#52c41a", fontSize: "16px" }}
                              />
                              <Text strong>Thời gian:</Text>
                              <Text>{patient.time}</Text>
                            </div>
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 8,
                              }}
                            >
                              <CalendarOutlined
                                style={{ color: "#52c41a", fontSize: "16px" }}
                              />
                              <Text strong>Ngày:</Text>
                              <Text>
                                {dayjs(patient.date).format("DD/MM/YYYY")}
                              </Text>
                            </div>
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 8,
                              }}
                            >
                              <MedicineBoxOutlined
                                style={{ color: "#52c41a", fontSize: "16px" }}
                              />
                              <Text strong>Loại khám:</Text>
                              <Tag color="blue">{patient.type}</Tag>
                            </div>
                          </Space>
                        </Card>
                      </Col>

                      <Col span={24}>
                        <Divider style={{ margin: "8px 0" }}>
                          Thông tin nhanh
                        </Divider>
                        <Card
                          size="small"
                          style={{ background: "rgba(255,255,255,0.7)" }}
                        >
                          <Descriptions column={1} size="small">
                            <Descriptions.Item label="Tuổi">
                              <Text strong>38</Text>
                            </Descriptions.Item>
                            <Descriptions.Item label="Giới tính">
                              <Text strong>Nam</Text>
                            </Descriptions.Item>
                            <Descriptions.Item label="Nhóm máu">
                              <Text strong>O+</Text>
                            </Descriptions.Item>
                            <Descriptions.Item label="BHYT">
                              <Text strong copyable>
                                BH-123456789
                              </Text>
                            </Descriptions.Item>
                          </Descriptions>
                        </Card>
                      </Col>

                      <Col span={24}>
                        <Space
                          direction="vertical"
                          style={{ width: "100%", marginTop: 16 }}
                        >
                          <Button
                            icon={
                              isFullScreen ? (
                                <FullscreenExitOutlined />
                              ) : (
                                <FullscreenOutlined />
                              )
                            }
                            onClick={toggleFullScreen}
                            size="large"
                            block
                            style={{
                              background:
                                "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                              color: "white",
                            }}
                          >
                            {isFullScreen
                              ? "Thoát toàn màn hình"
                              : "Toàn màn hình"}
                          </Button>

                          {patient.status === "waiting" && (
                            <Button
                              type="primary"
                              size="large"
                              block
                              onClick={() => {
                                if (props.onStartExamination) {
                                  props.onStartExamination(patient.id);
                                }
                              }}
                            >
                              Bắt đầu khám
                            </Button>
                          )}

                          <Button
                            type="default"
                            size="large"
                            block
                            onClick={handlePrint}
                          >
                            <PrinterOutlined /> In hồ sơ
                          </Button>
                        </Space>
                      </Col>
                    </Row>
                  </Card>
                </div>
              </Col>

              {/* Content phải - Tabs chính */}
              <Col xs={24} md={16} lg={18}>
                <div
                  style={{
                    height: "100%",
                    overflow: "auto",
                    maxHeight: isFullScreen ? "calc(100vh - 200px)" : "70vh",
                  }}
                >
                  <Tabs defaultActiveKey="examination" type="card" size="large">
                    <TabPane
                      tab={
                        <span>
                          <MedicineBoxOutlined />
                          <Text strong>Khám bệnh</Text>
                        </span>
                      }
                      key="examination"
                    >
                      <Row gutter={[16, 16]}>
                        {/* Thông tin cơ bản */}
                        <Col span={12}>
                          <Card
                            title="Thông số sức khỏe"
                            size="small"
                            style={{ borderRadius: 8 }}
                          >
                            <Form form={form} layout="vertical">
                              <Row gutter={16}>
                                <Col span={12}>
                                  <Form.Item
                                    label="Huyết áp"
                                    name="bloodPressure"
                                    rules={[
                                      {
                                        required: true,
                                        message: "Vui lòng nhập huyết áp",
                                      },
                                    ]}
                                  >
                                    <Input placeholder="120/80 mmHg" />
                                  </Form.Item>
                                </Col>
                                <Col span={12}>
                                  <Form.Item
                                    label="Nhịp tim"
                                    name="heartRate"
                                    rules={[
                                      {
                                        required: true,
                                        message: "Vui lòng nhập nhịp tim",
                                      },
                                    ]}
                                  >
                                    <Input placeholder="75 bpm" />
                                  </Form.Item>
                                </Col>
                              </Row>
                              <Row gutter={16}>
                                <Col span={12}>
                                  <Form.Item
                                    label="Nhiệt độ"
                                    name="temperature"
                                    rules={[
                                      {
                                        required: true,
                                        message: "Vui lòng nhập nhiệt độ",
                                      },
                                    ]}
                                  >
                                    <Input placeholder="36.5°C" />
                                  </Form.Item>
                                </Col>
                                <Col span={12}>
                                  <Form.Item
                                    label="Cân nặng"
                                    name="weight"
                                    rules={[
                                      {
                                        required: true,
                                        message: "Vui lòng nhập cân nặng",
                                      },
                                    ]}
                                  >
                                    <Input placeholder="65 kg" />
                                  </Form.Item>
                                </Col>
                              </Row>
                              <Form.Item
                                label="Chiều cao"
                                name="height"
                                rules={[
                                  {
                                    required: true,
                                    message: "Vui lòng nhập chiều cao",
                                  },
                                ]}
                              >
                                <Input placeholder="170 cm" />
                              </Form.Item>
                              <Form.Item
                                label="Chẩn đoán"
                                name="diagnosis"
                                rules={[
                                  {
                                    required: true,
                                    message: "Vui lòng nhập chẩn đoán",
                                  },
                                ]}
                              >
                                <Input.TextArea
                                  placeholder="Nhập chẩn đoán..."
                                  rows={3}
                                />
                              </Form.Item>
                            </Form>
                          </Card>
                        </Col>

                        {/* Kết luận */}
                        <Col span={12}>
                          <Card
                            title="Kết luận & Hướng dẫn"
                            size="small"
                            style={{ borderRadius: 8 }}
                          >
                            <TextArea
                              value={conclusion}
                              onChange={(e) => setConclusion(e.target.value)}
                              placeholder="Nhập kết luận và hướng dẫn sau khám..."
                              rows={10}
                              style={{ marginBottom: 16 }}
                            />
                            <div>
                              <Text strong>Ghi chú thêm:</Text>
                              <ul style={{ paddingLeft: 20, marginTop: 8 }}>
                                <li>Hẹn tái khám sau 7 ngày</li>
                                <li>Uống thuốc đúng giờ</li>
                                <li>Tránh đồ lạnh và thức ăn cay</li>
                                <li>Nghỉ ngơi đầy đủ</li>
                                <li>Uống nhiều nước</li>
                              </ul>
                            </div>
                          </Card>
                        </Col>

                        {/* Đơn thuốc */}
                        <Col span={24}>
                          <Card
                            title={
                              <Space>
                                <MedicineBoxOutlined />
                                <Text strong>Đơn thuốc</Text>
                                <Badge
                                  count={prescription.length}
                                  style={{ backgroundColor: "#1890ff" }}
                                />
                              </Space>
                            }
                            size="small"
                            style={{ borderRadius: 8 }}
                            extra={
                              <Space>
                                <Button
                                  type="primary"
                                  icon={<PlusOutlined />}
                                  onClick={() => {
                                    setEditingMedicine(null);
                                    setShowAddMedicine(true);
                                  }}
                                  size="small"
                                >
                                  Thêm thuốc
                                </Button>
                              </Space>
                            }
                          >
                            <Table
                              columns={medicineColumns}
                              dataSource={prescription}
                              rowKey="id"
                              pagination={false}
                              size="small"
                              locale={{
                                emptyText: (
                                  <div
                                    style={{
                                      padding: "40px 0",
                                      textAlign: "center",
                                    }}
                                  >
                                    <MedicineBoxOutlined
                                      style={{ fontSize: 48, color: "#d9d9d9" }}
                                    />
                                    <div
                                      style={{
                                        marginTop: 16,
                                        color: "#bfbfbf",
                                      }}
                                    >
                                      Chưa có thuốc trong đơn. Hãy thêm thuốc
                                      mới.
                                    </div>
                                  </div>
                                ),
                              }}
                              summary={() =>
                                prescription.length > 0 && (
                                  <Table.Summary.Row
                                    style={{ background: "#fafafa" }}
                                  >
                                    <Table.Summary.Cell index={0} colSpan={2}>
                                      <Text strong>Tổng số thuốc:</Text>
                                    </Table.Summary.Cell>
                                    <Table.Summary.Cell index={2}>
                                      <Text strong>
                                        {prescription.length} loại
                                      </Text>
                                    </Table.Summary.Cell>
                                    <Table.Summary.Cell index={3} colSpan={2}>
                                      <Space>
                                        <Text type="secondary">
                                          Cần kê đơn:
                                        </Text>
                                        <Text strong>
                                          {
                                            prescription.filter(
                                              (p) => p.requiresPrescription
                                            ).length
                                          }
                                          /{prescription.length}
                                        </Text>
                                      </Space>
                                    </Table.Summary.Cell>
                                    <Table.Summary.Cell index={5}>
                                      <Button
                                        type="link"
                                        size="small"
                                        onClick={() => {
                                          Modal.confirm({
                                            title: "Xác nhận xóa tất cả",
                                            content:
                                              "Bạn có chắc chắn muốn xóa tất cả thuốc trong đơn?",
                                            okText: "Xóa tất cả",
                                            okType: "danger",
                                            cancelText: "Hủy",
                                            onOk: () => setPrescription([]),
                                          });
                                        }}
                                      >
                                        Xóa tất cả
                                      </Button>
                                    </Table.Summary.Cell>
                                  </Table.Summary.Row>
                                )
                              }
                            />
                          </Card>
                        </Col>
                      </Row>
                    </TabPane>

                    <TabPane
                      tab={
                        <span>
                          <HistoryOutlined />
                          <Text strong>Lịch sử khám bệnh</Text>
                        </span>
                      }
                      key="history"
                    >
                      <Collapse accordion>
                        {sampleMedicalHistory.map((record, index) => (
                          <Panel
                            header={
                              <Space>
                                <CalendarOutlined />
                                <Text strong>
                                  {dayjs(record.date).format("DD/MM/YYYY")}
                                </Text>
                                <Tag color="blue">{record.diagnosis}</Tag>
                              </Space>
                            }
                            key={index}
                            extra={
                              <Text type="secondary">{record.doctor}</Text>
                            }
                          >
                            <Row gutter={[16, 16]}>
                              <Col span={12}>
                                <Card size="small" title="Thông tin khám">
                                  <Descriptions column={1} size="small">
                                    <Descriptions.Item label="Ngày khám">
                                      {dayjs(record.date).format("DD/MM/YYYY")}
                                    </Descriptions.Item>
                                    <Descriptions.Item label="Bác sĩ">
                                      {record.doctor}
                                    </Descriptions.Item>
                                    <Descriptions.Item label="Chẩn đoán">
                                      <Text strong>{record.diagnosis}</Text>
                                    </Descriptions.Item>
                                  </Descriptions>
                                </Card>
                              </Col>
                              <Col span={12}>
                                <Card size="small" title="Đơn thuốc">
                                  <Text>{record.prescription}</Text>
                                </Card>
                              </Col>
                            </Row>
                          </Panel>
                        ))}
                      </Collapse>
                    </TabPane>

                    <TabPane
                      tab={
                        <span>
                          <FileTextOutlined />
                          <Text strong>Thông tin cá nhân</Text>
                        </span>
                      }
                      key="personal"
                    >
                      <Row gutter={[16, 16]}>
                        <Col span={12}>
                          <Card title="Thông tin cá nhân" size="small">
                            <Descriptions column={1} size="small">
                              <Descriptions.Item label="Họ và tên">
                                {patient.patientName}
                              </Descriptions.Item>
                              <Descriptions.Item label="Ngày sinh">
                                15/05/1985 (38 tuổi)
                              </Descriptions.Item>
                              <Descriptions.Item label="Giới tính">
                                Nam
                              </Descriptions.Item>
                              <Descriptions.Item label="CMND/CCCD">
                                012345678901
                              </Descriptions.Item>
                              <Descriptions.Item label="Bảo hiểm y tế">
                                BH-123456789
                              </Descriptions.Item>
                            </Descriptions>
                          </Card>
                        </Col>
                        <Col span={12}>
                          <Card title="Thông tin liên hệ" size="small">
                            <Descriptions column={1} size="small">
                              <Descriptions.Item label="Địa chỉ">
                                123 Đường ABC, Quận XYZ, TP.HCM
                              </Descriptions.Item>
                              <Descriptions.Item label="Số điện thoại">
                                {patient.phone}
                              </Descriptions.Item>
                              <Descriptions.Item label="Email">
                                {patient.email}
                              </Descriptions.Item>
                              <Descriptions.Item label="Người liên hệ khẩn cấp">
                                Nguyễn Thị Mẹ - 0909123456
                              </Descriptions.Item>
                              <Descriptions.Item label="Quan hệ">
                                Mẹ ruột
                              </Descriptions.Item>
                            </Descriptions>
                          </Card>
                        </Col>
                        <Col span={24}>
                          <Card title="Thông tin sức khỏe" size="small">
                            <Descriptions column={2} size="small">
                              <Descriptions.Item label="Nhóm máu">
                                O+
                              </Descriptions.Item>
                              <Descriptions.Item label="Dị ứng">
                                Không có
                              </Descriptions.Item>
                              <Descriptions.Item label="Bệnh nền">
                                Không có
                              </Descriptions.Item>
                              <Descriptions.Item label="Tiền sử gia đình">
                                Bố bị tiểu đường
                              </Descriptions.Item>
                              <Descriptions.Item label="Hút thuốc">
                                Không
                              </Descriptions.Item>
                              <Descriptions.Item label="Uống rượu">
                                Thỉnh thoảng
                              </Descriptions.Item>
                            </Descriptions>
                          </Card>
                        </Col>
                      </Row>
                    </TabPane>
                  </Tabs>
                </div>

                {/* Footer với các nút hành động */}
                <Divider />
                <Row justify="space-between" align="middle">
                  <Col>
                    <Space>
                      <Button
                        type="primary"
                        icon={<SaveOutlined />}
                        onClick={handleSave}
                        loading={loading}
                        size="large"
                      >
                        Lưu hồ sơ
                      </Button>
                      <Button
                        icon={<PrinterOutlined />}
                        onClick={handlePrint}
                        size="large"
                      >
                        In đơn thuốc
                      </Button>
                    </Space>
                  </Col>
                  <Col>
                    <Space>
                      <Button onClick={handleClose} size="large">
                        Đóng
                      </Button>
                      <Button
                        type="primary"
                        danger
                        icon={<CloseCircleOutlined />}
                        onClick={() => {
                          handleClose();
                          // Gọi hàm hủy lịch hẹn từ parent
                          if (props.onCancelAppointment) {
                            props.onCancelAppointment(patient.id);
                          }
                        }}
                        size="large"
                      >
                        Hủy lịch hẹn
                      </Button>
                    </Space>
                  </Col>
                </Row>
              </Col>
            </Row>
          </div>
        )}
      </Modal>

      {/* Popup thêm/sửa thuốc */}
      <AddMedicineModal
        visible={showAddMedicine}
        onClose={() => {
          setShowAddMedicine(false);
          setEditingMedicine(null);
        }}
        onSave={handleSaveMedicine}
        editingMedicine={editingMedicine}
      />
    </>
  );
});

PatientPopup.displayName = "PatientPopup";

export default PatientPopup;
