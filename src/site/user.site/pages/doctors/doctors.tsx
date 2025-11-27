import { useState } from "react";
import {
  Button,
  Modal,
  Form,
  Input,
  Descriptions,
  Tabs,
  Space,
  Flex,
  Spin,
  message,
} from "antd";
import {
  UserOutlined,
  CalendarOutlined,
  DollarOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import "dayjs/locale/vi";

import { useNavigate, useParams } from "react-router-dom";
import { useGetDetailDoctor } from "./hooks/useDoctor";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getFirstLetter } from "@/helpers/helper";
import TabSchedule from "./components/tab-schedule";
import type { ISlot } from "../../types/schedule";
import { accessTokenStore } from "@/stores/auth";
import Cookies from "js-cookie";
import { COOKIE_KEYS } from "@/constants";
import { PATH_ROUTE } from "../../lib/enums/path";
import { useCreateAppointment } from "./hooks/useAppointment";

dayjs.locale("vi");

const { TextArea } = Input;

const DoctorPage = () => {
  const { id } = useParams();
  const [messageApi, contextHolder] = message.useMessage();
  const { data, isLoading } = useGetDetailDoctor(Number(id));
  const [selectedSlot, setSelectedSlot] = useState<ISlot>();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState("schedule");
  const nav = useNavigate();
  const { mutate, isPending } = useCreateAppointment();

  const [bookingForm] = Form.useForm();

  const handleBooking = async (values: ISlot | undefined) => {
    const token = accessTokenStore.get() || Cookies.get(COOKIE_KEYS.at);
    const isAuth = !!token;

    if (!isAuth) {
      messageApi.warning("Vui lòng đăng nhập để đặt lịch");
      setTimeout(() => {
        nav(PATH_ROUTE.LOGIN);
      }, 1000);
      return;
    }
    mutate(
      {
        slotId: values?.id as string,
        doctorId: Number(id),
        note: bookingForm.getFieldValue("note"),
      },
      {
        onSuccess: () => {
          messageApi.success("Đặt lịch thành công!");
        },
      }
    );
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

  return (
    <div style={{ padding: "20px 20px" }}>
      {contextHolder}
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
            items={[
              {
                key: "schedule",
                label: (
                  <span
                    style={{ display: "flex", alignItems: "center", gap: 8 }}
                  >
                    <CalendarOutlined />
                    Đặt lịch khám
                  </span>
                ),
                children: (
                  <TabSchedule
                    doctorId={Number(id)}
                    onClickSlot={(slot) => {
                      setIsModalVisible(true);
                      setSelectedSlot(slot);
                    }}
                  />
                ),
              },
              {
                key: "about",
                label: (
                  <span
                    style={{ display: "flex", alignItems: "center", gap: 8 }}
                  >
                    <UserOutlined />
                    Giới thiệu
                  </span>
                ),
                children: (
                  <TabSchedule
                    doctorId={Number(id)}
                    onClickSlot={(slot) => {
                      setIsModalVisible(true);
                      setSelectedSlot(slot);
                    }}
                  />
                ),
              },
            ]}
          />
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
        }}
        footer={null}
        width={500}
        style={{ borderRadius: "16px", top: 50 }}
      >
        <Form
          form={bookingForm}
          layout="vertical"
          onFinish={() => handleBooking(selectedSlot)}
        >
          <div
            style={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              padding: "20px",
              borderRadius: "12px",
              color: "white",
              marginBottom: "24px",
            }}
          >
            <h4
              style={{ color: "white", textAlign: "center", marginBottom: 12 }}
            >
              Thông tin đặt lịch:
              <span className="font-bold ml-2">{`${selectedSlot?.selectedDate?.format(
                "DD/MM/YYYY"
              )}`}</span>
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
                  <strong>Cơ sở:</strong>
                </span>
                {data?.facilities.map((item) => (
                  <span key={item.id}>{item.name}</span>
                ))}
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>
                  <strong>Thời gian:</strong>
                </span>
                <span>{`${selectedSlot?.startTime} - ${selectedSlot?.endTime}`}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>
                  <strong>Phí khám:</strong>
                </span>
                <span style={{ fontWeight: "bold" }}>
                  {formatCurrency(selectedSlot?.price || 0)}
                </span>
              </div>
            </div>
          </div>
          <Form.Item label="Triệu chứng/Lý do khám" name="note">
            <TextArea
              rows={4}
              placeholder="Mô tả triệu chứng hoặc lý do khám (nếu có)"
              style={{ borderRadius: "8px" }}
            />
          </Form.Item>

          <Form.Item>
            <Button
              loading={isPending}
              disabled={isPending}
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
              Xác nhận đặt lịch - {formatCurrency(selectedSlot?.price || 0)}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default DoctorPage;
