import { Layout, Tabs, Card, Avatar, Button, Table, Tag, Grid } from "antd";
import {
  UserOutlined,
  CalendarOutlined,
  HistoryOutlined,
  MailOutlined,
} from "@ant-design/icons";

import InfoUser from "./components/info-user";
import { useAtomValue } from "jotai";
import { userAtom } from "@/stores/auth";

const { Content } = Layout;

const { useBreakpoint } = Grid;

// Mock data
const appointmentData = [
  {
    key: "1",
    date: "2024-01-15 09:00",
    doctor: "BS. Nguyễn Văn A",
    department: "Khoa Nội tổng quát",
    status: "confirmed",
    statusText: "Đã xác nhận",
  },
  {
    key: "2",
    date: "2024-01-20 14:30",
    doctor: "BS. Trần Thị B",
    department: "Khoa Tai Mũi Họng",
    status: "pending",
    statusText: "Chờ xác nhận",
  },
  {
    key: "3",
    date: "2024-01-25 10:15",
    doctor: "BS. Lê Văn C",
    department: "Khoa Răng Hàm Mặt",
    status: "confirmed",
    statusText: "Đã xác nhận",
  },
];

const medicalHistoryData = [
  {
    key: "1",
    date: "2024-01-10",
    doctor: "BS. Nguyễn Văn A",
    diagnosis: "Viêm họng cấp",
    treatment: "Kháng sinh, giảm đau",
    prescription: "Amoxicillin 500mg",
    status: "completed",
  },
  {
    key: "2",
    date: "2023-12-05",
    doctor: "BS. Trần Thị B",
    diagnosis: "Cảm cúm",
    treatment: "Nghỉ ngơi, bổ sung vitamin",
    prescription: "Vitamin C, Paracetamol",
    status: "completed",
  },
  {
    key: "3",
    date: "2023-11-20",
    doctor: "BS. Lê Văn C",
    diagnosis: "Khám sức khỏe định kỳ",
    treatment: "Tư vấn sức khỏe",
    prescription: "Không",
    status: "completed",
  },
];

const appointmentColumns = [
  {
    title: "Ngày giờ",
    dataIndex: "date",
    key: "date",
    className: "font-medium",
  },
  {
    title: "Bác sĩ",
    dataIndex: "doctor",
    key: "doctor",
    responsive: ["md"],
  },
  {
    title: "Khoa",
    dataIndex: "department",
    key: "department",
    responsive: ["lg"],
  },
  {
    title: "Trạng thái",
    dataIndex: "statusText",
    key: "status",
    render: (text: string, record: any) => (
      <Tag
        color={record.status === "confirmed" ? "green" : "orange"}
        className="font-semibold px-3 py-1 rounded-full"
      >
        {text}
      </Tag>
    ),
  },
  {
    title: "Thao tác",
    key: "action",
    render: () => (
      <Button
        type="link"
        size="small"
        className="text-blue-600 hover:text-blue-800 font-medium"
      >
        Chi tiết
      </Button>
    ),
  },
];

const medicalHistoryColumns = [
  {
    title: "Ngày khám",
    dataIndex: "date",
    key: "date",
    className: "font-medium",
  },
  {
    title: "Bác sĩ",
    dataIndex: "doctor",
    key: "doctor",
    responsive: ["md"],
  },
  {
    title: "Chẩn đoán",
    dataIndex: "diagnosis",
    key: "diagnosis",
    className: "font-semibold text-gray-800",
  },
  {
    title: "Điều trị",
    dataIndex: "treatment",
    key: "treatment",
    responsive: ["lg"],
  },
  {
    title: "Đơn thuốc",
    dataIndex: "prescription",
    key: "prescription",
    responsive: ["xl"],
  },
  {
    title: "Thao tác",
    key: "action",
    render: () => (
      <Button
        type="link"
        size="small"
        className="text-blue-600 hover:text-blue-800 font-medium"
      >
        Xem chi tiết
      </Button>
    ),
  },
];

