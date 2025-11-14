import authApi from "@/apis/auth.api";
import type { LoginForm } from "@/types/auth";

import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

function useLogin() {
  return useMutation({
    mutationFn: (dataForm: LoginForm) => authApi.login(dataForm),
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

export { useLogin, getProfile };
