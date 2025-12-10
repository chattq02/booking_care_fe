import React, { useState } from "react";
import {
  Modal,
  Button,
  Tag,
  Typography,
  Space,
  Form,
  Input,
  Table,
  Row,
  Col,
  message,
  Card,
  Badge,
} from "antd";
import {
  MedicineBoxOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import AddMedicineModal, {
  type Medicine,
} from "../../home/components/medicine-modal";
import { useSaveMedicalRecord } from "../../list-appointment/hooks/useAppointment";
import type { MedicalAppointmentData } from "../../list-appointment/type";
import { useNavigate } from "react-router-dom";
import { PATH_ROUTE_DOCTOR } from "@/site/doctor.site/lib/enums/path";

const { Text } = Typography;
const { TextArea } = Input;

interface IProps {
  appointmentId: number;
}

export default function TabMedicalExamination({ appointmentId }: IProps) {
  const [prescription, setPrescription] = useState<Medicine[]>([]);
  const [showAddMedicine, setShowAddMedicine] = useState(false);
  const [editingMedicine, setEditingMedicine] = useState<Medicine | null>(null);
  const [form] = Form.useForm();
  const [conclusion, setConclusion] = useState("");
  const [medicalHistory, setMedicalHistory] = useState("");
  const [messageApi, contextHolder] = message.useMessage();
  const [modal, modalElement] = Modal.useModal();
  const { mutate, isPending } = useSaveMedicalRecord();
  const nav = useNavigate();

  // Hàm xử lý thêm/cập nhật thuốc
  const handleSaveMedicine = (medicineData: Medicine) => {
    if (editingMedicine) {
      // Cập nhật thuốc
      const updatedPrescription = prescription.map((med) =>
        med.medicineId === editingMedicine.medicineId
          ? { ...med, ...medicineData, medicineId: med.medicineId }
          : med
      );
      setPrescription(updatedPrescription);
      setEditingMedicine(null);
    } else {
      setPrescription([medicineData, ...prescription]);
    }
    setShowAddMedicine(false);
  };

  // Hàm xử lý xóa thuốc
  const handleDeleteMedicine = (medicineId: number) => {
    modal.confirm({
      title: "Xác nhận xóa",
      content: "Bạn có chắc chắn muốn xóa thuốc này khỏi đơn thuốc?",
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk: () => {
        const newPrescription = prescription.filter(
          (med) => med.medicineId !== medicineId
        );
        setPrescription(newPrescription);
        messageApi.success("Đã xóa thuốc thành công!");
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
      title: "ID",
      dataIndex: "medicineId",
      key: "medicineId",
    },
    {
      title: "Tên thuốc",
      dataIndex: "name",
      key: "name",
      render: (text: string) => <Text strong>{text}</Text>,
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
            onClick={() => handleDeleteMedicine(record.medicineId)}
          >
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

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

  const handleCompleteExamination = async () => {
    try {
      const formValues = await form.validateFields();

      const payload = {
        appointmentId: Number(appointmentId),
        bloodPressure: formValues.bloodPressure,
        heartRate: Number(formValues.heartRate),
        weight: Number(formValues.weight),
        height: Number(formValues.height),
        temperature: Number(formValues.temperature),
        diagnosis: formValues.diagnosis,
        medicalHistory: medicalHistory,
        conclusion: conclusion,
        prescription: {
          diagnosis: formValues.diagnosis,
          notes: "",
          items: prescription.map((item) => {
            return {
              ...item,
              endDate: item.endDate ? item.endDate.format("YYYY-MM-DD") : null,
              startDate: item.startDate
                ? item.startDate.format("YYYY-MM-DD")
                : null,
            };
          }),
        },
      };
      mutate(payload as MedicalAppointmentData, {
        onSuccess: () => {
          nav(PATH_ROUTE_DOCTOR.HOME);
          messageApi.success("Đã lấy dữ liệu thành công!");
        },
      });
    } catch (error) {
      console.error("Validation errors:", error);
      messageApi.error(
        "Vui lòng nhập đầy đủ thông tin trước khi hoàn thành khám!"
      );
    }
  };

  return (
    <>
      <div
        style={{
          height: "calc(100vh - 245px)",
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
                  <Input placeholder="170 cm" style={{ borderRadius: "6px" }} />
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
            >
              <TextArea
                value={conclusion}
                onChange={(e) => setConclusion(e.target.value)}
                placeholder="Nhập kết luận và hướng dẫn sau khám..."
                rows={8}
                style={{
                  marginBottom: "16px",
                  borderRadius: "6px",
                }}
              />
              <TextArea
                value={medicalHistory}
                onChange={(e) => setMedicalHistory(e.target.value)}
                placeholder="Tiền xử bệnh nhân..."
                rows={6}
                style={{
                  marginBottom: "16px",
                  borderRadius: "6px",
                }}
              />
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
                      <Table.Summary.Cell index={2}></Table.Summary.Cell>
                      <Table.Summary.Cell index={4} colSpan={4}>
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
      <div className="mt-3 flex justify-end">
        <Button
          type="primary"
          onClick={handleCompleteExamination}
          loading={isPending}
        >
          Hoàn thành khám
        </Button>
      </div>
      {/* Popup thêm/sửa thuốc */}
      <AddMedicineModal
        facilityId={4}
        visible={showAddMedicine}
        onClose={() => {
          setShowAddMedicine(false);
          setEditingMedicine(null);
        }}
        onSave={handleSaveMedicine}
        editingMedicine={editingMedicine}
      />
      {contextHolder}
      {modalElement}
    </>
  );
}
