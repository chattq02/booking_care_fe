import axiosWithToken from "@/lib/axios/axios-private";
import axiosPublic from "@/lib/axios/axios-public";
import type {
  IFacility,
  PaginationResponse,
  ResponseResult,
} from "@/lib/axios/axios-type";

import type { VerifyEmailType } from "@/site/doctor.site/types/auth";
import type {
  IMyAppointmentRes,
  IParamMyAppointment,
  RegisterDoctorDto,
  RegisterUserDto,
} from "@/site/user.site/pages/profile/types/type";
import type {
  GetMeResponseData,
  LoginForm,
  LoginResponseData,
  RefreshTokenResponse,
  ReqUpdateUser,
  UserStatus,
} from "@/types/auth";
import { omit } from "lodash";

const authApi = {
  login: async (
    data: LoginForm
  ): Promise<ResponseResult<LoginResponseData>> => {
    return await axiosPublic.post("/auth/login", data);
  },

  verifyEmail: async (
    token: string,
    type: VerifyEmailType
  ): Promise<ResponseResult> => {
    return type === "Verify"
      ? await axiosPublic.post("/auth/verify-email", { token })
      : await axiosPublic.post("/auth/re-send-verify-email", { token });
  },

  logout: () => {
    return axiosWithToken.post("/auth/logout");
  },

  getMe: (): Promise<ResponseResult<GetMeResponseData | null>> => {
    return axiosWithToken.post("/auth/me");
  },

  updateUser: async (data: Partial<ReqUpdateUser>) => {
    return axiosWithToken.put("/auth/user", data);
  },

  refreshToken: async (): Promise<
    ResponseResult<RefreshTokenResponse | null>
  > => {
    return await axiosWithToken.post("/auth/refresh-token");
  },

  selectFacility: async (data: IFacility) => {
    return axiosWithToken.post(
      "/auth/select-facility",
      omit(data, ["address", "name", "imageUrl"])
    );
  },

  getMyAppointment: async (
    params: IParamMyAppointment
  ): Promise<PaginationResponse<IMyAppointmentRes[]>> => {
    const res = await axiosWithToken.get("/user/my-appointment", {
      params: params,
    });
    return res.data;
  },

  registerDoctor: async (data: RegisterDoctorDto) => {
    return await axiosWithToken.post("/auth/register-doctor", data);
  },

  registerUser: (data: RegisterUserDto) => {
    return axiosPublic.post("/auth/register-user", data);
  },

  forgotPassword: (email: string) => {
    return axiosPublic.post("/auth/forgot-password", { email });
  },

  changePassword: (data: { old_password: string; new_password: string }) => {
    return axiosPublic.post("/auth/change-password", data);
  },

  forgotPasswordDoctor: (email: string) => {
    return axiosPublic.post("/auth/forgot-password-doctor", { email });
  },

  changeStatusDoctor: (data: { email: string; user_status: UserStatus }) => {
    return axiosWithToken.post("/auth/change-status-doctor", data);
  },
};

export default authApi;
