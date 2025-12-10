import axiosWithToken from "@/lib/axios/axios-private";
import type {
  ResponseParamsResult,
  ResponseResult,
} from "@/lib/axios/axios-type";
import type {
  ICreateMedicineDto,
  IMedicine,
  IUpdateMedicineDto,
} from "../pages/medical-facility/type";
import type { MedicineParams } from "../pages/medical-facility/store/params";

const medicineApi = {
  /**
   * 🧩 Lấy danh sách thuốc (có phân trang + tìm kiếm)
   */
  getList: async (
    params?: MedicineParams
  ): Promise<ResponseParamsResult<IMedicine[]>> => {
    return axiosWithToken.get("/medicine", {
      params: {
        ...params,
      },
    });
  },

  /**
   * 🔍 Lấy thông tin 1 thuốc theo ID
   */
  getById: async (id: number): Promise<ResponseResult<IMedicine>> => {
    return axiosWithToken.get(`/medicine/${id}`);
  },

  /**
   * ➕ Tạo thuốc mới
   */
  create: (data: ICreateMedicineDto) => {
    return axiosWithToken.post("/medicine", data);
  },

  /**
   * 🛠️ Cập nhật thông tin thuốc
   */
  update: (data: IUpdateMedicineDto) => {
    return axiosWithToken.put(`/medicine/${data.id}`, data);
  },

  /**
   * 🗑️ Xóa thuốc
   */
  delete: (id: number) => {
    return axiosWithToken.delete(`/medicine/${id}`);
  },
};

export default medicineApi;
