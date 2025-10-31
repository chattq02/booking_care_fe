import axiosWithToken from "@/lib/axios/axios-private";
import axiosPublic from "@/lib/axios/axios-public";
import type { ResponseResult } from "@/lib/axios/axios-type";

import type { VerifyEmailType } from "@/site/doctor.site/types/auth";
import type {
  GetMeResponseData,
  LoginForm,
  LoginResponseData,
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
  logout: async (refresh_token: string): Promise<ResponseResult> => {
    return await axiosWithToken.post("/auth/logout", refresh_token);
  },
  getMe: async (): Promise<ResponseResult<GetMeResponseData | null>> => {
    return await axiosWithToken.post("/auth/me");
  },
};

export default authApi;
