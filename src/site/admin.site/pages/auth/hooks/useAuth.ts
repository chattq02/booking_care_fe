import authApi from "@/apis/auth.api";
import type { LoginForm } from "@/site/admin.site/types/auth";
import { useMutation } from "@tanstack/react-query";

export function useLogin() {
  return useMutation({
    mutationFn: (dataForm: LoginForm) => authApi.login(dataForm),
  });
}
