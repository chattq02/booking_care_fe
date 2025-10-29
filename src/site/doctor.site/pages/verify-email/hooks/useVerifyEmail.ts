import authApi from "@/apis/auth.api";
import { useMutation } from "@tanstack/react-query";

export function useVerifyEmail() {
  return useMutation({
    mutationFn: (token: string) => authApi.verifyEmail(token),
  });
}
