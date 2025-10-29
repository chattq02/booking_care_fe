import { CalendarDays, Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useLogin } from "../hooks/useAuth";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { saveTokens } from "@/lib/actions/auth";

// ✅ Schema validate với Zod
const loginSchema = z.object({
  email: z.string().email("Email không hợp lệ"),
  password: z
    .string()
    .min(6, "Password phải ít nhất 6 ký tự")
    .regex(
      /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{6,}$/,
      "Password phải có ít nhất 1 chữ hoa, 1 số, 1 ký tự đặc biệt"
    ),
});

// ✅ Type từ schema
type LoginFormValues = z.infer<typeof loginSchema>;

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });
  const nav = useNavigate();

  const { mutate, isPending, error } = useLogin();

  // --- state cho hiển thị mật khẩu ---
  const [showPassword, setShowPassword] = useState(false);
  const toggleShowPassword = () => setShowPassword((s) => !s);

  const onSubmit = (data: LoginFormValues) => {
    mutate(
      {
        email: data.email,
        password: data.password,
      },
      {
        onSuccess: async (res) => {
          console.log("data", data);
          toast.success("Đăng nhập thành công");
          await saveTokens({
            at: res.data.access_token,
            rt: res.data.refresh_token,
            atMaxAge: 24 * 60 * 60 * 1000, // 24 hours
            rtMaxAge: 100 * 24 * 60 * 60 * 1000, // 100 days
          });

          setTimeout(() => {
            nav("/");
          }, 1000);
        },
        onError: (error: any) => {
          toast.error(
            `${error?.response?.data?.message}` || "Đăng nhập thất bại"
          );
        },
      }
    );
  };

  return (
    <div className="grid min-h-svh lg:grid-cols-2 bg-[#b8e6f5]">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <div className="flex items-center gap-2 font-medium">
            <div className="bg-primary text-primary-foreground flex h-6 w-6 items-center justify-center rounded-md">
              <CalendarDays className="h-4 w-4" />
            </div>
            Booking Care Admin
          </div>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-[350px] border bg-white rounded-lg border-gray-200 p-6 shadow-lg">
            <div className="mb-6 text-center">
              <h1 className="text-2xl font-bold">Đăng nhập</h1>
            </div>
            <form
              className="flex flex-col gap-6"
              onSubmit={handleSubmit(onSubmit)}
            >
              <FieldGroup className="gap-6">
                {/* Email */}
                <Field>
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    {...register("email")}
                  />
                  {errors.email && (
                    <p className="text-red-600 text-[12px]">
                      {errors.email.message}
                    </p>
                  )}
                </Field>

                {/* Password */}
                <Field>
                  <FieldLabel htmlFor="password">Mật khẩu</FieldLabel>

                  {/* wrapper để đặt icon toggle */}
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Nhập mật khẩu"
                      {...register("password")}
                    />
                    <button
                      type="button"
                      onClick={toggleShowPassword}
                      aria-label={
                        showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 inline-flex items-center justify-center rounded p-1"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>

                  {errors.password && (
                    <p className="text-red-600 text-[12px]">
                      {errors.password.message}
                    </p>
                  )}
                </Field>

                {error && (
                  <Field>
                    <p className="text-red-600 text-[12px]">
                      {`${(error as any)?.response?.data?.message}` ||
                        "Đăng nhập thất bại"}
                    </p>
                  </Field>
                )}

                {/* Submit */}
                <Field>
                  <Button type="submit" disabled={isPending}>
                    {isPending ? "Đang đăng nhập..." : "Login"}
                  </Button>
                  <div className="flex items-center">
                    <a
                      href="#"
                      className="ml-auto text-sm underline-offset-4 hover:underline"
                    >
                      Quên mật khẩu?
                    </a>
                  </div>
                </Field>
              </FieldGroup>
            </form>
          </div>
        </div>
      </div>

      <div className="bg-muted relative hidden lg:block">
        <img
          src="https://media.vietnamplus.vn/images/7255a701687d11cb8c6bbc58a6c807857325724597e663675ec183dd1bdecf03a71734f76da36d3428740fcf48f3b043cdb57feb901aea868e56e8a402356a73/ha_noi_1.jpg"
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>
    </div>
  );
}
