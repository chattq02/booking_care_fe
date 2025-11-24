import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Layout,
  Tabs,
  Card,
  Avatar,
  Form,
  Input,
  Button,
  Table,
  Tag,
  Descriptions,
  Divider,
  Badge,
} from "antd";
import {
  UserOutlined,
  CalendarOutlined,
  HistoryOutlined,
  EditOutlined,
  SaveOutlined,
  PhoneOutlined,
  MailOutlined,
  EnvironmentOutlined,
  IdcardOutlined,
} from "@ant-design/icons";
import { useState } from "react";

const { Content } = Layout;
const { TabPane } = Tabs;

const profileSchema = z.object({
  firstName: z.string().min(1, "Vui lòng nhập tên"),
  lastName: z.string().min(1, "Vui lòng nhập họ"),
  email: z.string().email(),
  phone: z.string().min(9, "Số điện thoại không hợp lệ"),
});

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
    responsive: ["md"] as any,
  },
  {
    title: "Khoa",
    dataIndex: "department",
    key: "department",
    responsive: ["lg"] as any,
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
    responsive: ["md"] as any,
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
    responsive: ["lg"] as any,
  },
  {
    title: "Đơn thuốc",
    dataIndex: "prescription",
    key: "prescription",
    responsive: ["xl"] as any,
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
  const [form] = Form.useForm();
  const [editing, setEditing] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: "Chất",
      lastName: "Trịnh Quang",
      email: "chattq@solashi.com",
      phone: "0787267411",
    },
  });

  const onSubmit = (values: any) => {
    console.log(values);
    setEditing(false);
  };

  const handleEdit = () => {
    setEditing(true);
  };

  const handleSave = () => {
    form.submit();
  };

  const handleCancel = () => {
    setEditing(false);
    form.resetFields();
  };

  return (
    <Layout className="min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50">
      <Content className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
        <Card
          className="rounded-md overflow-hidden"
          classNames={{
            body: "p-0!",
          }}
        >
          <div className="flex flex-col lg:flex-row">
            {/* Sidebar Profile */}
            <div className="lg:w-1/4 bg-linear-to-b from-blue-600 to-purple-700 text-white p-6 lg:p-8">
              <div className="text-center">
                <div className="relative inline-block">
                  <Avatar
                    size={120}
                    icon={<UserOutlined />}
                    className="border-4 border-white/20 shadow-2xl mb-4 bg-white/10"
                  />
                  <Badge
                    status="success"
                    offset={[-10, 100]}
                    className="border-2 border-white rounded-full"
                  />
                </div>
                <h2 className="text-xl font-bold mb-1">Trịnh Quang Chất</h2>
                <p className="text-blue-100 mb-4 flex items-center justify-center">
                  <MailOutlined className="mr-2" />
                  chattq@solashi.com
                </p>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:w-3/4 bg-white p-6 lg:p-8">
              <Tabs
                defaultActiveKey="1"
                type="line"
                size="large"
                className="profile-tabs"
              >
                {/* Tab 1: Thông tin cá nhân */}
                <TabPane
                  tab={
                    <span className="flex items-center font-semibold">
                      <UserOutlined className="mr-2" />
                      Thông tin cá nhân
                    </span>
                  }
                  key="1"
                >
                  <Form
                    form={form}
                    layout="vertical"
                    onFinish={onSubmit}
                    initialValues={{
                      firstName: "Chất",
                      lastName: "Trịnh Quang",
                      email: "chattq@solashi.com",
                      phone: "0787267411",
                    }}
                  >
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
                      <h3 className="text-xl font-bold text-gray-900">
                        Thông tin cơ bản
                      </h3>
                      {!editing ? (
                        <Button
                          type="primary"
                          icon={<EditOutlined />}
                          onClick={handleEdit}
                          className="bg-blue-600 hover:bg-blue-700 border-0 font-semibold px-6 py-2 h-auto rounded-lg shadow-lg hover:shadow-xl transition-all"
                        >
                          Chỉnh sửa
                        </Button>
                      ) : (
                        <div className="flex gap-2">
                          <Button
                            onClick={handleCancel}
                            className="font-semibold px-6 py-2 h-auto rounded-lg border-gray-300 hover:border-gray-400 transition-all"
                          >
                            Hủy
                          </Button>
                          <Button
                            type="primary"
                            icon={<SaveOutlined />}
                            onClick={handleSave}
                            className="bg-green-600 hover:bg-green-700 border-0 font-semibold px-6 py-2 h-auto rounded-lg shadow-lg hover:shadow-xl transition-all"
                          >
                            Lưu thay đổi
                          </Button>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Form.Item
                        label={
                          <span className="font-semibold text-gray-700">
                            Họ
                          </span>
                        }
                        name="lastName"
                        rules={[
                          { required: true, message: "Vui lòng nhập họ" },
                        ]}
                      >
                        <Input
                          disabled={!editing}
                          placeholder="Nhập họ"
                          size="large"
                          className={`rounded-lg ${
                            !editing ? "bg-gray-50" : ""
                          }`}
                        />
                      </Form.Item>

                      <Form.Item
                        label={
                          <span className="font-semibold text-gray-700">
                            Tên
                          </span>
                        }
                        name="firstName"
                        rules={[
                          { required: true, message: "Vui lòng nhập tên" },
                        ]}
                      >
                        <Input
                          disabled={!editing}
                          placeholder="Nhập tên"
                          size="large"
                          className={`rounded-lg ${
                            !editing ? "bg-gray-50" : ""
                          }`}
                        />
                      </Form.Item>

                      <Form.Item
                        label={
                          <span className="font-semibold text-gray-700">
                            Email
                          </span>
                        }
                        name="email"
                        rules={[
                          { required: true, message: "Vui lòng nhập email" },
                          { type: "email", message: "Email không hợp lệ" },
                        ]}
                      >
                        <Input
                          disabled={!editing}
                          placeholder="Nhập email"
                          size="large"
                          className={`rounded-lg ${
                            !editing ? "bg-gray-50" : ""
                          }`}
                        />
                      </Form.Item>

                      <Form.Item
                        label={
                          <span className="font-semibold text-gray-700">
                            Số điện thoại
                          </span>
                        }
                        name="phone"
                        rules={[
                          {
                            required: true,
                            message: "Vui lòng nhập số điện thoại",
                          },
                          { min: 9, message: "Số điện thoại không hợp lệ" },
                        ]}
                      >
                        <Input
                          disabled={!editing}
                          placeholder="Nhập số điện thoại"
                          size="large"
                          className={`rounded-lg ${
                            !editing ? "bg-gray-50" : ""
                          }`}
                        />
                      </Form.Item>
                    </div>
                  </Form>
                </TabPane>

                {/* Tab 2: Lịch khám của tôi */}
                <TabPane
                  tab={
                    <span className="flex items-center font-semibold">
                      <CalendarOutlined className="mr-2" />
                      Lịch khám của tôi
                    </span>
                  }
                  key="2"
                >
                  <div className="mb-8">
                    <h3 className="text-xl font-bold text-gray-900 mb-6">
                      Lịch hẹn sắp tới
                    </h3>
                    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                      <Table
                        columns={appointmentColumns}
                        dataSource={appointmentData}
                        pagination={false}
                        scroll={{ x: 800 }}
                        className="custom-table"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <Card className="text-center border-0 shadow-lg rounded-2xl bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                      <div className="text-3xl font-bold mb-2">3</div>
                      <div className="text-blue-100 font-medium">
                        Tổng lịch hẹn
                      </div>
                    </Card>
                    <Card className="text-center border-0 shadow-lg rounded-2xl bg-gradient-to-r from-green-500 to-green-600 text-white">
                      <div className="text-3xl font-bold mb-2">2</div>
                      <div className="text-green-100 font-medium">
                        Đã xác nhận
                      </div>
                    </Card>
                    <Card className="text-center border-0 shadow-lg rounded-2xl bg-gradient-to-r from-orange-500 to-orange-600 text-white">
                      <div className="text-3xl font-bold mb-2">1</div>
                      <div className="text-orange-100 font-medium">
                        Chờ xác nhận
                      </div>
                    </Card>
                  </div>
                </TabPane>

                {/* Tab 3: Lịch sử khám */}
                <TabPane
                  tab={
                    <span className="flex items-center font-semibold">
                      <HistoryOutlined className="mr-2" />
                      Lịch sử khám
                    </span>
                  }
                  key="3"
                >
                  <div className="mb-8">
                    <h3 className="text-xl font-bold text-gray-900 mb-6">
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
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card className="text-center border-0 shadow-lg rounded-2xl bg-gradient-to-r from-purple-500 to-purple-600 text-white">
                      <div className="text-2xl sm:text-3xl font-bold mb-2">
                        12
                      </div>
                      <div className="text-purple-100 font-medium text-sm sm:text-base">
                        Tổng lượt khám
                      </div>
                    </Card>
                    <Card className="text-center border-0 shadow-lg rounded-2xl bg-gradient-to-r from-green-500 to-green-600 text-white">
                      <div className="text-2xl sm:text-3xl font-bold mb-2">
                        8
                      </div>
                      <div className="text-green-100 font-medium text-sm sm:text-base">
                        Đã hoàn thành
                      </div>
                    </Card>
                    <Card className="text-center border-0 shadow-lg rounded-2xl bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                      <div className="text-2xl sm:text-3xl font-bold mb-2">
                        3
                      </div>
                      <div className="text-blue-100 font-medium text-sm sm:text-base">
                        Đang điều trị
                      </div>
                    </Card>
                    <Card className="text-center border-0 shadow-lg rounded-2xl bg-gradient-to-r from-gray-500 to-gray-600 text-white">
                      <div className="text-2xl sm:text-3xl font-bold mb-2">
                        1
                      </div>
                      <div className="text-gray-100 font-medium text-sm sm:text-base">
                        Theo dõi định kỳ
                      </div>
                    </Card>
                  </div>
                </TabPane>
              </Tabs>
            </div>
          </div>
        </Card>
      </Content>
    </Layout>
  );
}
