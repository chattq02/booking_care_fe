import {
  Card,
  Row,
  Col,
  Tag,
  Tabs,
  Image,
  Space,
  Typography,
  Grid,
  Spin,
  Layout,
} from "antd";
import {
  EnvironmentOutlined,
  PhoneOutlined,
  ClockCircleOutlined,
  UserOutlined,
  MedicineBoxOutlined,
  TrophyOutlined,
} from "@ant-design/icons";
import { useGetFacility } from "./hooks/useFacility";
import { useParams, useSearchParams } from "react-router-dom";
import TabDepartment from "./components/tab-department";

const { Title, Paragraph, Text } = Typography;
const { useBreakpoint } = Grid;
const { Content } = Layout;

const FacilityDetail = () => {
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  const validTabs = ["introduce", "sepcility"];

  const tabFromUrl = searchParams.get("tab");
  const activeTab = validTabs.includes(tabFromUrl || "")
    ? tabFromUrl!
    : "introduce";

  const screens = useBreakpoint();
  const { data, isLoading } = useGetFacility(Number(id));

  // Dữ liệu mẫu với nhiều chuyên khoa
  const hospitalData = {
    name: "Bệnh viện Đa khoa Quốc tế Vinmec Times City",
    rating: 4.8,
    totalReviews: 1247,
    address: "458 Minh Khai, Vĩnh Tuy, Hai Bà Trưng, Hà Nội",
    phone: "024 3974 3556",
    workingHours: "24/7",
    description:
      "Vinmec Times City là bệnh viện đa khoa quốc tế đầu tiên tại Việt Nam được đầu tư 100% vốn nước ngoài. Bệnh viện được xây dựng theo mô hình khách sạn 5 sao, cung cấp dịch vụ y tế chất lượng cao theo tiêu chuẩn quốc tế.",
    images: [
      "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800",
      "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=800",
      "https://images.unsplash.com/photo-1599045118108-bf9954418b76?w=800",
    ],
    stats: [
      { label: "Bác sĩ", value: 150, suffix: "+" },
      { label: "Chuyên khoa", value: 30, suffix: "+" },
      { label: "Bệnh nhân/năm", value: "50.000", suffix: "+" },
      { label: "Thành công", value: 98, suffix: "%" },
    ],
    specialties: [
      {
        id: 1,
        name: "Tim mạch",
        description:
          "Chuyên điều trị các bệnh lý về tim mạch với đội ngũ bác sĩ giàu kinh nghiệm",
        icon: "❤️",
        color: "#ff4d4f",
        doctors: [
          {
            id: 1,
            name: "BS. Nguyễn Văn A",
            avatar:
              "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150",
            position: "Trưởng khoa Tim mạch",
            experience: "15 năm",
            rating: 4.9,
            patients: 12500,
            specialties: ["Tim mạch can thiệp", "Điều trị tăng huyết áp"],
            education: "Tiến sĩ Y khoa - Đại học Y Hà Nội",
            isAvailable: true,
          },
          {
            id: 2,
            name: "BS. Trần Thị B",
            avatar:
              "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150",
            position: "Phó khoa Tim mạch",
            experience: "12 năm",
            rating: 4.8,
            patients: 9800,
            specialties: ["Siêu âm tim", "Rối loạn nhịp tim"],
            education: "Thạc sĩ Y khoa - Đại học Y Dược TP.HCM",
            isAvailable: true,
          },
        ],
      },
      {
        id: 2,
        name: "Thần kinh",
        description:
          "Chẩn đoán và điều trị các bệnh lý thần kinh với trang thiết bị hiện đại",
        icon: "🧠",
        color: "#1890ff",
        doctors: [
          {
            id: 3,
            name: "BS. Lê Văn C",
            avatar:
              "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=150",
            position: "Trưởng khoa Thần kinh",
            experience: "18 năm",
            rating: 4.7,
            patients: 15600,
            specialties: ["Đột quỵ", "Đau đầu", "Bệnh Parkinson"],
            education: "Tiến sĩ Thần kinh học - Đại học Y Paris",
            isAvailable: false,
          },
        ],
      },
      {
        id: 3,
        name: "Tiêu hóa",
        description: "Khám và điều trị các bệnh lý về đường tiêu hóa",
        icon: "🩺",
        color: "#52c41a",
        doctors: [
          {
            id: 4,
            name: "BS. Phạm Thị D",
            avatar:
              "https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=150",
            position: "Bác sĩ Tiêu hóa",
            experience: "10 năm",
            rating: 4.6,
            patients: 8200,
            specialties: ["Nội soi tiêu hóa", "Viêm gan", "Loét dạ dày"],
            education: "Thạc sĩ Nội tiêu hóa - Đại học Y Hà Nội",
            isAvailable: true,
          },
        ],
      },
    ],
    facilities: [
      "Phòng mổ vô khuẩn",
      "MRI 3.0 Tesla",
      "CT-Scanner 640 lát cắt",
      "Phòng ICU hiện đại",
      "Phòng khám tiêu chuẩn quốc tế",
      "Phòng xét nghiệm tự động",
      "Hệ thống nội soi 4K",
    ],
    achievements: [
      "Bệnh viện đạt chuẩn quốc tế JCI",
      "Top 10 bệnh viện tốt nhất Việt Nam",
      "Giải thưởng chất lượng dịch vụ 2023",
    ],
  };

  const handleActiveTab = (key: string) => {
    setSearchParams({ tab: key });
  };

  if (isLoading)
    return (
      <Spin
        size="large"
        style={{
          width: "100%",
        }}
      />
    );

  return (
    <Layout className="bg-linear-to-br from-blue-50 via-white to-purple-50 min-h-screen">
      <Content className=" mx-auto w-full">
        {/* Hero Section */}
        <div
          style={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            padding: "30px 24px",
            color: "white",
          }}
        >
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            <Row gutter={[32, 32]} align="middle">
              <Col xs={24} md={14}>
                <Space direction="vertical" size="large">
                  <div>
                    <Tag
                      color="gold"
                      style={{
                        border: "none",
                        borderRadius: 16,
                        padding: "4px 12px",
                        marginBottom: 12,
                      }}
                    >
                      <TrophyOutlined /> Bệnh viện xuất sắc 2023
                    </Tag>
                    <Title
                      level={1}
                      style={{
                        color: "white",
                        margin: 0,
                        fontSize: screens.xs ? "28px" : "36px",
                      }}
                    >
                      {data?.name}
                    </Title>
                  </div>

                  <Space direction="vertical" size="small">
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 8 }}
                    >
                      <EnvironmentOutlined />
                      <Text style={{ color: "white" }}>{data?.address}</Text>
                    </div>
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 8 }}
                    >
                      <PhoneOutlined />
                      <Text style={{ color: "white" }}>{data?.phone}</Text>
                    </div>
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 8 }}
                    >
                      <ClockCircleOutlined />
                      <Text style={{ color: "white" }}>
                        Mở cửa {hospitalData.workingHours}
                      </Text>
                    </div>
                  </Space>
                </Space>
              </Col>

              <Col xs={24} md={10}>
                <Image
                  height={250}
                  width="100%"
                  style={{
                    borderRadius: 10,
                    boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
                    objectFit: "cover",
                  }}
                  src={data?.imageUrl}
                  alt={data?.name}
                  preview={false}
                />
              </Col>
            </Row>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-4 sm:p-6 lg:px-8 lg:py-8">
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            <Card
              style={{
                boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
                border: "none",
              }}
              className="rounded-md pt-0!"
              classNames={{
                body: "pt-2!",
              }}
            >
              <Tabs
                activeKey={activeTab}
                onChange={handleActiveTab}
                items={[
                  {
                    key: "introduce",
                    label: (
                      <span style={{ fontSize: "16px", fontWeight: 600 }}>
                        <MedicineBoxOutlined className="mr-2" />
                        Giới thiệu
                      </span>
                    ),
                    children: (
                      <div style={{ padding: "24px 0" }}>
                        <Space
                          direction="vertical"
                          size="large"
                          style={{ width: "100%" }}
                        >
                          <div>
                            <Title level={3} style={{ color: "#1f1f1f" }}>
                              Giới thiệu về bệnh viện
                            </Title>
                            <Paragraph
                              style={{
                                fontSize: "16px",
                                lineHeight: "1.8",
                                color: "#666",
                              }}
                            >
                              {hospitalData.description}
                            </Paragraph>
                          </div>
                        </Space>
                      </div>
                    ),
                  },
                  {
                    key: "sepcility",
                    label: (
                      <span style={{ fontSize: "16px", fontWeight: 600 }}>
                        <UserOutlined className="mr-2" />
                        Chuyên khoa & Bác sĩ
                      </span>
                    ),
                    children: <TabDepartment facilityId={Number(id)} />,
                  },
                ]}
              />
            </Card>
          </div>
        </div>
      </Content>
    </Layout>
  );
};

export default FacilityDetail;
