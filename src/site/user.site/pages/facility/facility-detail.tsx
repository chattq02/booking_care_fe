import React, { useState, useMemo } from "react";
import {
  Card,
  Row,
  Col,
  Divider,
  Tag,
  Avatar,
  Rate,
  Tabs,
  List,
  Image,
  Button,
  Space,
  Typography,
  Collapse,
  Input,
  Select,
  Empty,
  Grid,
  Badge,
  Statistic,
  Progress,
} from "antd";
import {
  EnvironmentOutlined,
  PhoneOutlined,
  ClockCircleOutlined,
  UserOutlined,
  MedicineBoxOutlined,
  SearchOutlined,
  TeamOutlined,
  HeartOutlined,
  StarFilled,
  CalendarOutlined,
  TrophyOutlined,
  SafetyCertificateOutlined,
  EyeOutlined,
} from "@ant-design/icons";

const { Title, Paragraph, Text } = Typography;
const { Panel } = Collapse;
const { Search } = Input;
const { Option } = Select;
const { useBreakpoint } = Grid;

const FacilityDetail = () => {
  const [activeTab, setActiveTab] = useState("1");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("all");
  const screens = useBreakpoint();
  const [openSpecialty, setOpenSpecialty] = useState(null);

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

  // Lọc chuyên khoa và bác sĩ
  const filteredSpecialties = useMemo(() => {
    return hospitalData.specialties.filter((specialty) => {
      const matchesSearch =
        specialty.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        specialty.doctors.some((doctor) =>
          doctor.name.toLowerCase().includes(searchTerm.toLowerCase())
        );

      const matchesSpecialty =
        selectedSpecialty === "all" ||
        specialty.id.toString() === selectedSpecialty;

      return matchesSearch && matchesSpecialty;
    });
  }, [searchTerm, selectedSpecialty]);

  const DoctorCard = ({ doctor, specialtyColor }) => (
    <Badge.Ribbon
      text={doctor.isAvailable ? "Có lịch" : "Bận"}
      color={doctor.isAvailable ? "green" : "red"}
    >
      <Card
        style={{
          height: "100%",
          border: `1px solid #f0f0f0`,
          borderRadius: 12,
          boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
        }}
        bodyStyle={{ padding: "16px" }}
      >
        <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
          <Avatar
            size={80}
            src={doctor.avatar}
            icon={<UserOutlined />}
            style={{ border: `3px solid ${specialtyColor}20` }}
          />
          <div style={{ flex: 1 }}>
            <Space direction="vertical" size={4} style={{ width: "100%" }}>
              <div>
                <Text strong style={{ fontSize: "16px", color: "#1f1f1f" }}>
                  {doctor.name}
                </Text>
              </div>

              <Text type="secondary" style={{ fontSize: "14px" }}>
                {doctor.position}
              </Text>

              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Rate
                  disabled
                  defaultValue={doctor.rating}
                  style={{ fontSize: 14 }}
                  character={<StarFilled />}
                />
                <Text strong style={{ color: "#faad14" }}>
                  {doctor.rating}
                </Text>
              </div>
            </Space>
          </div>
        </div>

        <Space direction="vertical" size={8} style={{ width: "100%" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text strong style={{ fontSize: "13px" }}>
              Kinh nghiệm:
            </Text>
            <Tag color="blue" style={{ margin: 0 }}>
              {doctor.experience}
            </Tag>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text strong style={{ fontSize: "13px" }}>
              Bệnh nhân:
            </Text>
            <Text>{doctor.patients?.toLocaleString()}+</Text>
          </div>

          <div>
            <Text strong style={{ fontSize: "13px" }}>
              Chuyên môn:
            </Text>
            <div style={{ marginTop: 4 }}>
              {doctor.specialties.map((spec, idx) => (
                <Tag
                  key={idx}
                  color={specialtyColor}
                  style={{
                    margin: "2px",
                    border: "none",
                    borderRadius: 12,
                    fontSize: "12px",
                  }}
                >
                  {spec}
                </Tag>
              ))}
            </div>
          </div>

          <Button
            type="primary"
            block
            style={{
              marginTop: 12,
              background: specialtyColor,
              border: "none",
              borderRadius: 8,
              height: "36px",
            }}
            icon={<CalendarOutlined />}
            disabled={!doctor.isAvailable}
          >
            {doctor.isAvailable ? "Đặt lịch ngay" : "Hẹn lịch sau"}
          </Button>
        </Space>
      </Card>
    </Badge.Ribbon>
  );

  return (
    <div style={{ background: "#fafafa", minHeight: "100vh" }}>
      {/* Hero Section */}
      <div
        style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          padding: "40px 24px",
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
                    {hospitalData.name}
                  </Title>
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 16,
                    flexWrap: "wrap",
                  }}
                >
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 8 }}
                  >
                    <Rate
                      disabled
                      defaultValue={hospitalData.rating}
                      style={{ color: "#ffd666", fontSize: 16 }}
                    />
                    <Text strong style={{ color: "white" }}>
                      {hospitalData.rating} ({hospitalData.totalReviews} đánh
                      giá)
                    </Text>
                  </div>

                  <div
                    style={{ display: "flex", alignItems: "center", gap: 8 }}
                  >
                    <SafetyCertificateOutlined style={{ color: "#52c41a" }} />
                    <Text style={{ color: "white" }}>Đã xác thực</Text>
                  </div>
                </div>

                <Space direction="vertical" size="small">
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 8 }}
                  >
                    <EnvironmentOutlined />
                    <Text style={{ color: "white" }}>
                      {hospitalData.address}
                    </Text>
                  </div>
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 8 }}
                  >
                    <PhoneOutlined />
                    <Text style={{ color: "white" }}>{hospitalData.phone}</Text>
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

                <Button
                  type="primary"
                  size="large"
                  icon={<TeamOutlined />}
                  style={{
                    background: "#ff4d4f",
                    border: "none",
                    borderRadius: 8,
                    height: "48px",
                    padding: "0 32px",
                    fontSize: "16px",
                    fontWeight: 600,
                  }}
                >
                  Đặt lịch khám tổng quát
                </Button>
              </Space>
            </Col>

            <Col xs={24} md={10}>
              <Image
                width="100%"
                style={{
                  borderRadius: 16,
                  boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
                }}
                src={hospitalData.images[0]}
                alt={hospitalData.name}
                preview={false}
              />
            </Col>
          </Row>
        </div>
      </div>

      {/* Stats Section */}
      <div style={{ padding: "40px 24px", background: "white" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <Row gutter={[32, 32]}>
            {hospitalData.stats.map((stat, index) => (
              <Col xs={12} sm={6} key={index}>
                <div style={{ textAlign: "center" }}>
                  <Statistic
                    value={stat.value}
                    suffix={stat.suffix}
                    valueStyle={{
                      color: "#1890ff",
                      fontSize: "32px",
                      fontWeight: 700,
                    }}
                  />
                  <Text style={{ color: "#666", fontSize: "14px" }}>
                    {stat.label}
                  </Text>
                </div>
              </Col>
            ))}
          </Row>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ padding: "40px 24px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <Card
            style={{
              borderRadius: 16,
              boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
              border: "none",
            }}
            bodyStyle={{ padding: "32px" }}
          >
            <Tabs
              activeKey={activeTab}
              onChange={setActiveTab}
              items={[
                {
                  key: "1",
                  label: (
                    <span style={{ fontSize: "16px", fontWeight: 600 }}>
                      <MedicineBoxOutlined />
                      Giới thiệu
                    </span>
                  ),
                  children: (
                    <div style={{ padding: "24px 0" }}>
                      <Row gutter={[32, 32]}>
                        <Col xs={24} lg={16}>
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

                            <Divider />

                            <div>
                              <Title level={4}>Thành tích nổi bật</Title>
                              <List
                                dataSource={hospitalData.achievements}
                                renderItem={(item) => (
                                  <List.Item>
                                    <List.Item.Meta
                                      avatar={
                                        <TrophyOutlined
                                          style={{ color: "#faad14" }}
                                        />
                                      }
                                      description={item}
                                    />
                                  </List.Item>
                                )}
                              />
                            </div>
                          </Space>
                        </Col>

                        <Col xs={24} lg={8}>
                          <Space
                            direction="vertical"
                            size="large"
                            style={{ width: "100%" }}
                          >
                            <Card
                              title="Cơ sở vật chất"
                              bordered={false}
                              style={{ borderRadius: 12 }}
                            >
                              <Space
                                direction="vertical"
                                size={8}
                                style={{ width: "100%" }}
                              >
                                {hospitalData.facilities.map(
                                  (facility, index) => (
                                    <div
                                      key={index}
                                      style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 8,
                                        padding: "8px 0",
                                      }}
                                    >
                                      <div
                                        style={{
                                          width: 6,
                                          height: 6,
                                          borderRadius: "50%",
                                          background: "#1890ff",
                                        }}
                                      />
                                      <Text>{facility}</Text>
                                    </div>
                                  )
                                )}
                              </Space>
                            </Card>

                            <Card
                              title="Hình ảnh bệnh viện"
                              bordered={false}
                              style={{ borderRadius: 12 }}
                            >
                              <Row gutter={[8, 8]}>
                                {hospitalData.images
                                  .slice(1)
                                  .map((image, index) => (
                                    <Col span={8} key={index}>
                                      <Image
                                        width="100%"
                                        height={80}
                                        style={{
                                          borderRadius: 8,
                                          objectFit: "cover",
                                        }}
                                        src={image}
                                        alt={`Hospital ${index + 1}`}
                                        preview={{
                                          mask: <EyeOutlined />,
                                        }}
                                      />
                                    </Col>
                                  ))}
                              </Row>
                            </Card>
                          </Space>
                        </Col>
                      </Row>
                    </div>
                  ),
                },
                {
                  key: "2",
                  label: (
                    <span style={{ fontSize: "16px", fontWeight: 600 }}>
                      <UserOutlined />
                      Chuyên khoa & Bác sĩ
                    </span>
                  ),
                  children: (
                    <div style={{ padding: "24px 0" }}>
                      {/* Search and Filter */}
                      <Card
                        style={{
                          marginBottom: 24,
                          borderRadius: 12,
                          background: "#fafafa",
                        }}
                        bodyStyle={{ padding: "20px" }}
                      >
                        <Row gutter={[16, 16]} align="middle">
                          <Col xs={24} md={12}>
                            <Search
                              placeholder="Tìm kiếm chuyên khoa hoặc bác sĩ..."
                              allowClear
                              enterButton={
                                <Button
                                  type="primary"
                                  icon={<SearchOutlined />}
                                  style={{
                                    background: "#1890ff",
                                    border: "none",
                                  }}
                                >
                                  Tìm kiếm
                                </Button>
                              }
                              size="large"
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                              style={{ width: "100%" }}
                            />
                          </Col>
                          <Col xs={24} md={6}>
                            <Select
                              placeholder="Tất cả chuyên khoa"
                              style={{ width: "100%" }}
                              size="large"
                              value={selectedSpecialty}
                              onChange={setSelectedSpecialty}
                              allowClear
                            >
                              <Option value="all">Tất cả chuyên khoa</Option>
                              {hospitalData.specialties.map((specialty) => (
                                <Option
                                  key={specialty.id}
                                  value={specialty.id.toString()}
                                >
                                  {specialty.name}
                                </Option>
                              ))}
                            </Select>
                          </Col>
                          <Col xs={24} md={6}>
                            <Text type="secondary" style={{ fontSize: "14px" }}>
                              Tìm thấy {filteredSpecialties.length} chuyên khoa
                            </Text>
                          </Col>
                        </Row>
                      </Card>

                      {/* Specialties List */}
                      {/* Specialties List */}
                      {filteredSpecialties.length > 0 ? (
                        <Space
                          direction="vertical"
                          size={24}
                          style={{ width: "100%" }}
                        >
                          {filteredSpecialties.map((specialty) => {
                            const isOpen = openSpecialty === specialty.id;

                            return (
                              <Card
                                key={specialty.id}
                                style={{
                                  border: `2px solid ${specialty.color}20`,
                                  borderRadius: 16,
                                  background: "white",
                                  overflow: "hidden",
                                }}
                                bodyStyle={{ padding: 0 }}
                              >
                                {/* Header */}
                                <div
                                  style={{
                                    background: `linear-gradient(135deg, ${specialty.color}10, ${specialty.color}05)`,
                                    padding: "24px",
                                    borderBottom: `1px solid ${specialty.color}20`,
                                  }}
                                >
                                  <Space
                                    size="middle"
                                    align="start"
                                    style={{ width: "100%" }}
                                  >
                                    <div
                                      style={{
                                        width: 48,
                                        height: 48,
                                        borderRadius: 12,
                                        background: specialty.color,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        fontSize: "20px",
                                      }}
                                    >
                                      {specialty.icon}
                                    </div>

                                    <div style={{ flex: 1 }}>
                                      <Space direction="vertical" size={8}>
                                        <div
                                          style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 12,
                                          }}
                                        >
                                          <Title
                                            level={4}
                                            style={{
                                              margin: 0,
                                              color: "#1f1f1f",
                                            }}
                                          >
                                            {specialty.name}
                                          </Title>
                                          <Tag
                                            color={specialty.color}
                                            style={{
                                              border: "none",
                                              borderRadius: 12,
                                              fontWeight: 600,
                                            }}
                                          >
                                            {specialty.doctors.length} bác sĩ
                                          </Tag>
                                        </div>
                                        <Text
                                          style={{
                                            color: "#666",
                                            lineHeight: 1.6,
                                          }}
                                        >
                                          {specialty.description}
                                        </Text>
                                      </Space>
                                    </div>

                                    {/* NÚT COLLAPSE */}
                                    <Button
                                      type="text"
                                      onClick={() =>
                                        setOpenSpecialty(
                                          isOpen ? null : specialty.id
                                        )
                                      }
                                      style={{ fontWeight: 600 }}
                                    >
                                      {isOpen ? "Thu gọn ▲" : "Xem bác sĩ ▼"}
                                    </Button>
                                  </Space>
                                </div>

                                {/* BODY — SHOW OR HIDE */}
                                {isOpen && (
                                  <div style={{ padding: "24px" }}>
                                    <Row gutter={[16, 16]}>
                                      {specialty.doctors.map((doctor) => (
                                        <Col
                                          xs={24}
                                          md={12}
                                          lg={8}
                                          key={doctor.id}
                                        >
                                          <DoctorCard
                                            doctor={doctor}
                                            specialtyColor={specialty.color}
                                          />
                                        </Col>
                                      ))}
                                    </Row>
                                  </div>
                                )}
                              </Card>
                            );
                          })}
                        </Space>
                      ) : (
                        <Empty
                          description="Không tìm thấy chuyên khoa hoặc bác sĩ phù hợp"
                          image={Empty.PRESENTED_IMAGE_SIMPLE}
                          style={{ margin: "40px 0" }}
                        />
                      )}
                    </div>
                  ),
                },
              ]}
            />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default FacilityDetail;
