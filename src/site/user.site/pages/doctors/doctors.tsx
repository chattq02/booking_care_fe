import { useState } from "react";
import {
  Button,
  Modal,
  Form,
  Input,
  message,
  Descriptions,
  Tabs,
  Space,
  Flex,
  DatePicker,
  ConfigProvider,
  Spin,
  Tag,
  Empty,
} from "antd";
import {
  UserOutlined,
  CalendarOutlined,
  DollarOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import viVN from "antd/locale/vi_VN";
import { useParams } from "react-router-dom";
import {
  useGetDetailDoctor,
  useGetScheduleDoctor,
} from "../home/hooks/useGetListDoctor";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getFirstLetter } from "@/helpers/helper";

import { v4 } from "uuid";

dayjs.locale("vi");

const { TextArea } = Input;
const { TabPane } = Tabs;

const DoctorPage = () => {
  const { id } = useParams();

  const { data, isLoading } = useGetDetailDoctor(Number(id));

  console.log("data", data);
  const [selectedTime, setSelectedTime] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState("schedule");
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [bookingForm] = Form.useForm();

  const { data: scheduleData, isLoading: isScheduleLoading } =
    useGetScheduleDoctor({
      doctorId: Number(id),
      date: selectedDate.format("YYYY-MM-DD"),
    });

  const handleBooking = async (values) => {
    try {
      // console.log("Đặt lịch:", {
      //   ...values,
      //   doctor: doctorData.name,
      //   time: selectedTime,
      //   price: doctorData.price,
      // });

      message.success("Đặt lịch khám thành công!");
      setIsModalVisible(false);
      bookingForm.resetFields();
      setSelectedTime(null);
    } catch (error) {
      message.error("Có lỗi xảy ra khi đặt lịch!");
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  if (isLoading) {
    return (
      <Flex justify="center" align="center">
        <Spin spinning />
      </Flex>
    );
  }

  console.log("scheduleData", scheduleData);

  return (
    <div style={{ padding: "20px 20px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div className="bg-white p-4 rounded-t-md border">
          <Flex gap={20}>
            <Avatar className="h-40 w-40 rounded-md! object-cover">
              <AvatarImage src={data?.avatar ?? ""} alt={data?.fullName} />
              <AvatarFallback className="h-full w-full rounded-md! object-cover text-[30px] font-bold bg-[#d4f3ee]">
                {getFirstLetter(data?.fullName ?? "")}
              </AvatarFallback>
            </Avatar>

            <div>
              <h2
                style={{
                  margin: "8px 0 4px",
                  fontSize: "20px",
                  fontWeight: 600,
                }}
              >
                {data?.academicTitle ? (
                  <Flex gap={10}>
                    {`BS. ${data?.fullName}`}
                    <Badge
                      variant="secondary"
                      className="w-fit text-xs font-medium bg-[#e0e5eb] text-[#455768]"
                    >
                      {data?.academicTitle.name}
                    </Badge>
                  </Flex>
                ) : (
                  `BS. ${data?.fullName}`
                )}
              </h2>
              <Space
                direction="vertical"
                size="middle"
                style={{ width: "100%" }}
              >
                <Descriptions column={1} size="small">
                  <Descriptions.Item
                    label={<span>Chuyên khoa</span>}
                    className="line-clamp-2"
                  >
                    {data?.departments.map((item) => item.name).join(` • `)}
                  </Descriptions.Item>
                  <Descriptions.Item
                    label={<span>Địa chỉ khám</span>}
                    className="line-clamp-2"
                  >
                    {data?.facilities.map((item) => item.name).join(" • ")}
                  </Descriptions.Item>
                  <Descriptions.Item label={<span>Điện thoại</span>}>
                    {data?.phone}
                  </Descriptions.Item>
                  <Descriptions.Item label={<span>Email</span>}>
                    {data?.email}
                  </Descriptions.Item>
                </Descriptions>
              </Space>
            </div>
          </Flex>
        </div>
        <div className="bg-white border-t-0 border rounded-b-md">
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
                <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <CalendarOutlined />
                  Đặt lịch khám
                </span>
              }
              key="schedule"
            >
              <div style={{ padding: "24px 0" }}>
                {/* Date Picker */}
                <Flex
                  align="center"
                  style={{ marginBottom: 24, borderRadius: 12 }}
                  gap={15}
                >
                  <div>
                    <h4>📅 Chọn ngày khám</h4>
                  </div>
                  <ConfigProvider locale={viVN}>
                    <DatePicker
                      value={selectedDate}
                      onChange={setSelectedDate}
                      format={(date) => {
                        const formatted = date.format("dddd - DD/MM/YYYY"); // vd: "chủ nhật - 23/11/2025"
                        return (
                          formatted.charAt(0).toUpperCase() + formatted.slice(1)
                        );
                      }}
                      disabledDate={(current) =>
                        current && current < dayjs().startOf("day")
                      }
                      placeholder="Chọn ngày khám"
                      size="large"
                    />
                  </ConfigProvider>
                </Flex>
                {scheduleData ? (
                  scheduleData?.map((item) => (
                    <div key={item.id} style={{ marginBottom: 24 }}>
                      {/* Header thông tin config */}
                      <div
                        className="border border-b-0 rounded-t-md"
                        style={{
                          background: "#f0f8ff",
                          padding: "12px 16px",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 16,
                            flexWrap: "wrap",
                          }}
                        >
                          <span
                            style={{
                              fontSize: "16px",
                              fontWeight: 600,
                              color: "#1890ff",
                            }}
                          >
                            {item.configName}
                          </span>
                          <div
                            style={{
                              display: "flex",
                              gap: 12,
                              fontSize: "14px",
                              color: "#666",
                            }}
                          >
                            <span>
                              🕒 {item.workStartTime} - {item.workEndTime}
                            </span>
                            <span>⏱️ {item.slotDuration} phút</span>
                            <span>
                              💰{" "}
                              {new Intl.NumberFormat("vi-VN").format(
                                item.price
                              )}{" "}
                              VND
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Các ngày trong lịch */}
                      {item.daySchedules?.map((daySchedule) => (
                        <div
                          key={`${daySchedule.date}`}
                          style={{ marginBottom: 20 }}
                        >
                          {/* Các slot */}
                          <Flex
                            gap={15}
                            wrap="wrap"
                            className="border border-t-0 rounded-b-md"
                            style={{
                              padding: "20px",
                              background: "#fff",
                            }}
                          >
                            {daySchedule.slots?.map((slot, index) => (
                              <Tag
                                key={`${daySchedule.date}-${index}`}
                                color={slot.selected ? "blue" : "default"}
                                style={{
                                  cursor: "pointer",
                                  padding: "8px 12px",
                                  margin: 0,
                                  flexShrink: 0,
                                  borderRadius: "6px",
                                  border: `1px solid ${
                                    slot.selected ? "#1890ff" : "#d9d9d9"
                                  }`,
                                  background: slot.selected
                                    ? "#e6f7ff"
                                    : "#fff",
                                  color: slot.selected ? "#1890ff" : "#000",
                                  fontWeight: 500,
                                  fontSize: "14px",
                                  transition: "all 0.3s ease",
                                  boxShadow: slot.selected
                                    ? "0 2px 4px rgba(24, 144, 255, 0.2)"
                                    : "none",
                                  overflow: "hidden",
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.transform =
                                    "translateY(-2px)";
                                  e.currentTarget.style.boxShadow =
                                    "0 4px 8px rgba(0, 0, 0, 0.1)";
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.transform =
                                    "translateY(0)";
                                  e.currentTarget.style.boxShadow =
                                    slot.selected
                                      ? "0 2px 4px rgba(24, 144, 255, 0.2)"
                                      : "none";
                                }}
                                onClick={() =>
                                  console.log("Slot clicked:", slot)
                                }
                              >
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 4,
                                  }}
                                >
                                  <ClockCircleOutlined
                                    style={{ fontSize: "12px" }}
                                  />
                                  <span>
                                    {slot.startTime} - {slot.endTime}
                                  </span>
                                </div>
                              </Tag>
                            ))}
                          </Flex>
                        </div>
                      ))}
                    </div>
                  ))
                ) : (
                  <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description="Không có lịch khám nào"
                    style={{
                      margin: "40px 0",
                      color: "#999",
                    }}
                  />
                )}
              </div>
            </TabPane>

            {/* Tab Giới thiệu (giữ nguyên) */}
            <TabPane
              tab={
                <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <UserOutlined />
                  Giới thiệu
                </span>
              }
              key="about"
            >
              {/* ... (giữ nguyên nội dung tab about) ... */}
            </TabPane>
          </Tabs>
        </div>
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
                <span>{data?.fullName}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>
                  <strong>Thời gian:</strong>
                </span>
                <span></span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>
                  <strong>Phí khám:</strong>
                </span>
                <span style={{ fontWeight: "bold" }}>
                  {/* {formatCurrency(doctorData.price)} */}
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
              {/* Xác nhận đặt lịch - {formatCurrency(doctorData.price)} */}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default DoctorPage;
