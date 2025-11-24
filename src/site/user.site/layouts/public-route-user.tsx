// layouts/public-route.tsx
import { COOKIE_KEYS } from "@/constants";
import { getProfile } from "@/pages/auth/hooks/useAuth";
import { accessTokenStore, userAtom } from "@/stores/auth";
import { useQuery } from "@tanstack/react-query";
import { Spin } from "antd";
import { useSetAtom } from "jotai";
import Cookies from "js-cookie";
import { useEffect } from "react";
import { Outlet, useLocation, Navigate } from "react-router-dom";
import { PATH_ROUTE } from "../lib/enums/path";

export default function PublicRoute() {
  const setUser = useSetAtom(userAtom);
  const location = useLocation();

  const token = accessTokenStore.get() || Cookies.get(COOKIE_KEYS.at);
  const isAuth = !!token;

  // Call API me nếu đã login (có token)
  const {
    data: user,
    isError,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ["me"],
    queryFn: getProfile,
    enabled: isAuth, // Chỉ call API khi có token
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

  // Hiển thị loading khi đang fetch profile (chỉ khi có token)
  if (isAuth && (isLoading || isFetching)) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  // Nếu đã login và chưa cập nhật profile, redirect đến trang profile
  // (trừ khi đang ở trang profile hoặc login)
  if (
    isAuth &&
    user?.is_update_profile === "NO" &&
    location.pathname !== PATH_ROUTE.PROFILE &&
    !location.pathname.includes("/login")
  ) {
    return <Navigate to={PATH_ROUTE.PROFILE} replace />;
  }

  return <Outlet />;
}
