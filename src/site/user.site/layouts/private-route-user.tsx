import { COOKIE_KEYS } from "@/constants";
import { getProfile } from "@/pages/auth/hooks/useAuth";
import { accessTokenStore, userAtom } from "@/stores/auth";
import { useQuery } from "@tanstack/react-query";
import { Spin } from "antd";
import { useSetAtom } from "jotai";
import Cookies from "js-cookie";
import { useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { PATH_ROUTE } from "../lib/enums/path";

export default function PrivateRouteUser({
  auth = false,
  redirect = "/login",
}) {
  const setUser = useSetAtom(userAtom);
  const location = useLocation();

  const token = accessTokenStore.get() || Cookies.get(COOKIE_KEYS.at);
  const isAuth = !!token;

  // CHỈ call API khi auth=true (route protected)
  const {
    data: user,
    isError,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ["me"],
    queryFn: getProfile,
    enabled: isAuth && auth, // Quan trọng: chỉ enabled khi auth=true
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

  // Hiển thị loading chỉ khi đang fetch profile (route protected)
  if (auth && isAuth && (isLoading || isFetching)) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  // Route KHÔNG cần auth (như login) - nếu đã login thì redirect
  if (!auth && isAuth) {
    // Nếu user chưa cập nhật profile, redirect đến trang profile
    if (user?.is_update_profile === "NO") {
      return <Navigate to={PATH_ROUTE.PROFILE} replace />;
    }
    return <Navigate to={redirect} replace />;
  }

  // Route CẦN auth - nếu chưa login hoặc lỗi thì redirect
  if (auth && (!isAuth || isError)) {
    return <Navigate to={redirect} replace />;
  }

  // Nếu đang ở route protected và user chưa cập nhật profile, redirect đến trang profile
  // (trừ khi đang ở trang profile)
  if (
    auth &&
    isAuth &&
    user?.is_update_profile === "NO" &&
    location.pathname !== PATH_ROUTE.PROFILE
  ) {
    return <Navigate to={PATH_ROUTE.PROFILE} replace />;
  }

  return <Outlet />;
}
