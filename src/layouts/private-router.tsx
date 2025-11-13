import { Navigate, Outlet } from "react-router-dom";
import Cookies from "js-cookie";
import { accessTokenStore, userAtom } from "@/stores/auth";
import { COOKIE_KEYS } from "@/constants";
import { useSetAtom } from "jotai";
import { useQuery } from "@tanstack/react-query";
import { getProfile } from "@/pages/auth/hooks/useAuth";
import { useEffect } from "react";
import { Spin } from "antd";
import { PATH_ROUTE_ADMIN } from "@/site/admin.site/libs/enums/path";

export default function GuardRouteLayout({
  auth = false,
  redirect = "/login",
}) {
  const setUser = useSetAtom(userAtom);

  const token = accessTokenStore.get() || Cookies.get(COOKIE_KEYS.at);
  const isAuth = !!token;

  const {
    data: user,
    isError,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ["me"],
    queryFn: getProfile,
    enabled: isAuth && auth,
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

  if (auth && isAuth && (isLoading || isFetching)) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  if (auth && (!isAuth || isError)) {
    return <Navigate to={redirect} replace />;
  }

  if (!auth && isAuth) {
    return <Navigate to={redirect} replace />;
  }

  if (auth && isAuth && user) {
    const hasSelectedFacility = Boolean(user.is_selected);
    const currentPath = window.location.pathname;
    const isSelectFacilitiesPage =
      currentPath === PATH_ROUTE_ADMIN.SELECT_FACILITIES;

    // Chỉ redirect khi CHƯA chọn facility VÀ KHÔNG đang ở trang select facilities
    if (!hasSelectedFacility && !isSelectFacilitiesPage) {
      return <Navigate to={PATH_ROUTE_ADMIN.SELECT_FACILITIES} replace />;
    }

    // ✅ Nếu ĐÃ chọn facility nhưng VẪN ở trang select facilities → redirect về trang chính
    if (hasSelectedFacility && isSelectFacilitiesPage) {
      return <Navigate to="/" replace />;
    }
  }

  // ✅ Cho phép render outlet ngay cả khi đang check
  // Tránh bị block hoàn toàn
  return <Outlet />;
}
