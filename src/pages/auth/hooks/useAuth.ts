import authApi from "@/apis/auth.api";
import type { LoginForm } from "@/types/auth";

import { useMutation, useQuery } from "@tanstack/react-query";

function useLogin() {
  return useMutation({
    mutationFn: (dataForm: LoginForm) => authApi.login(dataForm),
  });
}

function getProfile() {
  return useQuery({
    queryKey: ["profile"],
    queryFn: () => authApi.getMe(),
    staleTime: 1000 * 60 * 5, // cache 5 phút
    refetchOnWindowFocus: false, // không tự động fetch khi tab active
  });
}

export { useLogin, getProfile };
