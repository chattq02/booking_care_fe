import { useEffect } from "react";
import { useQueryParamsObject } from "@/hooks/use-query-params-object";
import { useVerifyEmail } from "./hooks/useVerifyEmail";
import { useNavigate } from "react-router-dom";

export default function VerifyEmail() {
  const { token } = useQueryParamsObject();
  const { mutate, isPending, isSuccess, isError, error, data } =
    useVerifyEmail();

  const navigate = useNavigate();

  useEffect(() => {
    if (token) mutate(token);
  }, [token]);

  // ✅ Chuyển sang login khi xác thực thành công
  useEffect(() => {
    if (isSuccess) {
      const timer = setTimeout(() => {
        navigate("/login"); // thay "/login" bằng route login của bạn
      }, 1500); // delay 1.5s để user thấy message
      return () => clearTimeout(timer);
    }
  }, [isSuccess, navigate]);

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
          <p className="text-red-600 font-semibold">
            ❌ Lỗi:{" "}
            {(error as any)?.response?.data?.message || "Xác thực thất bại"}
          </p>
        )}
      </div>
    </div>
  );
}
