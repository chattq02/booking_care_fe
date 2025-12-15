import { useEffect } from "react";
import { useQueryParamsObject } from "@/hooks/use-query-params-object";
import { useVerifyEmail } from "./hooks/useVerifyEmail";
import { toast } from "sonner";

export default function VerifyEmail() {
  const { token } = useQueryParamsObject();
  const { mutate, isPending, isSuccess, isError, error, data } =
    useVerifyEmail();

  useEffect(() => {
    if (token)
      mutate(
        {
          token,
          type: "Verify",
        },
        {
          onSuccess: (data: any) => {
            const user_type = data?.data?.user_type;
            if (user_type === "Patient") {
              window.location.href = "http://user.localhost:5100/login";
            } else if (user_type === "Doctor") {
              window.location.href = "http://doctor.localhost:5100/login";
            }
            toast.success("Xác thực email thành công");
          },
          onError: (err: any) => {
            toast.error(err.response?.data?.message || "Có lỗi xảy ra!");
          },
        }
      );
  }, [token]);

  const handleResendVerifyEmail = () => {
    mutate({
      token,
      type: "Verify",
    });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="p-6 bg-white rounded-xl shadow-md w-full max-w-md text-center">
        <h1 className="text-2xl font-bold mb-4">Xác thực tài khoản</h1>

        {isPending && (
          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 border-4 border-blue-300 border-t-blue-600 rounded-full animate-spin"></div>
            <p className="text-gray-600">⏳ Đang xác thực email...</p>
          </div>
        )}

        {isSuccess && (
          <p className="text-green-600 font-semibold">
            ✅ Xác thực thành công: {data?.message || "Email đã được xác thực!"}
          </p>
        )}

        {isError && (
          <>
            <p className="text-red-600 font-semibold">
              ❌ Lỗi:{" "}
              {(error as any)?.response?.data?.message || "Xác thực thất bại"}
            </p>
            {(error as any)?.response?.data?.status === 401 && (
              <p>
                Vui lòng xác thực lại{" "}
                <span
                  className="underline cursor-pointer"
                  onClick={handleResendVerifyEmail}
                >
                  Gửi lại
                </span>
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
