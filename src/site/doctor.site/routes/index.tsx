import Login from "../pages/auth/login/login";
import VerifyEmail from "../pages/verify-email/verify-email";

export const doctorRoutes = {
  path: "/",
  element: <div>doctor</div>,
};

export const publicDoctorRoutes = [
  {
    path: "/verify-email",
    element: <VerifyEmail />,
  },
  {
    path: "/login",
    element: <Login />,
  },
];
