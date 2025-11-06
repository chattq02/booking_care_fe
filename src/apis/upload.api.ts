import axiosWithToken from "@/lib/axios/axios-private";
import type { ResponseResult } from "@/lib/axios/axios-type";
import type { IFile } from "@/types/file";

const fileApi = {
  upload: async (file: File): Promise<ResponseResult<IFile>> => {
    const formData = new FormData();
    formData.append("file", file);

    return await axiosWithToken.post("/file/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
};

export default fileApi;
