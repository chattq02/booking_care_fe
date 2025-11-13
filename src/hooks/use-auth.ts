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
  try {
    const result = await authApi.selectFacility(data);
    return result.data;
  } catch (error: any) {
    toast.error(error.response?.data.message || "Không lấy được thông tin");
  }
};

export { logOut,selectFacility };
