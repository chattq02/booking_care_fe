import { Navigate, Outlet, useLocation } from "react-router-dom";
import Cookies from "js-cookie";
import {
  accessTokenStore,
  selectedFacilityAtom,
  userAtom,
} from "@/stores/auth";
import { COOKIE_KEYS } from "@/constants";
import { useSetAtom, useAtomValue } from "jotai";
import { useQuery } from "@tanstack/react-query";
import { getProfile } from "@/pages/auth/hooks/useAuth";
import { useEffect } from "react";
import { Spin } from "antd";
import { PATH_ROUTE_ADMIN } from "@/site/admin.site/libs/enums/path";

interface GuardRouteLayoutProps {
  auth?: boolean;
  requireFacility?: boolean;
  redirect?: string;
}

export default function GuardRouteLayout({
  auth = false,
  requireFacility = false,
  redirect = "/login",
}: GuardRouteLayoutProps) {
  const setUser = useSetAtom(userAtom);
  const selectedFacility = useAtomValue(selectedFacilityAtom);
  const location = useLocation();

  // 🔐 Lấy token từ store hoặc cookie
  const token = accessTokenStore.get() || Cookies.get(COOKIE_KEYS.at);
  const isAuth = !!token;

  console.log("requireFacility", requireFacility);

  // 🧠 Dùng React Query để gọi getProfile - chỉ gọi khi cần auth và có token
  const {
    data: user,
    isError,
    isLoading,
    isSuccess,
  } = useQuery({
    queryKey: ["me"],
    queryFn: getProfile,
    enabled: auth && isAuth && !!requireFacility, // Chỉ gọi API khi không yêu cầu facility
    retry: false,
    staleTime: 1000 * 60 * 5,
  });

  useEffect(() => {
    if (user && isSuccess) {
      setUser(user);
    } else if (isError) {
      setUser(null);
    }
  }, [user, isError, isSuccess, setUser, requireFacility]);

  // Hiển thị loading khi đang gọi API
  if (auth && isAuth && isLoading && !requireFacility) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  // 🔄 Nếu route yêu cầu login mà chưa có token hoặc lỗi token → về login
  if (auth && (!isAuth || isError)) {
    return <Navigate to={redirect} replace state={{ from: location }} />;
  }

  // 🚫 Nếu route công khai mà đã có token → chuyển hướng
  if (!auth && isAuth) {
    // Nếu đã chọn facility thì về dashboard, chưa thì về select facilities
    const redirectTo = selectedFacility
      ? "/"
      : PATH_ROUTE_ADMIN.SELECT_FACILITIES;
    return <Navigate to={redirectTo} replace />;
  }

  // 🏥 Nếu route yêu cầu facility nhưng chưa chọn
  if (auth && requireFacility && !selectedFacility) {
    return <Navigate to={redirect} replace state={{ from: location }} />;
  }

  // 🚀 Nếu đang ở trang select facilities nhưng đã chọn facility → về dashboard
  if (
    location.pathname === PATH_ROUTE_ADMIN.SELECT_FACILITIES &&
    selectedFacility
  ) {
    return <Navigate to="/" replace />;
  }

  // ✅ Trả về route con
  return <Outlet />;
}
