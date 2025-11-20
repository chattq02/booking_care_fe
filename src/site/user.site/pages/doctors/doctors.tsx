import React, { useState } from "react";
import {
  Card,
  Row,
  Col,
  Avatar,
  Tag,
  Rate,
  Divider,
  List,
  Button,
  Modal,
  Form,
  Input,
  Select,
  message,
  Descriptions,
  Tabs,
  Badge,
  Statistic,
  Space,
  Timeline,
} from "antd";
import {
  UserOutlined,
  ClockCircleOutlined,
  EnvironmentOutlined,
  PhoneOutlined,
  MailOutlined,
  StarOutlined,
  CalendarOutlined,
  HeartOutlined,
  TrophyOutlined,
  CheckCircleOutlined,
  DollarOutlined,
  LeftOutlined,
  RightOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";

const { Option } = Select;
const { TextArea } = Input;
const { TabPane } = Tabs;

const DoctorDetailPage = () => {
  const [selectedTime, setSelectedTime] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState("schedule");
  const [currentWeekOffset, setCurrentWeekOffset] = useState(0);
  const [selectedDate, setSelectedDate] = useState(null);
  const [bookingForm] = Form.useForm();

  // Dữ liệu mẫu cho bác sĩ
  const doctorData = {
    id: 1,
    name: "BS. Nguyễn Văn A",
    specialization: "Chuyên khoa Tim mạch",
    experience: 15,
    education: "Tiến sĩ Y khoa - Đại học Y Hà Nội",
    description:
      "Bác sĩ có hơn 15 năm kinh nghiệm trong lĩnh vực tim mạch, chuyên điều trị các bệnh lý về tim, huyết áp và các bệnh lý mạch vành. Với sự tận tâm và chuyên môn cao, bác sĩ đã giúp đỡ hàng ngàn bệnh nhân cải thiện sức khỏe tim mạch.",
    avatar:
      "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop&crop=face",
    rating: 4.8,
    totalReviews: 124,
    price: 300000,
    address: "Số 123, đường ABC, Quận 1, TP.HCM",
    phone: "0123 456 789",
    email: "bs.nguyenvana@hospital.com",
    skills: [
      "Tim mạch",
      "Huyết áp",
      "Siêu âm tim",
      "Điện tâm đồ",
      "Điều trị suy tim",
    ],
    achievements: [
      "Bằng khen Bộ Y tế 2020",
      "Giải thưởng Bác sĩ tiêu biểu 2019",
      "Nghiên cứu xuất sắc về tim mạch 2018",
    ],
    educationTimeline: [
      "2015-2017: Nghiên cứu sinh tại Đại học Y Harvard",
      "2010-2015: Bác sĩ nội trú chuyên khoa Tim mạch",
      "2005-2010: Bác sĩ đa khoa - Đại học Y Hà Nội",
    ],
  };

  // Hàm tạo dữ liệu khung giờ khám
  const generateTimeSlots = (date) => {
    const dayOfWeek = dayjs(date).day();

    // Giả lập dữ liệu - trong thực tế sẽ lấy từ API
    const baseSlots = [
      {
        time: "08:00 - 08:30",
        available: Math.random() > 0.3,
        type: "morning",
      },
      {
        time: "08:30 - 09:00",
        available: Math.random() > 0.3,
        type: "morning",
      },
      {
        time: "09:00 - 09:30",
        available: Math.random() > 0.3,
        type: "morning",
      },
      {
        time: "09:30 - 10:00",
        available: Math.random() > 0.3,
        type: "morning",
      },
      {
        time: "10:00 - 10:30",
        available: Math.random() > 0.3,
        type: "morning",
      },
      {
        time: "10:30 - 11:00",
        available: Math.random() > 0.3,
        type: "morning",
      },
      {
        time: "14:00 - 14:30",
        available: Math.random() > 0.3,
        type: "afternoon",
      },
      {
        time: "14:30 - 15:00",
        available: Math.random() > 0.3,
        type: "afternoon",
      },
      {
        time: "15:00 - 15:30",
        available: Math.random() > 0.3,
        type: "afternoon",
      },
      {
        time: "15:30 - 16:00",
        available: Math.random() > 0.3,
        type: "afternoon",
      },
      {
        time: "16:00 - 16:30",
        available: Math.random() > 0.3,
        type: "afternoon",
      },
      {
        time: "16:30 - 17:00",
        available: Math.random() > 0.3,
        type: "afternoon",
      },
    ];

    // Cuối tuần có ít khung giờ hơn
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      return baseSlots.slice(0, 8);
    }

    return baseSlots;
  };

  // Hàm tạo danh sách ngày trong tuần (từ Thứ 2 đến Chủ nhật)
  const getWeekDays = (weekOffset = 0) => {
    const today = dayjs();
    // Bắt đầu từ Thứ 2 (day 1)
    const startOfWeek = today
      .startOf("week")
      .add(1, "day")
      .add(weekOffset * 7, "day");

    const days = [];
    const dayNames = [
      "Chủ nhật",
      "Thứ 2",
      "Thứ 3",
      "Thứ 4",
      "Thứ 5",
      "Thứ 6",
      "Thứ 7",
    ];

    // Tạo 7 ngày từ Thứ 2 đến Chủ nhật
    for (let i = 0; i < 7; i++) {
      const date = startOfWeek.add(i, "day");
      const dayOfWeek = date.day();

      days.push({
        date: date.format("YYYY-MM-DD"),
        dayName: dayNames[dayOfWeek],
        displayDate: date.format("DD/MM/YYYY"),
        dayOfWeek: dayOfWeek,
        isToday: date.isSame(today, "day"),
        timeSlots: generateTimeSlots(date),
      });
    }

    return days;
  };

  const weekDays = getWeekDays(currentWeekOffset);

  // Chọn ngày đầu tiên (Thứ 2) khi component mount
  React.useEffect(() => {
    if (!selectedDate && weekDays.length > 0) {
      setSelectedDate(weekDays[0]); // Mặc định chọn Thứ 2 (phần tử đầu tiên)
    }
  }, [weekDays, selectedDate]);

  const handleTimeSelect = (timeSlot) => {
    setSelectedTime({
      date: selectedDate.date,
      day: selectedDate.dayName,
      time: timeSlot.time,
      displayDate: selectedDate.displayDate,
    });
    setIsModalVisible(true);
  };

  const handleDateSelect = (day) => {
    setSelectedDate(day);
  };

  const handleNextWeek = () => {
    setCurrentWeekOffset((prev) => prev + 1);
    setSelectedDate(null);
  };

  const handlePrevWeek = () => {
    setCurrentWeekOffset((prev) => prev - 1);
    setSelectedDate(null);
  };

  const handleBooking = async (values) => {
    try {
      console.log("Đặt lịch:", {
        ...values,
        doctor: doctorData.name,
        time: selectedTime,
        price: doctorData.price,
      });

      message.success("Đặt lịch khám thành công!");
      setIsModalVisible(false);
      bookingForm.resetFields();
      setSelectedTime(null);
    } catch (error) {
      message.error("Có lỗi xảy ra khi đặt lịch!");
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const getTimeSlotColor = (type) => {
    return type === "morning" ? "#1890ff" : "#52c41a";
  };

  const isDateSelected = (date) => {
    return selectedDate && selectedDate.date === date;
  };
  return (
    <div
      style={{
        padding: "24px",
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
        minHeight: "100vh",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial',
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <Row gutter={[24, 24]}>
          {/* Thông tin bác sĩ - Sidebar */}
          <Col xs={24} lg={8}>
            <Card
              style={{
                borderRadius: "16px",
                boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
                border: "none",
                overflow: "hidden",
              }}
              bodyStyle={{ padding: 0 }}
            >
              {/* Header với gradient */}
              <div
                style={{
                  background:
                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  padding: "32px 24px 24px",
                  textAlign: "center",
                  color: "white",
                }}
              >
                <Badge.Ribbon text="Chuyên gia" color="gold">
                  <Avatar
                    size={100}
                    src={doctorData.avatar}
                    icon={<UserOutlined />}
                    style={{
                      border: "4px solid rgba(255,255,255,0.3)",
                      marginBottom: 16,
                    }}
                  />
                </Badge.Ribbon>
                <h2
                  style={{
                    color: "white",
                    margin: "8px 0 4px",
                    fontSize: "20px",
                    fontWeight: 600,
                  }}
                >
                  {doctorData.name}
                </h2>
                <p
                  style={{
                    color: "rgba(255,255,255,0.9)",
                    fontSize: "14px",
                    margin: 0,
                  }}
                >
                  {doctorData.specialization}
                </p>

                <div style={{ margin: "16px 0" }}>
                  <Rate
                    disabled
                    defaultValue={doctorData.rating}
                    style={{ fontSize: "16px", color: "#ffd666" }}
                  />
                  <div
                    style={{
                      marginTop: 8,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 8,
                    }}
                  >
                    <span style={{ color: "#ffd666", fontWeight: 600 }}>
                      <StarOutlined /> {doctorData.rating}
                    </span>
                    <span style={{ color: "rgba(255,255,255,0.8)" }}>
                      ({doctorData.totalReviews} đánh giá)
                    </span>
                  </div>
                </div>
              </div>

              {/* Thông tin chi tiết */}
              <div style={{ padding: "24px" }}>
                <Space
                  direction="vertical"
                  size="middle"
                  style={{ width: "100%" }}
                >
                  <Statistic
                    title="Kinh nghiệm"
                    value={doctorData.experience}
                    suffix="năm"
                    prefix={<TrophyOutlined style={{ color: "#1890ff" }} />}
                  />

                  <Divider style={{ margin: "16px 0" }} />

                  <Descriptions column={1} size="small">
                    <Descriptions.Item
                      label={
                        <span
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                          }}
                        >
                          <HeartOutlined style={{ color: "#52c41a" }} />
                          Học vấn
                        </span>
                      }
                    >
                      {doctorData.education}
                    </Descriptions.Item>
                    <Descriptions.Item
                      label={
                        <span
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                          }}
                        >
                          <EnvironmentOutlined style={{ color: "#fa541c" }} />
                          Địa chỉ
                        </span>
                      }
                    >
                      {doctorData.address}
                    </Descriptions.Item>
                    <Descriptions.Item
                      label={
                        <span
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                          }}
                        >
                          <PhoneOutlined style={{ color: "#13c2c2" }} />
                          Điện thoại
                        </span>
                      }
                    >
                      {doctorData.phone}
                    </Descriptions.Item>
                    <Descriptions.Item
                      label={
                        <span
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                          }}
                        >
                          <MailOutlined style={{ color: "#722ed1" }} />
                          Email
                        </span>
                      }
                    >
                      {doctorData.email}
                    </Descriptions.Item>
                  </Descriptions>

                  <Divider style={{ margin: "16px 0" }} />

                  <div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginBottom: 12,
                      }}
                    >
                      <h4 style={{ margin: 0, color: "#262626" }}>Giá khám</h4>
                      <span
                        style={{
                          color: "#ff4d4f",
                          fontWeight: "bold",
                          fontSize: "18px",
                        }}
                      >
                        {formatCurrency(doctorData.price)}
                      </span>
                    </div>
                    <Button
                      type="primary"
                      size="large"
                      block
                      icon={<CalendarOutlined />}
                      onClick={() => setActiveTab("schedule")}
                      style={{
                        background:
                          "linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)",
                        border: "none",
                        borderRadius: "8px",
                        height: "48px",
                        fontWeight: 600,
                      }}
                    >
                      Đặt lịch ngay
                    </Button>
                  </div>

                  <Divider style={{ margin: "16px 0" }} />

                  <div>
                    <h4 style={{ marginBottom: 12, color: "#262626" }}>
                      Chuyên môn
                    </h4>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                      {doctorData.skills.map((skill, index) => (
                        <Tag
                          key={index}
                          color="blue"
                          style={{
                            borderRadius: "16px",
                            padding: "4px 12px",
                            border: "none",
                            background: "rgba(24, 144, 255, 0.1)",
                            color: "#1890ff",
                            fontWeight: 500,
                          }}
                        >
                          {skill}
                        </Tag>
                      ))}
                    </div>
                  </div>
                </Space>
              </div>
            </Card>
          </Col>

          {/* Nội dung chính */}
          <Col xs={24} lg={16}>
            <Card
              style={{
                borderRadius: "16px",
                boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
                border: "none",
                minHeight: "600px",
              }}
              bodyStyle={{ padding: 0 }}
            >
              <Tabs
                activeKey={activeTab}
                onChange={setActiveTab}
                style={{ padding: "0 24px" }}
                tabBarStyle={{
                  margin: 0,
                  borderBottom: "1px solid #f0f0f0",
                }}
              >
                <TabPane
                  tab={
                    <span
                      style={{ display: "flex", alignItems: "center", gap: 8 }}
                    >
                      <CalendarOutlined />
                      Đặt lịch khám
                    </span>
                  }
                  key="schedule"
                >
                  <div style={{ padding: "24px 0" }}>
                    <div style={{ marginBottom: 32 }}>
                      <h2
                        style={{
                          color: "#262626",
                          marginBottom: 8,
                          fontSize: "24px",
                        }}
                      >
                        Lịch khám bệnh
                      </h2>
                      <p
                        style={{
                          color: "#666",
                          fontSize: "15px",
                          margin: 0,
                        }}
                      >
                        Chọn khung giờ phù hợp để đặt lịch khám với{" "}
                        {doctorData.name}
                      </p>
                    </div>
                    <div style={{ marginBottom: 32 }}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginBottom: 16,
                        }}
                      >
                        <Button
                          icon={<LeftOutlined />}
                          onClick={handlePrevWeek}
                          style={{ borderRadius: "8px" }}
                        >
                          Tuần trước
                        </Button>

                        <div
                          style={{
                            background:
                              "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                            color: "white",
                            padding: "8px 20px",
                            borderRadius: "20px",
                            fontWeight: 600,
                          }}
                        >
                          {weekDays[0]?.displayDate} -{" "}
                          {weekDays[6]?.displayDate}
                        </div>

                        <Button
                          icon={<RightOutlined />}
                          onClick={handleNextWeek}
                          style={{ borderRadius: "8px" }}
                        >
                          Tuần sau
                        </Button>
                      </div>

                      {/* Danh sách các ngày trong tuần từ Thứ 2 đến Chủ nhật */}
                      <Row gutter={[8, 8]}>
                        {weekDays.map((day, index) => (
                          <Col
                            xs={24}
                            sm={12}
                            md={8}
                            lg={12 / 7}
                            key={day.date}
                          >
                            <div
                              onClick={() => handleDateSelect(day)}
                              style={{
                                padding: "16px 8px",
                                textAlign: "center",
                                borderRadius: "12px",
                                cursor: "pointer",
                                border: `2px solid ${
                                  isDateSelected(day.date)
                                    ? "#1890ff"
                                    : "#f0f0f0"
                                }`,
                                background: isDateSelected(day.date)
                                  ? "#e6f7ff"
                                  : "white",
                                transition: "all 0.3s ease",
                                position: "relative",
                                minHeight: "80px",
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",
                              }}
                            >
                              {day.isToday && (
                                <div
                                  style={{
                                    position: "absolute",
                                    top: 4,
                                    right: 4,
                                    background: "#ff4d4f",
                                    color: "white",
                                    fontSize: "10px",
                                    padding: "2px 6px",
                                    borderRadius: "8px",
                                  }}
                                >
                                  Hôm nay
                                </div>
                              )}
                              <div
                                style={{
                                  fontSize: "14px",
                                  fontWeight: isDateSelected(day.date)
                                    ? 600
                                    : 400,
                                  color: isDateSelected(day.date)
                                    ? "#1890ff"
                                    : "#666",
                                  marginBottom: "4px",
                                }}
                              >
                                {day.dayName}
                              </div>
                              <div
                                style={{
                                  fontSize: "16px",
                                  fontWeight: 600,
                                  color: isDateSelected(day.date)
                                    ? "#1890ff"
                                    : "#262626",
                                }}
                              >
                                {day.displayDate.split("/")[0]}/
                                {day.displayDate.split("/")[1]}
                              </div>
                              {/* Hiển thị số khung giờ còn trống */}
                              <div
                                style={{
                                  fontSize: "11px",
                                  color: "#52c41a",
                                  marginTop: "4px",
                                }}
                              >
                                {
                                  day.timeSlots.filter((slot) => slot.available)
                                    .length
                                }{" "}
                                khung trống
                              </div>
                            </div>
                          </Col>
                        ))}
                      </Row>
                    </div>

                    {/* Hiển thị khung giờ của ngày được chọn */}
                    {selectedDate && (
                      <div>
                        <div
                          style={{
                            background:
                              "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                            color: "white",
                            padding: "16px 20px",
                            borderRadius: "12px",
                            marginBottom: 20,
                          }}
                        >
                          <h4
                            style={{
                              color: "white",
                              margin: 0,
                              fontSize: "16px",
                              fontWeight: 600,
                            }}
                          >
                            {selectedDate.dayName} - {selectedDate.displayDate}
                            <span
                              style={{
                                float: "right",
                                fontSize: "14px",
                                fontWeight: "normal",
                              }}
                            >
                              {
                                selectedDate.timeSlots.filter(
                                  (slot) => slot.available
                                ).length
                              }{" "}
                              khung giờ trống
                            </span>
                          </h4>
                        </div>

                        {/* Buổi sáng */}
                        <div style={{ marginBottom: 32 }}>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              marginBottom: 16,
                            }}
                          >
                            <h5 style={{ color: "#1890ff", margin: 0 }}>
                              🌅 Buổi sáng (08:00 - 12:00)
                            </h5>
                            <span style={{ color: "#666", fontSize: "14px" }}>
                              {
                                selectedDate.timeSlots.filter(
                                  (slot) =>
                                    slot.type === "morning" && slot.available
                                ).length
                              }{" "}
                              khung trống
                            </span>
                          </div>
                          <Row gutter={[12, 12]}>
                            {selectedDate.timeSlots
                              .filter((slot) => slot.type === "morning")
                              .map((slot, slotIndex) => (
                                <Col xs={12} sm={8} md={6} key={slotIndex}>
                                  <Button
                                    type={
                                      selectedTime?.time === slot.time &&
                                      selectedTime?.date === selectedDate.date
                                        ? "primary"
                                        : "default"
                                    }
                                    disabled={!slot.available}
                                    block
                                    onClick={() => handleTimeSelect(slot)}
                                    style={{
                                      height: "auto",
                                      padding: "12px 8px",
                                      whiteSpace: "normal",
                                      lineHeight: "1.4",
                                      borderRadius: "8px",
                                      borderColor: slot.available
                                        ? "#1890ff"
                                        : "#d9d9d9",
                                      color: slot.available
                                        ? selectedTime?.time === slot.time &&
                                          selectedTime?.date ===
                                            selectedDate.date
                                          ? "white"
                                          : "#1890ff"
                                        : "#999",
                                      background:
                                        selectedTime?.time === slot.time &&
                                        selectedTime?.date === selectedDate.date
                                          ? "#1890ff"
                                          : "transparent",
                                      fontWeight: 500,
                                    }}
                                  >
                                    <div>
                                      <ClockCircleOutlined />
                                      <div style={{ marginTop: 4 }}>
                                        {slot.time}
                                      </div>
                                      {!slot.available && (
                                        <div
                                          style={{
                                            fontSize: "11px",
                                            color: "#ff4d4f",
                                          }}
                                        >
                                          Đã kín
                                        </div>
                                      )}
                                    </div>
                                  </Button>
                                </Col>
                              ))}
                          </Row>
                        </div>

                        {/* Buổi chiều */}
                        <div>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              marginBottom: 16,
                            }}
                          >
                            <h5 style={{ color: "#52c41a", margin: 0 }}>
                              🌇 Buổi chiều (14:00 - 17:00)
                            </h5>
                            <span style={{ color: "#666", fontSize: "14px" }}>
                              {
                                selectedDate.timeSlots.filter(
                                  (slot) =>
                                    slot.type === "afternoon" && slot.available
                                ).length
                              }{" "}
                              khung trống
                            </span>
                          </div>
                          <Row gutter={[12, 12]}>
                            {selectedDate.timeSlots
                              .filter((slot) => slot.type === "afternoon")
                              .map((slot, slotIndex) => (
                                <Col xs={12} sm={8} md={6} key={slotIndex}>
                                  <Button
                                    type={
                                      selectedTime?.time === slot.time &&
                                      selectedTime?.date === selectedDate.date
                                        ? "primary"
                                        : "default"
                                    }
                                    disabled={!slot.available}
                                    block
                                    onClick={() => handleTimeSelect(slot)}
                                    style={{
                                      height: "auto",
                                      padding: "12px 8px",
                                      whiteSpace: "normal",
                                      lineHeight: "1.4",
                                      borderRadius: "8px",
                                      borderColor: slot.available
                                        ? "#52c41a"
                                        : "#d9d9d9",
                                      color: slot.available
                                        ? selectedTime?.time === slot.time &&
                                          selectedTime?.date ===
                                            selectedDate.date
                                          ? "white"
                                          : "#52c41a"
                                        : "#999",
                                      background:
                                        selectedTime?.time === slot.time &&
                                        selectedTime?.date === selectedDate.date
                                          ? "#52c41a"
                                          : "transparent",
                                      fontWeight: 500,
                                    }}
                                  >
                                    <div>
                                      <ClockCircleOutlined />
                                      <div style={{ marginTop: 4 }}>
                                        {slot.time}
                                      </div>
                                      {!slot.available && (
                                        <div
                                          style={{
                                            fontSize: "11px",
                                            color: "#ff4d4f",
                                          }}
                                        >
                                          Đã kín
                                        </div>
                                      )}
                                    </div>
                                  </Button>
                                </Col>
                              ))}
                          </Row>
                        </div>
                      </div>
                    )}

                    {!selectedDate && (
                      <div
                        style={{
                          textAlign: "center",
                          padding: "40px",
                          color: "#666",
                        }}
                      >
                        <CalendarOutlined
                          style={{ fontSize: "48px", marginBottom: 16 }}
                        />
                        <p>Vui lòng chọn một ngày để xem khung giờ khám</p>
                      </div>
                    )}
                  </div>
                </TabPane>

                <TabPane
                  tab={
                    <span
                      style={{ display: "flex", alignItems: "center", gap: 8 }}
                    >
                      <UserOutlined />
                      Giới thiệu
                    </span>
                  }
                  key="about"
                >
                  <div style={{ padding: "24px 0" }}>
                    <div style={{ marginBottom: 32 }}>
                      <h2 style={{ color: "#262626", marginBottom: 16 }}>
                        Giới thiệu về bác sĩ
                      </h2>
                      <div
                        style={{
                          background:
                            "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
                          padding: "20px",
                          borderRadius: "12px",
                          color: "white",
                        }}
                      >
                        <p
                          style={{
                            lineHeight: "1.8",
                            fontSize: "15px",
                            margin: 0,
                            textAlign: "center",
                            fontStyle: "italic",
                          }}
                        >
                          "{doctorData.description}"
                        </p>
                      </div>
                    </div>

                    <Row gutter={[24, 24]}>
                      <Col xs={24} lg={12}>
                        <Card
                          title={
                            <span
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 8,
                              }}
                            >
                              <HeartOutlined style={{ color: "#1890ff" }} />
                              Quá trình đào tạo
                            </span>
                          }
                          style={{ borderRadius: "12px" }}
                        >
                          <Timeline>
                            {doctorData.educationTimeline.map((item, index) => (
                              <Timeline.Item key={index} color="blue">
                                {item}
                              </Timeline.Item>
                            ))}
                          </Timeline>
                        </Card>
                      </Col>

                      <Col xs={24} lg={12}>
                        <Card
                          title={
                            <span
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 8,
                              }}
                            >
                              <HeartOutlined style={{ color: "#faad14" }} />
                              Thành tích
                            </span>
                          }
                          style={{ borderRadius: "12px" }}
                        >
                          <List
                            size="small"
                            dataSource={doctorData.achievements}
                            renderItem={(item) => (
                              <List.Item>
                                <CheckCircleOutlined
                                  style={{ color: "#52c41a", marginRight: 8 }}
                                />
                                {item}
                              </List.Item>
                            )}
                          />
                        </Card>
                      </Col>
                    </Row>
                  </div>
                </TabPane>
              </Tabs>
            </Card>
          </Col>
        </Row>
      </div>

      {/* Modal đặt lịch */}
      <Modal
        title={
          <div style={{ textAlign: "center", padding: "16px 0" }}>
            <CalendarOutlined
              style={{ color: "#1890ff", fontSize: "24px", marginRight: 8 }}
            />
            <span style={{ fontSize: "18px", fontWeight: 600 }}>
              Đặt lịch khám
            </span>
          </div>
        }
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setSelectedTime(null);
        }}
        footer={null}
        width={500}
        style={{ borderRadius: "16px" }}
      >
        <Form form={bookingForm} layout="vertical" onFinish={handleBooking}>
          <div
            style={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              padding: "20px",
              borderRadius: "12px",
              color: "white",
              marginBottom: "24px",
            }}
          >
            <h4 style={{ color: "white", marginBottom: 12 }}>
              Thông tin đặt lịch
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>
                  <strong>Bác sĩ:</strong>
                </span>
                <span>{doctorData.name}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>
                  <strong>Thời gian:</strong>
                </span>
                <span>
                  {selectedTime?.day} - {selectedTime?.time}
                </span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>
                  <strong>Phí khám:</strong>
                </span>
                <span style={{ fontWeight: "bold" }}>
                  {formatCurrency(doctorData.price)}
                </span>
              </div>
            </div>
          </div>

          <Form.Item
            label="Họ và tên"
            name="patientName"
            rules={[{ required: true, message: "Vui lòng nhập họ tên" }]}
          >
            <Input
              placeholder="Nhập họ và tên"
              size="large"
              style={{ borderRadius: "8px" }}
            />
          </Form.Item>

          <Form.Item
            label="Số điện thoại"
            name="phone"
            rules={[
              { required: true, message: "Vui lòng nhập số điện thoại" },
              {
                pattern: /^[0-9]{10,11}$/,
                message: "Số điện thoại không hợp lệ",
              },
            ]}
          >
            <Input
              placeholder="Nhập số điện thoại"
              size="large"
              style={{ borderRadius: "8px" }}
            />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Vui lòng nhập email" },
              { type: "email", message: "Email không hợp lệ" },
            ]}
          >
            <Input
              placeholder="Nhập email"
              size="large"
              style={{ borderRadius: "8px" }}
            />
          </Form.Item>

          <Form.Item label="Triệu chứng/Lý do khám" name="symptoms">
            <TextArea
              rows={4}
              placeholder="Mô tả triệu chứng hoặc lý do khám (nếu có)"
              style={{ borderRadius: "8px" }}
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              size="large"
              style={{
                background: "linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)",
                border: "none",
                borderRadius: "8px",
                height: "48px",
                fontWeight: 600,
                fontSize: "16px",
              }}
            >
              <DollarOutlined />
              Xác nhận đặt lịch - {formatCurrency(doctorData.price)}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default DoctorDetailPage;
