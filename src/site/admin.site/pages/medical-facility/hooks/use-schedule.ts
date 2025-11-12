import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import scheduleAdmin from "@/site/admin.site/apis/schedule";
import type { IWorkSchedule, ResponseSchedule, ScheduleParams } from "../type";
import { toast } from "sonner";

interface UseOptions {
  onSuccessCallback?: () => void;
  onErrorCallback?: () => void;
}

// 🔹 Lấy danh sách lịch hẹn
export const useGetListSchedule = (params: ScheduleParams, enabled = true) => {
  return useQuery({
    queryKey: ["medicalFacilities", params],
    queryFn: async () => {
      const result = await scheduleAdmin.getList(params);
      return result.data;
    },
    enabled,
    placeholderData: (prev) => prev,
  });
};

// 🔹 Cập nhật lịch hẹn
export const useUpdateScheduleFacility = ({
  onSuccessCallback,
  onErrorCallback,
}: UseOptions = {}) => {
  //   const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: IWorkSchedule) => scheduleAdmin.update(data),
    onSuccess: () => {
      toast.success("Cập nhật cơ sở y tế thành công");
      //   queryClient.invalidateQueries({ queryKey: ["medicalFacilities"] });
      //   queryClient.invalidateQueries({ queryKey: ["medicalFacility-tree"] });
      onSuccessCallback?.();
    },
    onError: (error: any) => {
      onErrorCallback?.();
      toast.error(
        error.response?.data?.message || "Không cập nhật được cơ sở y tế"
      );
    },
  });
};
