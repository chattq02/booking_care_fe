import authApi from "@/apis/auth.api";
import type { IFacility } from "@/lib/axios/axios-type";
import { toast } from "sonner";

const logOut = async () => {
  try {
    const result = await authApi.logout();
    return result.data;
  } catch (error: any) {
    toast.error(error.response?.data.message || "Không lấy được thông tin");
  }
};

const selectFacility = async (data: IFacility) => {
  return authApi.selectFacility(data);
};

export { logOut, selectFacility };
