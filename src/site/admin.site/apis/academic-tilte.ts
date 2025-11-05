import axiosWithToken from "@/lib/axios/axios-private";
import type { ResponseParamsResult } from "@/lib/axios/axios-type";
import type { IParams } from "@/types/params";
import type { ResponseAcademicTitle } from "../pages/academic-title/type";

const academicTitleAdmin = {
  getList: async (
    params?: IParams
  ): Promise<ResponseParamsResult<ResponseAcademicTitle[]>> => {
    return await axiosWithToken.get("/admin/academic-title", {
      params: {
        ...params,
      },
    });
  },

  create: (data: ResponseAcademicTitle) => {
    return axiosWithToken.post("/admin/academic-title", data);
  },

  update: (data: ResponseAcademicTitle) => {
    return axiosWithToken.put(`/admin/academic-title/${data.id}`, data);
  },

  delete: (id: number) => {
    return axiosWithToken.delete(`/admin/academic-title/${id}`);
  },
};

export default academicTitleAdmin;
