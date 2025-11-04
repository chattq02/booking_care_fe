import { Navigate, Outlet } from "react-router-dom";
import Cookies from "js-cookie";
import { accessTokenStore, fetchUserAtom, userAtom } from "@/stores/auth";
import { COOKIE_KEYS } from "@/constants";
import { useAtom, useSetAtom } from "jotai";
import { useEffect } from "react";

export default function GuardRouteLayout({
  auth = false,
  redirect = "/login",
}) {
  const [user, setUser] = useAtom(userAtom);

  // 🔐 Lấy token từ store hoặc cookie
  const token = accessTokenStore.get() || Cookies.get(COOKIE_KEYS.at);
  const isAuth = !!token;

  const fetchUser = useSetAtom(fetchUserAtom);

  useEffect(() => {
    if (!user) {
      fetchUser()
    }
  }, [user, setUser]);



  // 🔄 Nếu route yêu cầu login mà chưa có token hoặc lỗi token → về login
  if (auth && !isAuth) {
    return <Navigate to={redirect} replace />;
  }

  // 🚫 Nếu route công khai mà đã có token → chuyển hướng (VD: /login)
  if (!auth && isAuth) {
    return <Navigate to={redirect} replace />;
  }

  // ✅ Trả về route con
  return <Outlet />;
}
