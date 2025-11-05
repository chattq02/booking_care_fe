import authApi from "@/apis/auth.api";
import { toast } from "sonner";

const logOut = async () => {
  try {
    const result = await authApi.logout();
    return result.data;
  } catch (error: any) {
    toast.error(error.response?.data.message || "Không lấy được thông tin");
  }
};

export { logOut };
