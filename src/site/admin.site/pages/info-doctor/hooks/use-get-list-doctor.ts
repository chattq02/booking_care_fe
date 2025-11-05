import doctorAdmin from "@/site/admin.site/apis/doctor.api";
import { toast } from "sonner";
import type { IDoctorParams } from "../type";

const getListDoctor = async (params: IDoctorParams) => {
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
