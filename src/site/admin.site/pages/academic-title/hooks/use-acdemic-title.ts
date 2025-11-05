import academicTitleAdmin from "@/site/admin.site/apis/academic-tilte";
import type { IParams } from "@/types/params";
import { toast } from "sonner";
import type { ResponseAcademicTitle } from "../type";

const getListAcademicTilte = async (params: IParams) => {
  try {
    const result = await academicTitleAdmin.getList(params);
    return result.data;
  } catch (error: any) {
    toast.error(error.response?.data.message || "Không lấy được thông tin");
  }
};

const createAcademicTilte = async (data: ResponseAcademicTitle) => {
  try {
    const result = await academicTitleAdmin.create(data);
    return result.data;
  } catch (error: any) {
    toast.error(error.response?.data.message || "Không tạo được thông tin");
  }
};

const updateAcademicTilte = async (data: ResponseAcademicTitle) => {
  try {
    const result = await academicTitleAdmin.update(data);
    return result.data;
  } catch (error: any) {
    toast.error(
      error.response?.data.message || "Không cập nhật được thông tin"
    );
  }
};

const deleteAcademicTilte = async (id: number) => {
  try {
    const result = await academicTitleAdmin.delete(id);
    return result.data;
  } catch (error: any) {
    toast.error(error.response?.data.message || "Không xóa được thông tin");
  }
};

export {
  getListAcademicTilte,
  createAcademicTilte,
  updateAcademicTilte,
  deleteAcademicTilte,
};
