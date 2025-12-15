import authApi from "@/apis/auth.api";
import type { RegisterUserDto } from "@/site/user.site/pages/profile/types/type";
import type { LoginForm, UserStatus } from "@/types/auth";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

function useLogin() {
  return useMutation({
    mutationFn: (dataForm: LoginForm) => authApi.login(dataForm),
  });
}

function useRegisterUser() {
  return useMutation({
    mutationFn: (dataForm: RegisterUserDto) => authApi.registerUser(dataForm),
  });
}

function useForgotPassword() {
  return useMutation({
    mutationFn: (email: string) => authApi.forgotPassword(email),
  });
}

function useForgotPasswordDoctor() {
  return useMutation({
    mutationFn: (email: string) => authApi.forgotPasswordDoctor(email),
  });
}

function useChangeStatusDoctor() {
  return useMutation({
    mutationFn: (data: { email: string; user_status: UserStatus }) =>
      authApi.changeStatusDoctor(data),
  });
}

async function getProfile() {
  try {
    const result = await authApi.getMe();
    return result.data;
  } catch (error: any) {
    toast.error(
      error.response?.data.message || "Không lấy được thông tin người dùng"
    );
  }
}

export {
  useLogin,
  getProfile,
  useRegisterUser,
  useForgotPassword,
  useForgotPasswordDoctor,
  useChangeStatusDoctor,
};
