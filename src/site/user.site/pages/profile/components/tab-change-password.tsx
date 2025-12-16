import { useState } from "react";
import { Form, Input, Button } from "antd";
import { LockOutlined } from "@ant-design/icons";
import { useChangePassword } from "@/pages/auth/hooks/useAuth";
import { toast } from "sonner";

const TabChangePassword = () => {
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);
  const { mutate } = useChangePassword();

  const onFinish = async (values: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }) => {
    setIsLoading(true);
    mutate(
      {
        new_password: values.newPassword,
        old_password: values.currentPassword,
      },
      {
        onSuccess: () => {
          setIsLoading(false);
          toast.success("Đổi mật khẩu thành công!");
          form.resetFields();
        },
        onError: (error: any) => {
          setIsLoading(false);
          toast.error(
            error.response?.data?.message || "Đổi mật khẩu thất bại!"
          );
        },
      }
    );
  };

  const validatePassword = (_: any, value: string) => {
    if (!value) {
      return Promise.reject("Vui lòng nhập mật khẩu!");
    }

    // Validate độ mạnh mật khẩu
    if (value.length < 8) {
      return Promise.reject("Mật khẩu phải có ít nhất 8 ký tự!");
    }

    if (!/(?=.*[a-z])(?=.*[A-Z])/.test(value)) {
      return Promise.reject(
        "Mật khẩu phải chứa ít nhất 1 chữ hoa và 1 chữ thường!"
      );
    }

    if (!/(?=.*\d)/.test(value)) {
      return Promise.reject("Mật khẩu phải chứa ít nhất 1 số!");
    }

    if (!/(?=.*[!@#$%^&*])/.test(value)) {
      return Promise.reject(
        "Mật khẩu phải chứa ít nhất 1 ký tự đặc biệt (!@#$%^&*)!"
      );
    }

    return Promise.resolve();
  };

  const validateConfirmPassword = ({ getFieldValue }: any) => ({
    validator(_: any, value: string) {
      if (!value || getFieldValue("newPassword") === value) {
        return Promise.resolve();
      }
      return Promise.reject("Mật khẩu xác nhận không khớp!");
    },
  });

  return (
    <div style={{ maxWidth: 500, margin: "0 auto" }}>
      <Form
        form={form}
        name="changePassword"
        onFinish={onFinish}
        layout="vertical"
        autoComplete="off"
      >
        <Form.Item
          label="Mật khẩu hiện tại"
          name="currentPassword"
          rules={[
            { required: true, message: "Vui lòng nhập mật khẩu hiện tại!" },
            { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự!" },
          ]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="Nhập mật khẩu hiện tại"
            size="large"
          />
        </Form.Item>

        <Form.Item
          label="Mật khẩu mới"
          name="newPassword"
          rules={[
            { required: true, message: "Vui lòng nhập mật khẩu mới!" },
            { validator: validatePassword },
          ]}
          hasFeedback
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="Nhập mật khẩu mới"
            size="large"
          />
        </Form.Item>

        <Form.Item
          label="Xác nhận mật khẩu mới"
          name="confirmPassword"
          dependencies={["newPassword"]}
          rules={[
            { required: true, message: "Vui lòng xác nhận mật khẩu!" },
            validateConfirmPassword,
          ]}
          hasFeedback
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="Nhập lại mật khẩu mới"
            size="large"
          />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={isLoading}
            size="large"
            block
          >
            Đổi mật khẩu
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default TabChangePassword;
