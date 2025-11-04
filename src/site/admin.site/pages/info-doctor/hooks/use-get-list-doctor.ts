import doctorAdmin from "@/site/admin.site/apis/doctor.api";
import type { IParams } from "@/types/params";
import { toast } from "sonner";

const getListDoctor = async (params: IParams) => {
  try {
    const result = await doctorAdmin.getDoctorList(params);
    return result.data;
  } catch (error: any) {
    toast.error(
      error.response?.data.message || "Không lấy được thông tin người dùng"
    );
  }
};

export { getListDoctor };
