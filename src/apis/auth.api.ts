import axiosWithToken from "@/lib/axios/axios-private";
import axiosPublic from "@/lib/axios/axios-public";
import type { IListFacility, ResponseResult } from "@/lib/axios/axios-type";

import type { VerifyEmailType } from "@/site/doctor.site/types/auth";
import type {
  GetMeResponseData,
  LoginForm,
  LoginResponseData,
  RefreshTokenResponse,
} from "@/types/auth";

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

  getMe: async (): Promise<ResponseResult<GetMeResponseData | null>> => {
    return await axiosWithToken.post("/auth/me");
  },

  refreshToken: async (): Promise<
    ResponseResult<RefreshTokenResponse | null>
  > => {
    return await axiosWithToken.post("/auth/refresh-token");
  },

  getFacility: async (): Promise<ResponseResult<IListFacility>> => {
    return axiosWithToken.get("/auth/get-list-facilities");
  },
};

export default authApi;
