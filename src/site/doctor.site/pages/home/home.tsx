import React, { useState, useEffect, useRef } from "react";
import {
  Layout,
  Card,
  Row,
  Col,
  Statistic,
  Table,
  Tag,
  Button,
  Avatar,
  Typography,
  Space,
  Progress,
  Grid,
  DatePicker,
  Select,
  Divider,
  Badge,
  Descriptions,
} from "antd";
import {
  UserOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  DollarOutlined,
  TeamOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  EyeOutlined,
  UserSwitchOutlined,
  RightCircleOutlined,
  FilterOutlined,
  UserAddOutlined,
  LineChartOutlined,
  PlayCircleOutlined,
  CheckOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import advancedFormat from "dayjs/plugin/advancedFormat";
import customParseFormat from "dayjs/plugin/customParseFormat";
import PatientPopup from "./components/patient-popup";

dayjs.locale("vi");
dayjs.extend(advancedFormat);
dayjs.extend(customParseFormat);

const { Content } = Layout;
const { Title, Text } = Typography;
const { useBreakpoint } = Grid;
const { RangePicker } = DatePicker;
const { Option } = Select;

const Home = () => {
  const [appointments, setAppointments] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState([
    dayjs().startOf("month"),
    dayjs().endOf("month"),
  ]);
  const [filterType, setFilterType] = useState("month");
  const [currentPatient, setCurrentPatient] = useState(null);
  const [nextPatient, setNextPatient] = useState(null);
  const screens = useBreakpoint();

  // Ref để điều khiển popup từ component cha
  const patientPopupRef = useRef();

  // Dữ liệu mẫu với ngày tháng
  const sampleAppointments = [
    {
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
    },
    {
      id: 2,
      patientName: "Trần Thị B",
      time: "10:30",
      date: dayjs().format("YYYY-MM-DD"),
      status: "waiting",
      type: "Tái khám",
      avatarColor: "#52c41a",
      phone: "0987123456",
      email: "tranthib@example.com",
      isCurrent: false,
      isNext: true,
    },
    {
      id: 3,
      patientName: "Lê Văn C",
      time: "11:15",
      date: dayjs().format("YYYY-MM-DD"),
      status: "confirmed",
      type: "Khám chuyên khoa",
      avatarColor: "#fa8c16",
      phone: "0912345678",
      email: "levanc@example.com",
      isCurrent: false,
      isNext: false,
    },
    {
      id: 4,
      patientName: "Phạm Thị D",
      time: "14:00",
      date: dayjs().add(1, "day").format("YYYY-MM-DD"),
      status: "cancelled",
      type: "Tư vấn online",
      avatarColor: "#f5222d",
      phone: "0978123456",
      email: "phamthid@example.com",
      isCurrent: false,
      isNext: false,
    },
    {
      id: 5,
      patientName: "Hoàng Văn E",
      time: "08:30",
      date: dayjs().add(1, "day").format("YYYY-MM-DD"),
      status: "confirmed",
      type: "Khám tổng quát",
      avatarColor: "#722ed1",
      phone: "0965123456",
      email: "hoangvane@example.com",
      isCurrent: false,
      isNext: false,
    },
  ];

  const sampleStats = {
    totalAppointments: 24,
    completedAppointments: 18,
    pendingAppointments: 4,
    cancelledAppointments: 2,
    totalPatients: 156,
    newPatients: 12,
    monthlyEarnings: 85000000,
    todayEarnings: 4500000,
  };

  useEffect(() => {
    // Giả lập fetch data
    setTimeout(() => {
      const todayAppointments = sampleAppointments.filter(
        (appointment) => appointment.date === dayjs().format("YYYY-MM-DD")
      );

      setAppointments(todayAppointments);
      setStats(sampleStats);

      // Tìm bệnh nhân hiện tại và kế tiếp
      const current = todayAppointments.find((app) => app.isCurrent);
      const next = todayAppointments.find((app) => app.isNext);

      setCurrentPatient(current);
      setNextPatient(next);

      setLoading(false);
    }, 1000);
  }, []);

  // Hàm xử lý lọc dữ liệu
  const handleFilterChange = (dates, dateStrings) => {
    if (dates) {
      setDateRange(dates);

      const filteredAppointments = sampleAppointments.filter((appointment) => {
        const appointmentDate = dayjs(appointment.date);
        return (
          appointmentDate.isAfter(dates[0].subtract(1, "day")) &&
          appointmentDate.isBefore(dates[1].add(1, "day"))
        );
      });

      setAppointments(filteredAppointments);

      const total = filteredAppointments.length;
      const completed = filteredAppointments.filter(
        (a) => a.status === "confirmed"
      ).length;
      const pending = filteredAppointments.filter(
        (a) => a.status === "waiting"
      ).length;
      const cancelled = filteredAppointments.filter(
        (a) => a.status === "cancelled"
      ).length;

      setStats((prev) => ({
        ...prev,
        totalAppointments: total,
        completedAppointments: completed,
        pendingAppointments: pending,
        cancelledAppointments: cancelled,
      }));
    }
  };

  // Hàm chuyển đổi bệnh nhân
  const handleSwitchPatient = (patientId) => {
    const updatedAppointments = appointments.map((appointment) => ({
      ...appointment,
      isCurrent: appointment.id === patientId,
      isNext: appointment.id === nextPatient?.id,
    }));

    setAppointments(updatedAppointments);

    const newCurrent = updatedAppointments.find((app) => app.id === patientId);
    const newNext = updatedAppointments.find(
      (app) => app.status === "waiting" && !app.isCurrent
    );

    setCurrentPatient(newCurrent);
    setNextPatient(newNext);
  };

  // Hàm xem chi tiết bệnh nhân (mở popup)
  const handleViewPatientDetail = (patient) => {
    patientPopupRef.current?.openPopup(patient);
  };

  // Hàm xử lý hủy lịch hẹn
  const handleCancelAppointment = (patientId) => {
    const updatedAppointments = appointments.map((appointment) => {
      if (appointment.id === patientId) {
        return { ...appointment, status: "cancelled" };
      }
      return appointment;
    });
    setAppointments(updatedAppointments);
  };

  // Cột cho bảng lịch hẹn (responsive)
  const appointmentColumns = [
    {
      title: "Bệnh nhân",
      dataIndex: "patientName",
      key: "patientName",
      responsive: ["md"],
      render: (text, record) => (
        <Space>
          <Avatar
            size={screens.xs ? "small" : "default"}
            style={{ backgroundColor: record.avatarColor }}
            icon={<UserOutlined />}
          />
          <div>
            <div style={{ fontWeight: 500 }}>
              {screens.xs ? text.split(" ").pop() : text}
            </div>
            {record.isCurrent && (
              <Tag color="green" size="small">
                Đang khám
              </Tag>
            )}
            {record.isNext && (
              <Tag color="blue" size="small">
                Tiếp theo
              </Tag>
            )}
          </div>
        </Space>
      ),
    },
    {
      title: "Thời gian",
      dataIndex: "time",
      key: "time",
      responsive: ["sm"],
      render: (time, record) => (
        <Space direction="vertical" size={0}>
          <Tag color="blue" style={{ margin: screens.xs ? "2px 0" : "0" }}>
            <ClockCircleOutlined /> {time}
          </Tag>
          <Text type="secondary" style={{ fontSize: "12px" }}>
            {dayjs(record.date).format("DD/MM/YYYY")}
          </Text>
        </Space>
      ),
    },
    {
      title: "Loại khám",
      dataIndex: "type",
      key: "type",
      responsive: ["md"],
      render: (type) => (
        <Text style={{ fontSize: screens.xs ? "12px" : "14px" }}>
          {screens.xs ? type.substring(0, 10) + "..." : type}
        </Text>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        const statusConfig = {
          confirmed: {
            color: "green",
            text: "Đã xác nhận",
            icon: <CheckCircleOutlined />,
          },
          waiting: {
            color: "orange",
            text: "Chờ xác nhận",
            icon: <ClockCircleOutlined />,
          },
          cancelled: {
            color: "red",
            text: "Đã hủy",
            icon: <CloseCircleOutlined />,
          },
        };
        const config = statusConfig[status];
        return (
          <Tag
            color={config.color}
            icon={config.icon}
            style={{
              fontSize: screens.xs ? "11px" : "12px",
              padding: screens.xs ? "2px 6px" : "4px 8px",
            }}
          >
            {config.text}
          </Tag>
        );
      },
    },
    {
      title: "Hành động",
      key: "action",
      responsive: ["lg"],
      render: (_, record) => (
        <Space>
          <Button
            size={screens.xs ? "small" : "middle"}
            icon={<EyeOutlined />}
            onClick={() => handleViewPatientDetail(record)}
          >
            Chi tiết
          </Button>
          {record.status === "waiting" && (
            <Button
              type="primary"
              size={screens.xs ? "small" : "middle"}
              onClick={() => handleSwitchPatient(record.id)}
            >
              Bắt đầu khám
            </Button>
          )}
        </Space>
      ),
    },
  ];

  // Format tiền tệ
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Tính phần trăm cho thống kê
  const calculatePercentage = (value, total) => {
    return total > 0 ? Math.round((value / total) * 100) : 0;
  };

  // Thành phần hiển thị bệnh nhân hiện tại
  const CurrentPatientCard = () => (
    <Card
      title={
        <Space>
          <UserSwitchOutlined />
          <span>Bệnh nhân hiện tại</span>
        </Space>
      }
      loading={loading}
      bordered={false}
      style={{
        borderRadius: "8px",
        boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
        height: "100%",
      }}
    >
      {currentPatient ? (
        <Space direction="vertical" style={{ width: "100%" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Avatar
              size={64}
              style={{ backgroundColor: currentPatient.avatarColor }}
              icon={<UserOutlined />}
            />
            <div>
              <Title level={4} style={{ margin: 0 }}>
                {currentPatient.patientName}
              </Title>
              <Text type="secondary">{currentPatient.type}</Text>
            </div>
          </div>
          <Divider style={{ margin: "12px 0" }} />
          <Descriptions column={1} size="small">
            <Descriptions.Item label="Thời gian">
              <Tag color="blue">
                <ClockCircleOutlined /> {currentPatient.time}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Số điện thoại">
              {currentPatient.phone}
            </Descriptions.Item>
            <Descriptions.Item label="Email">
              {currentPatient.email}
            </Descriptions.Item>
          </Descriptions>
          <Button
            type="primary"
            block
            icon={<CheckOutlined />}
            onClick={() => {
              patientPopupRef.current?.openPopup(currentPatient);
            }}
          >
            Hoàn thành khám
          </Button>
        </Space>
      ) : (
        <div style={{ textAlign: "center", padding: "20px" }}>
          <UserSwitchOutlined style={{ fontSize: 48, color: "#d9d9d9" }} />
          <div style={{ marginTop: 12, color: "#bfbfbf" }}>
            Không có bệnh nhân đang khám
          </div>
        </div>
      )}
    </Card>
  );

  // Thành phần hiển thị bệnh nhân kế tiếp
  const NextPatientCard = () => (
    <Card
      title={
        <Space>
          <RightCircleOutlined />
          <span>Bệnh nhân kế tiếp</span>
        </Space>
      }
      loading={loading}
      bordered={false}
      style={{
        borderRadius: "8px",
        boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
        height: "100%",
      }}
    >
      {nextPatient ? (
        <Space direction="vertical" style={{ width: "100%" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Avatar
              size={64}
              style={{ backgroundColor: nextPatient.avatarColor }}
              icon={<UserOutlined />}
            />
            <div>
              <Title level={4} style={{ margin: 0 }}>
                {nextPatient.patientName}
              </Title>
              <Text type="secondary">{nextPatient.type}</Text>
            </div>
          </div>
          <Divider style={{ margin: "12px 0" }} />
          <Descriptions column={1} size="small">
            <Descriptions.Item label="Thời gian dự kiến">
              <Tag color="orange">
                <ClockCircleOutlined /> {nextPatient.time}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Trạng thái">
              <Tag
                color={nextPatient.status === "waiting" ? "orange" : "green"}
              >
                {nextPatient.status === "waiting" ? "Chờ khám" : "Sẵn sàng"}
              </Tag>
            </Descriptions.Item>
          </Descriptions>
          <Button
            type="default"
            block
            icon={<PlayCircleOutlined />}
            onClick={() => handleSwitchPatient(nextPatient.id)}
            disabled={currentPatient !== null}
          >
            Bắt đầu khám
          </Button>
        </Space>
      ) : (
        <div style={{ textAlign: "center", padding: "20px" }}>
          <RightCircleOutlined style={{ fontSize: 48, color: "#d9d9d9" }} />
          <div style={{ marginTop: 12, color: "#bfbfbf" }}>
            Không có bệnh nhân kế tiếp
          </div>
        </div>
      )}
    </Card>
  );

  return (
    <>
      <Layout>
        {/* Main Content */}
        <Content
          style={{
            margin: screens.xs ? "16px" : "24px 16px 0",
            overflow: "initial",
            paddingBottom: screens.xs ? "80px" : "24px",
          }}
        >
          {/* Header với filter */}
          <Card
            bordered={false}
            style={{
              marginBottom: 16,
              borderRadius: "8px",
              boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
            }}
          >
            <Row gutter={[16, 16]} align="middle" justify="space-between">
              <Col xs={24} md={12}>
                <Title level={3} style={{ margin: 0 }}>
                  <CalendarOutlined /> Dashboard
                </Title>
                <Text type="secondary">Quản lý lịch hẹn và bệnh nhân</Text>
              </Col>
              <Col xs={24} md={12}>
                <Space direction="vertical" style={{ width: "100%" }}>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    <Select
                      value={filterType}
                      onChange={setFilterType}
                      style={{ minWidth: 120 }}
                    >
                      <Option value="day">Theo ngày</Option>
                      <Option value="week">Theo tuần</Option>
                      <Option value="month">Theo tháng</Option>
                    </Select>
                    <RangePicker
                      value={dateRange}
                      onChange={handleFilterChange}
                      format="DD/MM/YYYY"
                      style={{ flex: 1 }}
                      allowClear={false}
                    />
                    <Button
                      icon={<FilterOutlined />}
                      onClick={() => {
                        setDateRange([
                          dayjs().startOf("day"),
                          dayjs().endOf("day"),
                        ]);
                        const todayAppts = sampleAppointments.filter(
                          (a) => a.date === dayjs().format("YYYY-MM-DD")
                        );
                        setAppointments(todayAppts);
                      }}
                    >
                      Hôm nay
                    </Button>
                  </div>
                  <Text type="secondary">
                    Hiển thị dữ liệu từ {dateRange[0].format("DD/MM/YYYY")} đến{" "}
                    {dateRange[1].format("DD/MM/YYYY")}
                  </Text>
                </Space>
              </Col>
            </Row>
          </Card>

          {/* Bệnh nhân hiện tại và kế tiếp */}
          <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
            <Col xs={24} md={12}>
              <CurrentPatientCard />
            </Col>
            <Col xs={24} md={12}>
              <NextPatientCard />
            </Col>
          </Row>

          {/* Stats Cards - Responsive */}
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} lg={6}>
              <Card
                loading={loading}
                bordered={false}
                style={{
                  borderRadius: "8px",
                  boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
                  height: "100%",
                }}
              >
                <Statistic
                  title={
                    <Space>
                      <CalendarOutlined style={{ color: "#1890ff" }} />
                      <span>Tổng cuộc hẹn</span>
                    </Space>
                  }
                  value={stats.totalAppointments || 0}
                  valueStyle={{
                    color: "#1890ff",
                    fontSize: screens.xs ? "24px" : "28px",
                  }}
                />
                <div style={{ marginTop: 8 }}>
                  <Text
                    type="secondary"
                    style={{ fontSize: screens.xs ? "12px" : "14px" }}
                  >
                    Khoảng thời gian đã chọn
                  </Text>
                </div>
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card
                loading={loading}
                bordered={false}
                style={{
                  borderRadius: "8px",
                  boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
                  height: "100%",
                }}
              >
                <Statistic
                  title={
                    <Space>
                      <TeamOutlined style={{ color: "#52c41a" }} />
                      <span>Bệnh nhân</span>
                    </Space>
                  }
                  value={stats.totalPatients || 0}
                  valueStyle={{
                    color: "#52c41a",
                    fontSize: screens.xs ? "24px" : "28px",
                  }}
                />
                <div style={{ marginTop: 8 }}>
                  <Text
                    type="secondary"
                    style={{ fontSize: screens.xs ? "12px" : "14px" }}
                  >
                    Tổng số
                  </Text>
                </div>
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card
                loading={loading}
                bordered={false}
                style={{
                  borderRadius: "8px",
                  boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
                  height: "100%",
                }}
              >
                <Statistic
                  title={
                    <Space>
                      <UserAddOutlined style={{ color: "#fa8c16" }} />
                      <span>Bệnh nhân mới</span>
                    </Space>
                  }
                  value={stats.newPatients || 0}
                  valueStyle={{
                    color: "#fa8c16",
                    fontSize: screens.xs ? "24px" : "28px",
                  }}
                />
                <div style={{ marginTop: 8 }}>
                  <Text
                    type="secondary"
                    style={{ fontSize: screens.xs ? "12px" : "14px" }}
                  >
                    Tháng này
                  </Text>
                </div>
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card
                loading={loading}
                bordered={false}
                style={{
                  borderRadius: "8px",
                  boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
                  height: "100%",
                }}
              >
                <Statistic
                  title={
                    <Space>
                      <DollarOutlined style={{ color: "#722ed1" }} />
                      <span>Doanh thu</span>
                    </Space>
                  }
                  value={stats.todayEarnings || 0}
                  formatter={(value) => formatCurrency(value)}
                  valueStyle={{
                    color: "#722ed1",
                    fontSize: screens.xs ? "20px" : "24px",
                  }}
                />
                <div style={{ marginTop: 8 }}>
                  <Text
                    type="secondary"
                    style={{ fontSize: screens.xs ? "12px" : "14px" }}
                  >
                    Khoảng thời gian đã chọn
                  </Text>
                </div>
              </Card>
            </Col>
          </Row>

          {/* Main Content Row */}
          <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
            {/* Lịch hẹn */}
            <Col xs={24} lg={16}>
              <Card
                title={
                  <Space>
                    <CalendarOutlined />
                    <span>
                      Lịch hẹn ({dateRange[0].format("DD/MM")} -{" "}
                      {dateRange[1].format("DD/MM")})
                    </span>
                    <Badge
                      count={appointments.length}
                      style={{ backgroundColor: "#1890ff" }}
                    />
                  </Space>
                }
                extra={
                  <Button type="primary" size={screens.xs ? "small" : "middle"}>
                    Xem tất cả
                  </Button>
                }
                loading={loading}
                bordered={false}
                style={{
                  borderRadius: "8px",
                  boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
                }}
              >
                <Table
                  columns={appointmentColumns}
                  dataSource={appointments}
                  pagination={false}
                  rowKey="id"
                  scroll={screens.xs ? { x: 500 } : {}}
                  size={screens.xs ? "small" : "middle"}
                  rowClassName={(record) => {
                    if (record.isCurrent) return "current-patient-row";
                    if (record.isNext) return "next-patient-row";
                    return "";
                  }}
                />
              </Card>
            </Col>

            {/* Thống kê nhanh */}
            <Col xs={24} lg={8}>
              <Card
                title={
                  <Space>
                    <LineChartOutlined />
                    <span>Thống kê nhanh</span>
                  </Space>
                }
                loading={loading}
                bordered={false}
                style={{
                  borderRadius: "8px",
                  boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
                }}
              >
                <Row gutter={[16, 24]}>
                  <Col xs={12} sm={12} md={12} lg={24} xl={12}>
                    <div style={{ textAlign: "center" }}>
                      <Progress
                        type="dashboard"
                        percent={calculatePercentage(
                          stats.completedAppointments,
                          stats.totalAppointments
                        )}
                        strokeColor={{
                          "0%": "#108ee9",
                          "100%": "#87d068",
                        }}
                        size={screens.xs ? 120 : 150}
                        format={(percent) => (
                          <div
                            style={{ fontSize: screens.xs ? "14px" : "16px" }}
                          >
                            <div style={{ fontWeight: "bold" }}>{percent}%</div>
                            <div
                              style={{ fontSize: screens.xs ? "10px" : "12px" }}
                            >
                              Hoàn thành
                            </div>
                          </div>
                        )}
                      />
                      <div
                        style={{
                          marginTop: 8,
                          fontSize: screens.xs ? "12px" : "14px",
                          fontWeight: 500,
                        }}
                      >
                        {stats.completedAppointments}/{stats.totalAppointments}{" "}
                        cuộc hẹn
                      </div>
                    </div>
                  </Col>
                  <Col xs={12} sm={12} md={12} lg={24} xl={12}>
                    <div style={{ textAlign: "center" }}>
                      <Progress
                        type="circle"
                        percent={calculatePercentage(
                          stats.pendingAppointments,
                          stats.totalAppointments
                        )}
                        strokeColor="#fa8c16"
                        size={screens.xs ? 120 : 150}
                        format={(percent) => (
                          <div
                            style={{ fontSize: screens.xs ? "14px" : "16px" }}
                          >
                            <div style={{ fontWeight: "bold" }}>{percent}%</div>
                            <div
                              style={{ fontSize: screens.xs ? "10px" : "12px" }}
                            >
                              Chờ xác nhận
                            </div>
                          </div>
                        )}
                      />
                      <div
                        style={{
                          marginTop: 8,
                          fontSize: screens.xs ? "12px" : "14px",
                          fontWeight: 500,
                        }}
                      >
                        {stats.pendingAppointments} cuộc hẹn
                      </div>
                    </div>
                  </Col>
                  <Col span={24}>
                    <div
                      style={{
                        background: "#f6ffed",
                        padding: "16px",
                        borderRadius: "8px",
                        border: "1px solid #b7eb8f",
                      }}
                    >
                      <Space
                        direction="vertical"
                        size={0}
                        style={{ width: "100%" }}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <Text strong>Doanh thu tháng:</Text>
                          <Text strong style={{ color: "#722ed1" }}>
                            {formatCurrency(stats.monthlyEarnings || 0)}
                          </Text>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            marginTop: 8,
                          }}
                        >
                          <Text type="secondary">Đã hủy:</Text>
                          <Text type="secondary">
                            {stats.cancelledAppointments || 0} cuộc hẹn
                          </Text>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            marginTop: 8,
                          }}
                        >
                          <Text type="secondary">Tỉ lệ hoàn thành:</Text>
                          <Text type="secondary">
                            {calculatePercentage(
                              stats.completedAppointments,
                              stats.totalAppointments
                            )}
                            %
                          </Text>
                        </div>
                      </Space>
                    </div>
                  </Col>
                </Row>
              </Card>
            </Col>
          </Row>
        </Content>
      </Layout>

      {/* Popup bệnh nhân */}
      <PatientPopup
        ref={patientPopupRef}
        onCancelAppointment={handleCancelAppointment}
      />
    </>
  );
};

export default Home;
