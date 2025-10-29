import Cookies from "js-cookie";
import { Navigate, Outlet } from "react-router-dom";

export default function GuardRouteLayout({ auth = false, redirect = "/login" }) {
    const isAuth = !!Cookies.get("access_token");

    if (auth && !isAuth) return <Navigate to={redirect} />;
    if (!auth && isAuth) return <Navigate to={redirect} />;

    return <Outlet />;
}

