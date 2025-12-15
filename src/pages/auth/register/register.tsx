import { CalendarDays, Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useRegisterUser } from "../hooks/useAuth";

// ✅ Schema validate với Zod cho đăng ký
const registerSchema = z
  .object({
    name: z
      .string()
      .min(2, "Tên phải có ít nhất 2 ký tự")
      .max(50, "Tên không được vượt quá 50 ký tự")
      .regex(/^[a-zA-ZÀ-ỹ\s]+$/, "Tên chỉ được chứa chữ cái và khoảng trắng"),
    email: z.email("Email không hợp lệ").min(1, "Email là bắt buộc"),
    password: z
      .string()
      .min(6, "Mật khẩu phải có ít nhất 6 ký tự")
      .regex(
        /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{6,}$/,
        "Mật khẩu phải có ít nhất 1 chữ hoa, 1 số, 1 ký tự đặc biệt"
      ),
    confirmPassword: z.string().min(1, "Xác nhận mật khẩu là bắt buộc"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu không khớp",
    path: ["confirmPassword"],
  });

// ✅ Type từ schema
type RegisterFormValues = z.infer<typeof registerSchema>;

interface IProps {
  role: "User" | "Admin" | "Doctor";
}

export default function Register({ role }: IProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const { mutate } = useRegisterUser();

  const nav = useNavigate();

  // --- state cho hiển thị mật khẩu ---
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const toggleShowPassword = () => setShowPassword((s) => !s);
  const toggleShowConfirmPassword = () => setShowConfirmPassword((s) => !s);

  // State cho loading
  const [isPending, setIsPending] = useState(false);

  const onSubmit = async (data: RegisterFormValues) => {
    setIsPending(true);

    mutate(
      {
        email: data.email,
        password: data.password,
        fullName: data.name,
      },
      {
        onSuccess: () => {
          toast.success("Đăng ký thành công!");
          setIsPending(false);
          setTimeout(() => {
            nav("/login");
          }, 1000);
        },
        onError: (error: any) => {
          toast.error(error?.response?.data?.message || "Đăng ký thất bại!");
          setIsPending(false);
        },
      }
    );
  };

  // Theo dõi giá trị password để validate real-time
  const passwordValue = watch("password");

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
            <div className="mb-6 text-center">
              <h1 className="text-2xl font-bold">{`Đăng ký ${role}`}</h1>
              <p className="text-sm text-gray-500 mt-2">
                Tạo tài khoản mới để bắt đầu sử dụng dịch vụ
              </p>
            </div>
            <form
              className="flex flex-col gap-6"
              onSubmit={handleSubmit(onSubmit)}
            >
              <FieldGroup className="gap-5">
                {/* Họ và tên */}
                <Field>
                  <FieldLabel htmlFor="name">Họ và tên</FieldLabel>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Nguyễn Văn A"
                    {...register("name")}
                    autoComplete="name"
                  />
                  {errors.name && (
                    <p className="text-red-600 text-[12px] mt-1">
                      {errors.name.message}
                    </p>
                  )}
                </Field>

                {/* Email */}
                <Field>
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    {...register("email")}
                    autoComplete="email"
                  />
                  {errors.email && (
                    <p className="text-red-600 text-[12px] mt-1">
                      {errors.email.message}
                    </p>
                  )}
                </Field>

                {/* Mật khẩu */}
                <Field>
                  <FieldLabel htmlFor="password">Mật khẩu</FieldLabel>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Nhập mật khẩu"
                      {...register("password")}
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      onClick={toggleShowPassword}
                      aria-label={
                        showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 inline-flex items-center justify-center rounded p-1 hover:bg-gray-100 transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-500" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-500" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-red-600 text-[12px] mt-1">
                      {errors.password.message}
                    </p>
                  )}
                  {passwordValue && !errors.password && (
                    <p className="text-green-600 text-[12px] mt-1">
                      ✓ Mật khẩu hợp lệ
                    </p>
                  )}
                </Field>

                {/* Xác nhận mật khẩu */}
                <Field>
                  <FieldLabel htmlFor="confirmPassword">
                    Xác nhận mật khẩu
                  </FieldLabel>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Nhập lại mật khẩu"
                      {...register("confirmPassword")}
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      onClick={toggleShowConfirmPassword}
                      aria-label={
                        showConfirmPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 inline-flex items-center justify-center rounded p-1 hover:bg-gray-100 transition-colors"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-500" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-500" />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-red-600 text-[12px] mt-1">
                      {errors.confirmPassword.message}
                    </p>
                  )}
                  {watch("confirmPassword") &&
                    !errors.confirmPassword &&
                    watch("password") === watch("confirmPassword") && (
                      <p className="text-green-600 text-[12px] mt-1">
                        ✓ Mật khẩu khớp
                      </p>
                    )}
                </Field>

                {/* Submit */}
                <Field className="space-y-4">
                  <Button type="submit" disabled={isPending} className="w-full">
                    {isPending ? "Đang đăng ký..." : "Đăng ký"}
                  </Button>

                  <div className="text-center pt-2">
                    <p className="text-sm text-gray-600">
                      Đã có tài khoản?{" "}
                      <button
                        type="button"
                        onClick={() =>
                          role === "Admin" ? nav("/admin/login") : nav("/login")
                        }
                        className="text-primary font-medium hover:underline"
                      >
                        Đăng nhập ngay
                      </button>
                    </p>
                  </div>

                  {/* Terms and Conditions */}
                  <div className="text-center">
                    <p className="text-xs text-gray-500">
                      Bằng việc đăng ký, bạn đồng ý với{" "}
                      <a href="/terms" className="text-primary hover:underline">
                        Điều khoản dịch vụ
                      </a>{" "}
                      và{" "}
                      <a
                        href="/privacy"
                        className="text-primary hover:underline"
                      >
                        Chính sách bảo mật
                      </a>
                    </p>
                  </div>
                </Field>
              </FieldGroup>
            </form>
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
