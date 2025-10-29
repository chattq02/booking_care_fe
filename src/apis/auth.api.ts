import axiosPublic from "@/lib/axios/axios-public";
import type { ResponseResult } from "@/lib/axios/axios-type";
import type { LoginResponseData } from "@/site/admin.site/types/auth";
import type { LoginForm } from "@/types/auth";

const authApi = {
  login: (data: LoginForm): Promise<ResponseResult<LoginResponseData>> => {
    return axiosPublic.post("/auth/login", data);
  },
  verifyEmail: (token: string): Promise<ResponseResult> => {
    return axiosPublic.post("/auth/verify-email", { token });
  },
};

export default authApi;
