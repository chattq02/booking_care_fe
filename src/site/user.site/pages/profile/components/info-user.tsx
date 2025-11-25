import { Form, Input, DatePicker, Radio, Col, Row, Button } from "antd";
import { UserOutlined, SaveOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import type { ReqUpdateUser } from "@/types/auth";
import { useUpdateUser } from "../hooks/useUpdateUser";
import { omit } from "lodash";
import { useAtomValue } from "jotai";
import { userAtom } from "@/stores/auth";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const { TextArea } = Input;

export default function InfoUser() {
  const [form] = Form.useForm();
  const { mutate, isPending } = useUpdateUser();
  const infoUser = useAtomValue(userAtom);
  const nav = useNavigate();

  const formKey = infoUser
    ? `form-${infoUser.id}-${Date.now()}`
    : "form-default";

  // Hàm chuyển đổi dữ liệu từ infoUser sang giá trị form
  const getInitialValues = () => {
    if (!infoUser) {
      return {
        fullName: "",
        gender: "male",
        cccd: "",
        phone: "",
        dateOfBirth: null,
        address: "",
        email: "",
        healthInsurance: "",
        occupation: "",
      };
    }

    return {
      fullName: infoUser.fullName || "",
      gender: infoUser.gender || "male",
      cccd: infoUser.cccd || "",
      phone: infoUser.phone || "",
      birthday: infoUser.dateOfBirth ? dayjs(infoUser.dateOfBirth) : null,
      address: infoUser.address || "",
      email: infoUser.email || "",
      healthInsurance: infoUser.bhyt || "",
      occupation: infoUser.occupation || "",
      // Thêm các trường khác nếu cần
    };
  };

  useEffect(() => {
    form.setFieldsValue(getInitialValues());
  }, [infoUser]);

  const onSubmit = async (values: ReqUpdateUser) => {
    mutate(omit(values, "email"), {
      onSuccess: () => {
        nav("/");
      },
    });
  };

  return (
    <Form
      key={formKey}
      form={form}
      layout="vertical"
      onFinish={onSubmit}
      initialValues={getInitialValues()} // Sử dụng hàm để lấy giá trị khởi tạo
    >
      <Row gutter={[25, 0]}>
        {/* Họ và tên */}
        <Col xs={24} md={12} lg={8}>
          <Form.Item
            label="Họ và tên"
            name="fullName"
            rules={[{ required: true, message: "Vui lòng nhập họ và tên" }]}
          >
            <Input
              placeholder="Nhập tên hoặc số điện thoại để tìm kiếm"
              prefix={<UserOutlined className="text-gray-400" />}
            />
          </Form.Item>
        </Col>
        {/* Email */}
        <Col xs={24} md={12} lg={8}>
          <Form.Item
            label={"Email"}
            name="email"
            rules={[{ type: "email", message: "Email không hợp lệ" }]}
          >
            <Input disabled placeholder="Email" />
          </Form.Item>
        </Col>
        {/* Giới tính */}
        <Col xs={24} md={12} lg={8}>
          <Form.Item label="Giới tính" name="gender">
            <Radio.Group className="flex flex-wrap gap-2">
              <Radio value="MALE">Nam</Radio>
              <Radio value="FEMALE">Nữ</Radio>
              <Radio value="OTHER">Khác</Radio>
            </Radio.Group>
          </Form.Item>
        </Col>
        {/* Mã BHYT */}
        <Col xs={24} md={12} lg={8}>
          <Form.Item label="Mã BHYT" name="healthInsurance">
            <Input placeholder="Mã BHYT" />
          </Form.Item>
        </Col>

        {/* CCCD */}
        <Col xs={24} md={12} lg={8}>
          <Form.Item label="CCCD" name="cccd">
            <Input placeholder="Số CCCD" />
          </Form.Item>
        </Col>
        {/* Điện thoại */}
        <Col xs={24} md={12} lg={8}>
          <Form.Item
            label="Điện thoại"
            name="phone"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập số điện thoại",
              },
            ]}
          >
            <Input placeholder="Số điện thoại liên hệ" />
          </Form.Item>
        </Col>
        {/* Ngày sinh */}
        <Col xs={24} md={12} lg={8}>
          <Form.Item
            label="Ngày sinh"
            name="birthday"
            rules={[{ required: true, message: "Vui lòng chọn ngày sinh" }]}
          >
            <DatePicker
              placeholder="dd / mm / yyyy"
              format="DD/MM/YYYY"
              style={{ width: "100%" }}
              allowClear={false}
            />
          </Form.Item>
        </Col>

        {/* Nghề nghiệp */}
        <Col xs={24} md={12} lg={8}>
          <Form.Item label="Nghề nghiệp" name="occupation">
            <Input placeholder="Nghề nghiệp" />
          </Form.Item>
        </Col>

        {/* Địa chỉ */}
        <Col xs={24} md={24} lg={24}>
          <Form.Item label="Địa chỉ" name="address">
            <TextArea placeholder="Số nhà, tên đường...." rows={3} />
          </Form.Item>
        </Col>
      </Row>

      <div className="flex justify-end pb-4">
        <Button
          type="primary"
          htmlType="submit"
          icon={<SaveOutlined />}
          loading={isPending}
        >
          Lưu thông tin
        </Button>
      </div>
    </Form>
  );
}
