import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import scheduleAdmin from "@/site/admin.site/apis/schedule";
import type { IWorkSchedule, ScheduleParams } from "../type";
import { toast } from "sonner";

interface UseOptions {
  onSuccessCallback?: () => void;
  onErrorCallback?: () => void;
}

// 🔹 Lấy danh sách lịch hẹn
export const useGetListSchedule = (params: ScheduleParams, enabled = true) => {
  return useQuery({
    queryKey: ["ListSchedule", params],
    queryFn: async () => {
      const result = await scheduleAdmin.getList(params);
      return result.data;
    },
    enabled,
    placeholderData: (prev) => prev,
    staleTime: 1000 * 60 * 5,
  });
};

// 🔹 Cập nhật lịch hẹn
export const useUpdateScheduleFacility = ({
  onSuccessCallback,
  onErrorCallback,
  ...restProps
}: UseOptions & Record<string, any> = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: IWorkSchedule) =>
      scheduleAdmin.update(restProps.id_schedule, data),
    onSuccess: () => {
      toast.success("Cập nhật lịch hẹn thành công");
      queryClient.invalidateQueries({ queryKey: ["ListSchedule"] });
      onSuccessCallback?.();
    },
    onError: (error: any) => {
      onErrorCallback?.();
      toast.error(error.response?.data?.message || "Lỗi cập nhật");
    },
  });
};

// 🔹 Lưu lịch hẹn
export const useCreateScheduleFacility = ({
  onSuccessCallback,
  onErrorCallback,
}: UseOptions & Record<string, any> = {}) => {
  return useMutation({
    mutationFn: (data: IWorkSchedule) => scheduleAdmin.save(data),
    onSuccess: () => {
      toast.success("Lưu hẹn thành công");
      onSuccessCallback?.();
    },
    onError: (error: any) => {
      onErrorCallback?.();
      toast.error(error.response?.data?.message || "Lỗi cập nhật");
    },
  });
};
