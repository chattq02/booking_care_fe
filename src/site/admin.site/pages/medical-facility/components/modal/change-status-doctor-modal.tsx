import { forwardRef, useImperativeHandle, useState } from "react";
import { Modal, Select, Tag } from "antd";
import type { UserStatus } from "@/types/auth";
import type { ResponseDoctor } from "@/site/admin.site/types/doctor";
import { useChangeStatusDoctor } from "@/pages/auth/hooks/useAuth";
import { toast } from "sonner";

export interface ChangeStatusModalRef {
  open: (doctor: ResponseDoctor) => void;
  close: () => void;
}

interface ChangeStatusModalProps {
  onSuccess?: () => void;
  refetch: () => void;
}

const ChangeStatusDoctorModal = forwardRef<
  ChangeStatusModalRef,
  ChangeStatusModalProps
>(({ refetch }, ref) => {
  const [open, setOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<ResponseDoctor | null>(
    null
  );
  const [selectedStatus, setSelectedStatus] = useState<UserStatus>("Pending");
  const [loading, setLoading] = useState(false);
  const { mutate: changeStatus } = useChangeStatusDoctor();

  useImperativeHandle(ref, () => ({
    open: (doctor: ResponseDoctor) => {
      setSelectedDoctor(doctor);
      setSelectedStatus(doctor.user_status);
      setOpen(true);
    },
    close: () => {
      setOpen(false);
      setSelectedDoctor(null);
      setLoading(false);
    },
  }));

  const statusOptions = [
    {
      value: "Active",
      label: "Đang hoạt động",
      color: "green",
    },
    {
      value: "InActive",
      label: "Ngưng hoạt động",
      color: "blue",
    },
    {
      value: "Pending",
      label: "Chưa xác thực",
      color: "orange",
    },
    {
      value: "Banned",
      label: "Đã bị khóa",
      color: "red",
    },
  ];

  const handleConfirm = async () => {
    if (!selectedDoctor || !selectedDoctor.id) {
      toast.error("Thông tin bác sĩ không hợp lệ");
      return;
    }

    if (selectedStatus === selectedDoctor.user_status) {
      toast.warning("Trạng thái không thay đổi");
      handleClose();
      return;
    }

    changeStatus(
      {
        email: selectedDoctor.email,
        user_status: selectedStatus,
      },
      {
        onSuccess: () => {
          toast.success("Thay đổi trạng thái thành công");
          handleClose();
          refetch();
        },
        onError: () => {
          toast.error("Thay đổi trạng thái thất bại");
        },
      }
    );

    setLoading(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedDoctor(null);
    setLoading(false);
  };

  const getStatusInfo = (status: UserStatus) => {
    const option = statusOptions.find((opt) => opt.value === status);
    return {
      label: option?.label || status,
      color: option?.color || "default",
    };
  };

  return (
    <Modal
      title="Đổi trạng thái bác sĩ"
      open={open}
      onCancel={handleClose}
      onOk={handleConfirm}
      confirmLoading={loading}
      okText="Xác nhận"
      cancelText="Hủy"
      okButtonProps={{
        disabled:
          !selectedStatus || selectedStatus === selectedDoctor?.user_status,
      }}
    >
      {selectedDoctor && (
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-500 mb-1">Bác sĩ</p>
            <p className="font-medium">{selectedDoctor.fullName}</p>
            <p className="text-sm text-gray-600">{selectedDoctor.email}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500 mb-1">Trạng thái hiện tại:</p>
            {selectedDoctor.user_status && (
              <Tag color={getStatusInfo(selectedDoctor.user_status).color}>
                {getStatusInfo(selectedDoctor.user_status).label}
              </Tag>
            )}
          </div>

          <div>
            <p className="text-sm text-gray-500 mb-1">Trạng thái mới:</p>
            <Select
              style={{ width: "100%" }}
              value={selectedStatus}
              onChange={setSelectedStatus}
              options={statusOptions
                .map((option) => ({
                  value: option.value,
                  label: (
                    <div className="flex items-center gap-2">
                      <Tag color={option.color}>{option.label}</Tag>
                    </div>
                  ),
                }))
                .filter(
                  (option) => option.value !== selectedDoctor.user_status
                )}
              placeholder="Chọn trạng thái"
            />
          </div>

          {selectedStatus === "Banned" && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              <p className="text-sm text-red-700 font-medium mb-1">
                ⚠️ Cảnh báo
              </p>
              <p className="text-sm text-red-600">
                Khi khóa tài khoản, bác sĩ sẽ không thể đăng nhập vào hệ thống.
                Hãy chắc chắn về quyết định này.
              </p>
            </div>
          )}
        </div>
      )}
    </Modal>
  );
});

ChangeStatusDoctorModal.displayName = "ChangeStatusDoctorModal";

export default ChangeStatusDoctorModal;
