import { Navigate, Outlet } from "react-router-dom";
import Cookies from "js-cookie";
import { accessTokenStore, userAtom } from "@/stores/auth";
import { COOKIE_KEYS } from "@/constants";
import { useSetAtom } from "jotai";
import { useQuery } from "@tanstack/react-query";
import { getProfile } from "@/pages/auth/hooks/useAuth";
import { useEffect } from "react";
import { Spin } from "antd";

export default function GuardRouteLayout({
  auth = false,
  redirect = "/login",
}) {
  const setUser = useSetAtom(userAtom);

  // 🔐 Lấy token từ store hoặc cookie
  const token = accessTokenStore.get() || Cookies.get(COOKIE_KEYS.at);
  const isAuth = !!token;

  // 🧠 Dùng React Query để gọi getProfile
  const { data: user, isError, isLoading } = useQuery({
    queryKey: ["me"],
    queryFn: getProfile,
    enabled: isAuth,
    retry: false,
    staleTime: 1000 * 60 * 5,
  });

  useEffect(() => {
    if (user) {
      setUser(user);
    } else if (isError) {
      setUser(null);
    }
  }, [user, isError, setUser]);


  if (auth && isAuth && isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  // 🔄 Nếu route yêu cầu login mà chưa có token hoặc lỗi token → về login
  if (auth && (!isAuth || isError)) {
    return <Navigate to={redirect} replace />;
  }

  // 🚫 Nếu route công khai mà đã có token → chuyển hướng (VD: /login)
  if (!auth && isAuth) {
    return <Navigate to={redirect} replace />;
  }

  // ✅ Trả về route con
  return <Outlet />;
}