export default function Profile() {
  const screens = useBreakpoint();
  const infoUser = useAtomValue(userAtom);

  // Tab items configuration
  const tabItems = [
    {
      key: "1",
      label: (
        <span className="flex items-center font-semibold text-sm lg:text-base">
          <UserOutlined className="mr-1 lg:mr-2" />
          <span className="hidden sm:inline">Thông tin cá nhân</span>
          <span className="sm:hidden">Thông tin</span>
        </span>
      ),
      children: <InfoUser />,
    },
    {
      key: "2",
      label: (
        <span className="flex items-center font-semibold text-sm lg:text-base">
          <CalendarOutlined className="mr-1 lg:mr-2" />
          <span className="hidden sm:inline">Lịch khám của tôi</span>
          <span className="sm:hidden">Lịch khám</span>
        </span>
      ),
      children: (
        <>
          <div className="mb-6 lg:mb-8">
            <h3 className="text-lg lg:text-xl font-bold text-gray-900 mb-4 lg:mb-6">
              Lịch hẹn sắp tới
            </h3>
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <Table
                columns={appointmentColumns}
                dataSource={appointmentData}
                pagination={false}
                scroll={{ x: 800 }}
                className="custom-table"
                size={screens.md ? "middle" : "small"}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4">
            <Card className="text-center border-0 shadow-lg rounded-2xl bg-gradient-to-r from-blue-500 to-blue-600 text-white">
              <div className="text-2xl lg:text-3xl font-bold mb-1 lg:mb-2">
                3
              </div>
              <div className="text-blue-100 font-medium text-sm lg:text-base">
                Tổng lịch hẹn
              </div>
            </Card>
            <Card className="text-center border-0 shadow-lg rounded-2xl bg-gradient-to-r from-green-500 to-green-600 text-white">
              <div className="text-2xl lg:text-3xl font-bold mb-1 lg:mb-2">
                2
              </div>
              <div className="text-green-100 font-medium text-sm lg:text-base">
                Đã xác nhận
              </div>
            </Card>
            <Card className="text-center border-0 shadow-lg rounded-2xl bg-gradient-to-r from-orange-500 to-orange-600 text-white">
              <div className="text-2xl lg:text-3xl font-bold mb-1 lg:mb-2">
                1
              </div>
              <div className="text-orange-100 font-medium text-sm lg:text-base">
                Chờ xác nhận
              </div>
            </Card>
          </div>
        </>
      ),
    },
    {
      key: "3",
      label: (
        <span className="flex items-center font-semibold text-sm lg:text-base">
          <HistoryOutlined className="mr-1 lg:mr-2" />
          <span className="hidden sm:inline">Lịch sử khám</span>
          <span className="sm:hidden">Lịch sử</span>
        </span>
      ),
      children: (
        <>
          <div className="mb-6 lg:mb-8">
            <h3 className="text-lg lg:text-xl font-bold text-gray-900 mb-4 lg:mb-6">
              Lịch sử khám bệnh
            </h3>
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <Table
                columns={medicalHistoryColumns}
                dataSource={medicalHistoryData}
                pagination={{
                  pageSize: 5,
                  showSizeChanger: true,
                  showQuickJumper: true,
                  className: "px-4 py-2",
                }}
                scroll={{ x: 1000 }}
                className="custom-table"
                size={screens.md ? "middle" : "small"}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
            <Card className="text-center border-0 shadow-lg rounded-2xl bg-gradient-to-r from-purple-500 to-purple-600 text-white">
              <div className="text-xl lg:text-2xl xl:text-3xl font-bold mb-1 lg:mb-2">
                12
              </div>
              <div className="text-purple-100 font-medium text-xs lg:text-sm xl:text-base">
                Tổng lượt khám
              </div>
            </Card>
            <Card className="text-center border-0 shadow-lg rounded-2xl bg-gradient-to-r from-green-500 to-green-600 text-white">
              <div className="text-xl lg:text-2xl xl:text-3xl font-bold mb-1 lg:mb-2">
                8
              </div>
              <div className="text-green-100 font-medium text-xs lg:text-sm xl:text-base">
                Đã hoàn thành
              </div>
            </Card>
            <Card className="text-center border-0 shadow-lg rounded-2xl bg-gradient-to-r from-blue-500 to-blue-600 text-white">
              <div className="text-xl lg:text-2xl xl:text-3xl font-bold mb-1 lg:mb-2">
                3
              </div>
              <div className="text-blue-100 font-medium text-xs lg:text-sm xl:text-base">
                Đang điều trị
              </div>
            </Card>
            <Card className="text-center border-0 shadow-lg rounded-2xl bg-gradient-to-r from-gray-500 to-gray-600 text-white">
              <div className="text-xl lg:text-2xl xl:text-3xl font-bold mb-1 lg:mb-2">
                1
              </div>
              <div className="text-gray-100 font-medium text-xs lg:text-sm xl:text-base">
                Theo dõi định kỳ
              </div>
            </Card>
          </div>
        </>
      ),
    },
  ];

  return (
    <Layout className="min-h-screen">
      <Content className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-420 mx-auto">
          {/* Sidebar Profile - Fixed */}

          <div className="bg-linear-to-b from-blue-600 to-purple-700 text-white p-6 lg:p-8 lg:fixed top-24 left-4 right-4 lg:left-auto lg:right-auto lg:w-64 lg:rounded-md rounded-t-md z-10">
            <div className="text-center">
              <Avatar
                size={120}
                icon={<UserOutlined />}
                className="border-4 border-white/20 shadow-2xl mb-4 bg-white/10 mx-auto"
              />
              <h2 className="text-xl font-bold mb-1">
                {infoUser?.fullName ?? ""}
              </h2>
              <p className="text-blue-100 mb-4 flex items-center justify-center">
                <MailOutlined className="mr-2" />
                {infoUser?.email ?? ""}
              </p>
            </div>
          </div>

          {/* Main Content - Adjusted for fixed sidebar */}
          <div className="lg:ml-70 bg-white lg:px-5 px-5 rounded-b-md lg:rounded-md">
            <Tabs
              defaultActiveKey="1"
              type="line"
              size="large"
              className="profile-tabs "
              items={tabItems}
            />
          </div>
        </div>
      </Content>
    </Layout>
  );
}
