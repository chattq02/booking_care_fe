import React, { useState } from "react";
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
  Flex,
} from "antd";
import {
  UserOutlined,
  MedicineBoxOutlined,
  FileTextOutlined,
  ClockCircleOutlined,
  PhoneOutlined,
  MailOutlined,
  HistoryOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import AddMedicineModal from "../home/components/medicine-modal";

const { Title, Text } = Typography;
const { TextArea } = Input;
const { TabPane } = Tabs;
const { Panel } = Collapse;

// Định nghĩa kiểu dữ liệu
interface Patient {
  id: number;
  patientName: string;
  time: string;
  date: string;
  status: string;
  type: string;
  avatarColor: string;
  phone: string;
  email: string;
  isCurrent: boolean;
  isNext: boolean;
  bloodPressure: string;
  heartRate: string;
  temperature: string;
  weight: string;
  height: string;
  diagnosis: string;
  conclusion: string;
}

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

interface MedicalHistory {
  date: string;
  diagnosis: string;
  doctor: string;
  prescription: string;
}

const ListPatient: React.FC = () => {
  const [patient, setPatient] = useState<Patient>({
    id: 1,
    patientName: "Nguyễn Văn A",
    time: "09:00",
    date: dayjs().format("YYYY-MM-DD"),
    status: "confirmed",
    type: "Khám tổng quát",
    avatarColor: "#1890ff",
    phone: "0987654321",
    email: "nguyenvana@example.com",
    isCurrent: true,
    isNext: false,
    bloodPressure: "120/80 mmHg",
    heartRate: "75 bpm",
    temperature: "36.5°C",
    weight: "65 kg",
    height: "170 cm",
    diagnosis: "Viêm họng cấp",
    conclusion: "Cần nghỉ ngơi và uống thuốc đúng giờ",
  });

  const [form] = Form.useForm();
  const [conclusion, setConclusion] = useState("");
  const [prescription, setPrescription] = useState<Medicine[]>([]);
  const [showAddMedicine, setShowAddMedicine] = useState(false);
  const [editingMedicine, setEditingMedicine] = useState<Medicine | null>(null);

  // Dữ liệu mẫu cho lịch sử khám bệnh
  const sampleMedicalHistory: MedicalHistory[] = [
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

  // Hàm xử lý thêm/cập nhật thuốc
  const handleSaveMedicine = (medicineData: Medicine) => {
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
  const handleDeleteMedicine = (id: number) => {
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
  const handleEditMedicine = (medicine: Medicine) => {
    setEditingMedicine(medicine);
    setShowAddMedicine(true);
  };

  // Cột cho bảng đơn thuốc
  const medicineColumns = [
    {
      title: "Tên thuốc",
      dataIndex: "name",
      key: "name",
      render: (text: string, record: Medicine) => (
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
      render: (dosage: number, record: Medicine) => `${dosage} ${record.unit}`,
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
      render: (quantity: number) => <Tag color="geekblue">{quantity} cái</Tag>,
    },
    {
      title: "Hướng dẫn",
      key: "instruction",
      render: (_: any, record: Medicine) => (
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
      render: (note: string) => (
        <Text type="secondary" style={{ fontSize: "12px" }}>
          {note}
        </Text>
      ),
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_: any, record: Medicine) => (
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

  // Tạo CSS cho scrollbar tùy chỉnh
  const scrollbarStyles = {
    /* Tùy chỉnh scrollbar cho Chrome, Safari và Edge */
    "&::-webkit-scrollbar": {
      width: "8px",
    },
    "&::-webkit-scrollbar-track": {
      background: "#f1f1f1",
      borderRadius: "4px",
    },
    "&::-webkit-scrollbar-thumb": {
      background: "#c1c1c1",
      borderRadius: "4px",
    },
    "&::-webkit-scrollbar-thumb:hover": {
      background: "#a8a8a8",
    },
    /* Tùy chỉnh scrollbar cho Firefox */
    scrollbarWidth: "thin",
    scrollbarColor: "#c1c1c1 #f1f1f1",
  } as React.CSSProperties;

  return (
    <>
      <Flex
        style={{
          backgroundColor: "#f0f2f5",
          padding: "16px",
        }}
      >
        {/* Sidebar trái - Thông tin bệnh nhân cố định */}
        <div
          style={{
            width: "320px",
            flexShrink: 0,
          }}
        >
          <Card
            size="small"
            style={{
              borderRadius: "12px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
              marginBottom: "16px",
              background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
              border: "none",
            }}
            bodyStyle={{ padding: "20px" }}
          >
            <Row gutter={[16, 16]}>
              <Col span={24} style={{ textAlign: "center" }}>
                <Avatar
                  size={96}
                  style={{
                    backgroundColor: patient.avatarColor,
                    border: "4px solid white",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                    marginBottom: "16px",
                  }}
                  icon={<UserOutlined />}
                />
                <Title
                  level={3}
                  style={{ margin: "0 0 8px 0", fontSize: "20px" }}
                >
                  {patient.patientName}
                </Title>
                <Tag
                  color={patient.status === "waiting" ? "orange" : "green"}
                  style={{
                    fontSize: "14px",
                    padding: "4px 12px",
                    borderRadius: "12px",
                    fontWeight: "500",
                  }}
                >
                  {patient.status === "waiting" ? "Chờ khám" : "Đang khám"}
                </Tag>
              </Col>

              <Col span={24}>
                <Divider
                  style={{
                    margin: "12px 0",
                    fontSize: "14px",
                    fontWeight: "500",
                  }}
                >
                  Thông tin liên hệ
                </Divider>
                <Card
                  size="small"
                  style={{
                    background: "rgba(255,255,255,0.9)",
                    borderRadius: "8px",
                    border: "1px solid #e8e8e8",
                  }}
                  bodyStyle={{ padding: "12px" }}
                >
                  <Space
                    direction="vertical"
                    size={10}
                    style={{ width: "100%" }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                      }}
                    >
                      <PhoneOutlined
                        style={{ color: "#1890ff", fontSize: "16px" }}
                      />
                      <Text strong style={{ minWidth: "120px" }}>
                        Số điện thoại:
                      </Text>
                      <Text copyable style={{ fontSize: "14px" }}>
                        {patient.phone}
                      </Text>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                      }}
                    >
                      <MailOutlined
                        style={{ color: "#1890ff", fontSize: "16px" }}
                      />
                      <Text strong style={{ minWidth: "120px" }}>
                        Email:
                      </Text>
                      <Text style={{ fontSize: "14px" }}>{patient.email}</Text>
                    </div>
                  </Space>
                </Card>
              </Col>

              <Col span={24}>
                <Divider
                  style={{
                    margin: "12px 0",
                    fontSize: "14px",
                    fontWeight: "500",
                  }}
                >
                  Lịch hẹn
                </Divider>
                <Card
                  size="small"
                  style={{
                    background: "rgba(255,255,255,0.9)",
                    borderRadius: "8px",
                    border: "1px solid #e8e8e8",
                  }}
                  bodyStyle={{ padding: "12px" }}
                >
                  <Space
                    direction="vertical"
                    size={10}
                    style={{ width: "100%" }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                      }}
                    >
                      <ClockCircleOutlined
                        style={{ color: "#52c41a", fontSize: "16px" }}
                      />
                      <Text strong style={{ minWidth: "120px" }}>
                        Thời gian:
                      </Text>
                      <Text style={{ fontSize: "14px" }}>{patient.time}</Text>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                      }}
                    >
                      <CalendarOutlined
                        style={{ color: "#52c41a", fontSize: "16px" }}
                      />
                      <Text strong style={{ minWidth: "120px" }}>
                        Ngày:
                      </Text>
                      <Text style={{ fontSize: "14px" }}>
                        {dayjs(patient.date).format("DD/MM/YYYY")}
                      </Text>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                      }}
                    >
                      <MedicineBoxOutlined
                        style={{ color: "#52c41a", fontSize: "16px" }}
                      />
                      <Text strong style={{ minWidth: "120px" }}>
                        Loại khám:
                      </Text>
                      <Tag
                        color="blue"
                        style={{ fontSize: "12px", borderRadius: "10px" }}
                      >
                        {patient.type}
                      </Tag>
                    </div>
                  </Space>
                </Card>
              </Col>
            </Row>
          </Card>
        </div>

        {/* Phần nội dung chính */}
        <div
          style={{
            flex: 1,
            marginLeft: "20px",
            minWidth: 0, // Để tránh overflow
          }}
        >
          <Tabs
            defaultActiveKey="examination"
            type="card"
            size="large"
            style={{
              background: "white",
              borderRadius: "12px",
              padding: "20px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
              minHeight: "calc(100vh - 100px)",
            }}
          >
            {/* Tab Khám bệnh */}
            <TabPane
              tab={
                <span
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <MedicineBoxOutlined />
                  <Text strong>Khám bệnh</Text>
                </span>
              }
              key="examination"
            >
              <div
                style={{
                  height: "300px",
                  overflowY: "auto",
                  paddingRight: "8px",
                  ...scrollbarStyles,
                }}
              >
                <Row gutter={[16, 16]}>
                  {/* Thông tin cơ bản */}
                  <Col span={12}>
                    <Card
                      title="Thông số sức khỏe"
                      size="small"
                      style={{
                        borderRadius: "10px",
                        border: "1px solid #e8e8e8",
                      }}
                      headStyle={{
                        borderBottom: "1px solid #e8e8e8",
                        fontSize: "16px",
                        fontWeight: "600",
                      }}
                      bodyStyle={{ padding: "20px" }}
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
                              <Input
                                placeholder="120/80 mmHg"
                                style={{ borderRadius: "6px" }}
                              />
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
                              <Input
                                placeholder="75 bpm"
                                style={{ borderRadius: "6px" }}
                              />
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
                              <Input
                                placeholder="36.5°C"
                                style={{ borderRadius: "6px" }}
                              />
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
                              <Input
                                placeholder="65 kg"
                                style={{ borderRadius: "6px" }}
                              />
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
                          <Input
                            placeholder="170 cm"
                            style={{ borderRadius: "6px" }}
                          />
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
                            style={{ borderRadius: "6px" }}
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
                      style={{
                        borderRadius: "10px",
                        border: "1px solid #e8e8e8",
                      }}
                      headStyle={{
                        borderBottom: "1px solid #e8e8e8",
                        fontSize: "16px",
                        fontWeight: "600",
                      }}
                      bodyStyle={{ padding: "20px" }}
                    >
                      <TextArea
                        value={conclusion}
                        onChange={(e) => setConclusion(e.target.value)}
                        placeholder="Nhập kết luận và hướng dẫn sau khám..."
                        rows={10}
                        style={{
                          marginBottom: "16px",
                          borderRadius: "6px",
                        }}
                      />
                      <div>
                        <Text strong style={{ fontSize: "14px" }}>
                          Ghi chú thêm:
                        </Text>
                        <ul
                          style={{
                            paddingLeft: "24px",
                            marginTop: "12px",
                            color: "#595959",
                          }}
                        >
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
                          <Text strong style={{ fontSize: "16px" }}>
                            Đơn thuốc
                          </Text>
                          <Badge
                            count={prescription.length}
                            style={{
                              backgroundColor: "#1890ff",
                              fontSize: "12px",
                            }}
                          />
                        </Space>
                      }
                      size="small"
                      style={{
                        borderRadius: "10px",
                        border: "1px solid #e8e8e8",
                      }}
                      headStyle={{
                        borderBottom: "1px solid #e8e8e8",
                        fontSize: "16px",
                        fontWeight: "600",
                      }}
                      bodyStyle={{ padding: "20px" }}
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
                            style={{
                              borderRadius: "6px",
                              fontWeight: "500",
                            }}
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
                        style={{
                          borderRadius: "8px",
                          overflow: "hidden",
                          border: "1px solid #f0f0f0",
                        }}
                        locale={{
                          emptyText: (
                            <div
                              style={{
                                padding: "60px 0",
                                textAlign: "center",
                                color: "#bfbfbf",
                              }}
                            >
                              <MedicineBoxOutlined
                                style={{
                                  fontSize: "48px",
                                  marginBottom: "16px",
                                }}
                              />
                              <div style={{ fontSize: "14px" }}>
                                Chưa có thuốc trong đơn. Hãy thêm thuốc mới.
                              </div>
                            </div>
                          ),
                        }}
                        summary={() =>
                          prescription.length > 0 && (
                            <Table.Summary.Row
                              style={{
                                background: "#fafafa",
                                fontWeight: "500",
                              }}
                            >
                              <Table.Summary.Cell index={0} colSpan={2}>
                                <Text strong>Tổng số thuốc:</Text>
                              </Table.Summary.Cell>
                              <Table.Summary.Cell index={2}>
                                <Text strong>{prescription.length} loại</Text>
                              </Table.Summary.Cell>
                              <Table.Summary.Cell index={3} colSpan={2}>
                                <Space>
                                  <Text type="secondary">Cần kê đơn:</Text>
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
                                  danger
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
              </div>
            </TabPane>

            {/* Tab Lịch sử khám bệnh */}
            <TabPane
              tab={
                <span
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <HistoryOutlined />
                  <Text strong>Lịch sử khám bệnh</Text>
                </span>
              }
              key="history"
            >
              <div
                style={{
                  height: "300px",
                  overflowY: "auto",
                  paddingRight: "8px",
                  ...scrollbarStyles,
                }}
              >
                <Collapse
                  accordion
                  style={{
                    background: "transparent",
                    border: "none",
                  }}
                >
                  {sampleMedicalHistory.map((record, index) => (
                    <Panel
                      header={
                        <Space>
                          <CalendarOutlined />
                          <Text strong style={{ fontSize: "14px" }}>
                            {dayjs(record.date).format("DD/MM/YYYY")}
                          </Text>
                          <Tag
                            color="blue"
                            style={{
                              fontSize: "12px",
                              borderRadius: "10px",
                            }}
                          >
                            {record.diagnosis}
                          </Tag>
                        </Space>
                      }
                      key={index}
                      extra={<Text type="secondary">{record.doctor}</Text>}
                      style={{
                        marginBottom: "12px",
                        borderRadius: "8px",
                        border: "1px solid #e8e8e8",
                        overflow: "hidden",
                      }}
                    >
                      <Row gutter={[16, 16]}>
                        <Col span={12}>
                          <Card
                            size="small"
                            title="Thông tin khám"
                            style={{
                              borderRadius: "8px",
                            }}
                            bodyStyle={{ padding: "16px" }}
                          >
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
                          <Card
                            size="small"
                            title="Đơn thuốc"
                            style={{
                              borderRadius: "8px",
                            }}
                            bodyStyle={{ padding: "16px" }}
                          >
                            <Text style={{ fontSize: "14px" }}>
                              {record.prescription}
                            </Text>
                          </Card>
                        </Col>
                      </Row>
                    </Panel>
                  ))}
                </Collapse>
              </div>
            </TabPane>

            {/* Tab Thông tin cá nhân */}
            <TabPane
              tab={
                <span
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <FileTextOutlined />
                  <Text strong>Thông tin cá nhân</Text>
                </span>
              }
              key="personal"
            >
              <div
                style={{
                  height: "300px",
                  overflowY: "auto",
                  paddingRight: "8px",
                  ...scrollbarStyles,
                }}
              >
                <Row gutter={[16, 16]}>
                  <Col span={12}>
                    <Card
                      title="Thông tin cá nhân"
                      size="small"
                      style={{
                        borderRadius: "10px",
                        border: "1px solid #e8e8e8",
                      }}
                      bodyStyle={{ padding: "20px" }}
                    >
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
                    <Card
                      title="Thông tin liên hệ"
                      size="small"
                      style={{
                        borderRadius: "10px",
                        border: "1px solid #e8e8e8",
                      }}
                      bodyStyle={{ padding: "20px" }}
                    >
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
                    <Card
                      title="Thông tin sức khỏe"
                      size="small"
                      style={{
                        borderRadius: "10px",
                        border: "1px solid #e8e8e8",
                      }}
                      bodyStyle={{ padding: "20px" }}
                    >
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
              </div>
            </TabPane>
          </Tabs>
        </div>
      </Flex>

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
};

export default ListPatient;
