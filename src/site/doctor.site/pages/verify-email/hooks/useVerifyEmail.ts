import authApi from "@/apis/auth.api";
import type { VerifyEmailType } from "@/site/doctor.site/types/auth";
import { useMutation } from "@tanstack/react-query";

const useVerifyEmail = () => {
  return useMutation({
    mutationFn: ({ token, type }: { token: string; type: VerifyEmailType }) =>
      authApi.verifyEmail(token, type),
  });
};

export { useVerifyEmail };
