import { useState } from "react";
import {
  Layout,
  Card,
  Row,
  Col,
  Statistic,
  Tag,
  Button,
  Avatar,
  Typography,
  Space,
  Progress,
  Grid,
  DatePicker,
  Divider,
  Descriptions,
} from "antd";
import {
  UserOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  DollarOutlined,
  TeamOutlined,
  UserSwitchOutlined,
  RightCircleOutlined,
  FilterOutlined,
  LineChartOutlined,
} from "@ant-design/icons";
import dayjs, { Dayjs } from "dayjs";
import "dayjs/locale/vi";
import advancedFormat from "dayjs/plugin/advancedFormat";
import customParseFormat from "dayjs/plugin/customParseFormat";
import AppointmentTable from "./components/appointment-table";
import {
  useAppointmentReport,
  useGetCurrentAndNextPatient,
} from "../list-appointment/hooks/useAppointment";
import type { RangePickerProps } from "antd/es/date-picker";
import { useNavigate } from "react-router-dom";
import { PATH_ROUTE_DOCTOR } from "../../lib/enums/path";

dayjs.locale("vi");
dayjs.extend(advancedFormat);
dayjs.extend(customParseFormat);

const { Content } = Layout;
const { Title, Text } = Typography;
const { useBreakpoint } = Grid;
const { RangePicker } = DatePicker;

