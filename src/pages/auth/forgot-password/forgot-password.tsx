import { CalendarDays, ArrowLeft, CheckCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { PATH_ROUTE } from "@/site/user.site/lib/enums/path";
import { useForgotPassword } from "../hooks/useAuth";

// ✅ Schema validate với Zod cho quên mật khẩu
const forgotPasswordSchema = z.object({
  email: z.string().email("Email không hợp lệ").min(1, "Email là bắt buộc"),
});

// ✅ Type từ schema
type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

interface IProps {
  role: "User" | "Admin" | "Doctor";
}

export default function ForgotPassword({ role }: IProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const nav = useNavigate();
  const { mutate, isSuccess } = useForgotPassword();

  // State cho loading và trạng thái thành công
  const [isPending, setIsPending] = useState(false);

  const [resetEmail, setResetEmail] = useState("");

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    setIsPending(true);
    setResetEmail(data.email);

    setIsPending(true);

    mutate(data.email, {
      onSuccess: () => {
        toast.success("Mật khẩu mới đã được gửi đến email của bạn!");
        setIsPending(false);
      },
      onError: (error: any) => {
        toast.error(error?.response?.data?.message || "Đăng ký thất bại!");
        setIsPending(false);
      },
    });
  };

  const handleBackToLogin = () => {
    role === "Admin" ? nav("/admin/login") : nav("/login");
  };

  return (
    <div className="grid min-h-svh lg:grid-cols-2 bg-[#b8e6f5]">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <div
            className="flex items-center gap-2 font-medium cursor-pointer"
            onClick={() => nav("/")}
          >
            <div className="bg-primary text-primary-foreground flex h-6 w-6 items-center justify-center rounded-md">
              <CalendarDays className="h-4 w-4" />
            </div>
            {`Booking Care ${role}`}
          </div>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-[400px] border bg-white rounded-lg border-gray-200 p-6 shadow-lg">
            {/* Nút quay lại */}
            <button
              onClick={handleBackToLogin}
              className="mb-4 flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Quay lại đăng nhập
            </button>

            <div className="mb-6">
              <h1 className="text-2xl font-bold text-center">
                {isSuccess ? "Kiểm tra email của bạn" : "Quên mật khẩu"}
              </h1>
              <p className="text-sm text-gray-500 mt-2 text-center">
                {isSuccess
                  ? `Chúng tôi đã gửi liên kết đặt lại mật khẩu đến ${resetEmail}`
                  : "Nhập email của bạn để nhận liên kết đặt lại mật khẩu"}
              </p>
            </div>

            {isSuccess ? (
              <div className="flex flex-col items-center justify-center gap-6 py-8">
                {/* Icon thành công */}
                <div className="rounded-full bg-green-100 p-4">
                  <CheckCircle className="h-12 w-12 text-green-600" />
                </div>

                {/* Thông báo thành công */}
                <div className="text-center space-y-3">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Yêu cầu đã được gửi!
                  </h3>
                  <p className="text-sm text-gray-600">
                    Vui lòng kiểm tra hộp thư <strong>{resetEmail}</strong> và
                    làm theo hướng dẫn để đặt lại mật khẩu.
                  </p>
                  <p className="text-xs text-gray-500">
                    Nếu không thấy email, hãy kiểm tra thư mục spam.
                  </p>
                </div>

                {/* Các nút hành động */}
                <div className="flex flex-col gap-3 w-full max-w-xs">
                  <Button
                    type="button"
                    onClick={() => {
                      // Gửi lại email
                      handleSubmit(onSubmit)();
                    }}
                    variant="outline"
                    disabled={isPending}
                  >
                    {isPending ? "Đang gửi lại..." : "Gửi lại liên kết"}
                  </Button>

                  <Button type="button" onClick={handleBackToLogin}>
                    Quay lại đăng nhập
                  </Button>
                </div>
              </div>
            ) : (
              <form
                className="flex flex-col gap-6"
                onSubmit={handleSubmit(onSubmit)}
              >
                <FieldGroup className="gap-6">
                  {/* Email */}
                  <Field>
                    <FieldLabel htmlFor="email">
                      Email đăng ký tài khoản
                    </FieldLabel>
                    <Input
                      id="email"
                      type="email"
                      placeholder="m@example.com"
                      {...register("email")}
                      autoComplete="email"
                      disabled={isPending}
                    />
                    {errors.email && (
                      <p className="text-red-600 text-[12px] mt-1">
                        {errors.email.message}
                      </p>
                    )}
                    <p className="text-xs text-gray-500 mt-2">
                      Chúng tôi sẽ gửi liên kết đặt lại mật khẩu đến email này.
                    </p>
                  </Field>

                  {/* Submit */}
                  <Field className="space-y-4">
                    <Button
                      type="submit"
                      disabled={isPending}
                      className="w-full"
                    >
                      {isPending ? "Đang xử lý..." : "Gửi liên kết đặt lại"}
                    </Button>

                    <div className="text-center">
                      <p className="text-sm text-gray-600">
                        Chưa có tài khoản?{" "}
                        <button
                          type="button"
                          onClick={() => nav(PATH_ROUTE.REGISTER)}
                          className="text-primary font-medium hover:underline"
                        >
                          Đăng ký ngay
                        </button>
                      </p>
                    </div>
                  </Field>
                </FieldGroup>
              </form>
            )}

            {/* Thông tin bổ sung */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-gray-900">
                  Cần hỗ trợ thêm?
                </h4>
                <div className="space-y-2">
                  <p className="text-xs text-gray-600">
                    • Liên kết đặt lại mật khẩu có hiệu lực trong 24 giờ
                  </p>
                  <p className="text-xs text-gray-600">
                    • Đảm bảo bạn nhập đúng email đã đăng ký tài khoản
                  </p>
                  <p className="text-xs text-gray-600">
                    • Liên hệ hỗ trợ:{" "}
                    <a
                      href="mailto:support@bookingcare.com"
                      className="text-primary hover:underline"
                    >
                      support@bookingcare.com
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-muted relative hidden lg:block">
        <img
          src={
            role === "Admin"
              ? "https://media.vietnamplus.vn/images/7255a701687d11cb8c6bbc58a6c807857325724597e663675ec183dd1bdecf03a71734f76da36d3428740fcf48f3b043cdb57feb901aea868e56e8a402356a73/ha_noi_1.jpg"
              : "https://hanoiopentour.vn/wp-content/uploads/2021/10/ha-noi-bay-gio-co-gi-de-tham-quan-va-tim-hieu-3.webp"
          }
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>
    </div>
  );
}
