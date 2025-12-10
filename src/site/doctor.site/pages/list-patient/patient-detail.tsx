import {
  Typography,
  Space,
  Avatar,
  Divider,
  Tabs,
  Row,
  Col,
  Card,
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
  CalendarOutlined,
  EuroCircleOutlined,
} from "@ant-design/icons";
import { useGetDetailPatient } from "../list-appointment/hooks/useAppointment";
import { useSearchParams } from "react-router-dom";
import TabInfoPatient from "./components/tab-info-patient";
import TabMedicalExamination from "./components/tab-medical-examination";
import TabMedicalHistory from "./components/tab-medical-history";

const { Title, Text } = Typography;

const PatientDetail: React.FC = () => {
  // examining_patient
  const [searchParams, setSearchParams] = useSearchParams();
  const appointmentId = searchParams.get("appointmentId");
  const patientId = searchParams.get("patientId");

  const { data } = useGetDetailPatient(
    appointmentId ? Number(appointmentId) : Number(patientId),
    Boolean(appointmentId)
  );
  const validTabs = ["examination", "personal", "history"];

  const tabFromUrl = searchParams.get("tab");
  const activeTab = validTabs.includes(tabFromUrl || "")
    ? tabFromUrl!
    : patientId
    ? "personal"
    : "examination";

  const handleTabChange = (key: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("tab", key);
    setSearchParams(params);
  };

  // Format tiền tệ
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
    }).format(Number(amount) || 0);
  };

  const tabItems = [
    {
      key: "history",
      label: (
        <span
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <HistoryOutlined />
          <Text strong>Lịch sử khám bệnh</Text>
        </span>
      ),
      children: <TabMedicalHistory />,
    },

    {
      key: "personal",
      label: (
        <span
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <FileTextOutlined />
          <Text strong>Thông tin cá nhân</Text>
        </span>
      ),
      children: <TabInfoPatient patient={data?.patient} />,
    },
  ];

  if (appointmentId) {
    tabItems.unshift({
      key: "examination",
      label: (
        <span
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <MedicineBoxOutlined />
          <Text strong>Khám bệnh</Text>
        </span>
      ),
      children: <TabMedicalExamination appointmentId={Number(appointmentId)} />,
    });
  }

  return (
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
        >
          <Row gutter={[16, 16]}>
            <Col span={24} style={{ textAlign: "center" }}>
              <Avatar
                size={96}
                style={{
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
                {data?.patient.fullName}
              </Title>
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
              >
                <Space direction="vertical" size={10} style={{ width: "100%" }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <UserOutlined
                      style={{ color: "#1890ff", fontSize: "16px" }}
                    />
                    <Text strong>Mã bệnh nhân:</Text>
                    <Text style={{ fontSize: "14px" }}>{data?.patient.id}</Text>
                  </div>
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
                    <Text strong>Số điện thoại:</Text>
                    <Text copyable style={{ fontSize: "14px" }}>
                      {data?.patient.phone}
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
                    <Text strong style={{ minWidth: "100px" }}>
                      Email:
                    </Text>
                    <Text style={{ fontSize: "14px" }}>
                      {data?.patient.email}
                    </Text>
                  </div>
                </Space>
              </Card>
            </Col>

            {appointmentId && (
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
                      <Text strong>Thời gian:</Text>
                      <Text style={{ fontSize: "14px" }}>
                        {data?.appointment.slot.startTime} -
                        {data?.appointment.slot.endTime}
                      </Text>
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
                      <Text strong>Ngày:</Text>
                      <Text style={{ fontSize: "14px" }}>
                        {data?.appointment.appointmentDate}
                      </Text>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                      }}
                    >
                      <EuroCircleOutlined
                        style={{ color: "#52c41a", fontSize: "16px" }}
                      />
                      <Text strong>Giá khám</Text>
                      {formatCurrency(data?.appointment.slot.price || 0)}
                    </div>
                  </Space>
                </Card>
              </Col>
            )}
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
          onChange={handleTabChange}
          activeKey={activeTab}
          type="card"
          size="large"
          style={{
            background: "white",
            borderRadius: "12px",
            padding: "20px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
            minHeight: "calc(100vh - 100px)",
          }}
          items={tabItems}
        />
      </div>
    </Flex>
  );
};

export default PatientDetail;