const Home = () => {
  const [dateRange, setDateRange] = useState<[Dayjs, Dayjs]>([
    dayjs().startOf("month"),
    dayjs().endOf("month"),
  ]);
  const nav = useNavigate();

  const { data, isLoading, refetch } = useAppointmentReport({
    fromDate: dateRange[0].format("YYYY-MM-DD"),
    toDate: dateRange[1].format("YYYY-MM-DD"),
  });

  const { data: dataUser, isLoading: isLoadingUser } =
    useGetCurrentAndNextPatient({
      doctorId: null,
      appointmentDate: dayjs().format("YYYY-MM-DD"),
    });

  const screens = useBreakpoint();

  // Xử lý khi thay đổi giá trị
  const handleFilterChange: RangePickerProps["onChange"] = (dates: any) => {
    setDateRange(dates);
  };

  // Format tiền tệ
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
    }).format(Number(amount) || 0);
  };

  // Tính phần trăm cho thống kê
  const calculatePercentage = (value: number, total: number) => {
    return total > 0 ? Math.round((Number(value) / Number(total)) * 100) : 0;
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
      loading={isLoadingUser}
      style={{
        borderRadius: "8px",
        boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
        height: "100%",
      }}
    >
      {dataUser?.current ? (
        <Space direction="vertical" style={{ width: "100%" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Avatar
              size={64}
              // style={{ backgroundColor: currentPatient.avatarColor }}
              icon={<UserOutlined />}
            />
            <div>
              <Title level={4} style={{ margin: 0 }}>
                {dataUser?.current.patient.fullName}
              </Title>
              {/* <Text type="secondary">{currentPatient.type}</Text> */}
            </div>
          </div>
          <Divider style={{ margin: "12px 0" }} />
          <Descriptions column={1} size="small">
            <Descriptions.Item label="Ngày khám">
              {dataUser?.current.appointmentDate}
            </Descriptions.Item>
            <Descriptions.Item label="Thời gian">
              <Tag color="blue">
                <ClockCircleOutlined /> {dataUser?.current.slot.startTime} -{" "}
                {dataUser?.current.slot.endTime}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Số điện thoại">
              {dataUser?.current.patient.phone}
            </Descriptions.Item>
            <Descriptions.Item label="Email">
              {dataUser?.current.patient.email}
            </Descriptions.Item>
            <Descriptions.Item label="CCCD">
              {dataUser?.current.patient.cccd}
            </Descriptions.Item>
          </Descriptions>
          <Button
            type="primary"
            block
            onClick={() => {
              nav(
                `${PATH_ROUTE_DOCTOR.PATIENTS_DETAIL}/${dataUser.current?.id}`
              );
            }}
          >
            Thông tin bệnh nhân
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
      loading={isLoadingUser}
      style={{
        borderRadius: "8px",
        boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
        height: "100%",
      }}
    >
      {dataUser?.next ? (
        <Space direction="vertical" style={{ width: "100%" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Avatar
              size={64}
              // style={{ backgroundColor: nextPatient.avatarColor }}
              icon={<UserOutlined />}
            />
            <div>
              <Title level={4} style={{ margin: 0 }}>
                {dataUser?.next.patient.fullName}
              </Title>
              {/* <Text type="secondary">{nextPatient.type}</Text> */}
            </div>
          </div>
          <Divider style={{ margin: "12px 0" }} />
          <Descriptions column={1} size="small">
            <Descriptions.Item label="Ngày khám">
              {dataUser?.next.appointmentDate}
            </Descriptions.Item>
            <Descriptions.Item label="Thời gian dự kiến">
              <Tag color="orange">
                <ClockCircleOutlined /> {dataUser?.next.slot.startTime} -{" "}
                {dataUser?.next.slot.endTime}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Số điện thoại">
              {dataUser?.next.patient.phone}
            </Descriptions.Item>
            <Descriptions.Item label="Email">
              {dataUser?.next.patient.email}
            </Descriptions.Item>
            <Descriptions.Item label="CCCD">
              {dataUser?.next.patient.cccd}
            </Descriptions.Item>
            <Descriptions.Item label="Trạng thái">
              <Tag color={"orange"}>Chờ khám</Tag>
            </Descriptions.Item>
          </Descriptions>
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

  const disabledDate: RangePickerProps["disabledDate"] = (
    current: Dayjs,
    { from }
  ) => {
    if (from) {
      // 31 ngày = 30 ngày + ngày bắt đầu
      const maxDate = from.add(30, "days");
      const minDate = from.subtract(30, "days");

      return (
        current &&
        (current.isAfter(maxDate, "day") || current.isBefore(minDate, "day"))
      );
    }
    return false;
  };

  const handleCalendarChange: RangePickerProps["onCalendarChange"] = (
    dates: [Dayjs | null, Dayjs | null] | null
  ) => {
    if (dates && dates[0] && dates[1]) {
      const startDate = dates[0];
      const endDate = dates[1];
      const diffDays = endDate.diff(startDate, "days");

      // Nếu chọn quá 31 ngày, tự động điều chỉnh
      if (Math.abs(diffDays) > 30) {
        if (diffDays > 0) {
          // Nếu chọn ngày kết thúc quá xa
          const newEndDate = startDate.add(30, "days");
          setDateRange([startDate, newEndDate]);
        } else {
          // Nếu chọn ngày bắt đầu quá xa
          const newStartDate = endDate.subtract(30, "days");
          setDateRange([newStartDate, endDate]);
        }
      }
    }
  };

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
                    <RangePicker
                      value={[dateRange[0], dateRange[1]]}
                      onChange={handleFilterChange}
                      onCalendarChange={handleCalendarChange}
                      disabledDate={disabledDate}
                      format="YYYY/MM/DD"
                      allowClear={false}
                      style={{ flex: 1 }}
                    />

                    <Button
                      icon={<FilterOutlined />}
                      onClick={() => {
                        setDateRange([
                          dayjs().startOf("day"),
                          dayjs().endOf("day"),
                        ]);
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
          {/* Stats Cards - Responsive */}
          <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
            <Col xs={24} sm={12} lg={8}>
              <Card
                loading={isLoading}
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
                  value={data?.total_appointment || 0}
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
            <Col xs={24} sm={12} lg={8}>
              <Card
                loading={isLoading}
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
                  value={data?.total_patients || 0}
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
            <Col xs={24} sm={12} lg={8}>
              <Card
                loading={isLoading}
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
                  value={data?.total_revenue || 0}
                  formatter={(value) => formatCurrency(Number(value))}
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
          {/* Bệnh nhân hiện tại và kế tiếp */}
          <Row gutter={[16, 16]}>
            <Col xs={24} md={12}>
              <CurrentPatientCard />
            </Col>
            <Col xs={24} md={12}>
              <NextPatientCard />
            </Col>
          </Row>

          {/* Main Content Row */}
          <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
            {/* Lịch hẹn */}
            <Col xs={24} lg={16}>
              <AppointmentTable
                dateRange={dateRange}
                refetch_report={refetch}
              />
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
                loading={isLoading}
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
                          data?.total_patients || 0,
                          data?.total_appointment || 0
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
                        {data?.total_patients}/{data?.total_appointment} cuộc
                        hẹn
                      </div>
                    </div>
                  </Col>
                  <Col xs={12} sm={12} md={12} lg={24} xl={12}>
                    <div style={{ textAlign: "center" }}>
                      <Progress
                        type="circle"
                        percent={calculatePercentage(
                          data?.total_appointment_pending || 0,
                          data?.total_appointment || 0
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
                        {data?.total_appointment_pending || 0} cuộc hẹn
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
                            {formatCurrency(data?.total_revenue || 0)}
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
                            {data?.total_appointment_cancel || 0} cuộc hẹn
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
                              data?.total_appointment_pending || 0,
                              data?.total_appointment || 0
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
    </>
  );
};

export default Home;
