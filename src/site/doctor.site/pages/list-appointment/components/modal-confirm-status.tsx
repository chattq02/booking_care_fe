import React from "react";
import { Modal, Input } from "antd";
import { XCircle, CheckCircle, CheckCheck } from "lucide-react";
import type {
  IMyAppointmentRes,
  IAppointmentSlot,
} from "@/site/user.site/pages/profile/types/type";
import type { AppointmentStatus } from "../stores/params";

export type ModalType = "cancel" | "confirm" | "finish" | null;

export interface AppointmentActionModalProps {
  open: boolean;
  modalType: ModalType;
  selectedRecord: IMyAppointmentRes | null;
  onCancel: () => void;
  onConfirm: (status: AppointmentStatus, remark?: string) => void;
  loading?: boolean;
}

export interface AppointmentActionModalRef {
  cancelReason: string;
  setCancelReason: (reason: string) => void;
  cancelReasonError: string;
  setCancelReasonError: (error: string) => void;
}

const AppointmentActionModal = React.forwardRef<
  AppointmentActionModalRef,
  AppointmentActionModalProps
>(({ open, modalType, selectedRecord, onCancel, onConfirm, loading }, ref) => {
  const [cancelReason, setCancelReason] = React.useState("");
  const [cancelReasonError, setCancelReasonError] = React.useState("");

  // Expose internal state to parent via ref
  React.useImperativeHandle(
    ref,
    () => ({
      cancelReason,
      setCancelReason,
      cancelReasonError,
      setCancelReasonError,
    }),
    [cancelReason, cancelReasonError]
  );

  const getModalTitle = (type: ModalType) => {
    switch (type) {
      case "cancel":
        return "Hủy lịch hẹn";
      case "confirm":
        return "Xác nhận lịch hẹn";
      case "finish":
        return "Hoàn thành lịch hẹn";
      default:
        return "";
    }
  };

  const getModalIcon = (type: ModalType) => {
    switch (type) {
      case "cancel":
        return <XCircle style={{ color: "#ff4d4f", fontSize: 24 }} />;
      case "confirm":
        return <CheckCircle style={{ color: "#52c41a", fontSize: 24 }} />;
      case "finish":
        return <CheckCheck style={{ color: "#1890ff", fontSize: 24 }} />;
      default:
        return null;
    }
  };

  const getModalContent = (type: ModalType) => {
    if (!selectedRecord) return null;

    const patientName = selectedRecord.patient.fullName;
    const appointmentDate = selectedRecord.appointmentDate;
    let timeSlot = "-";

    if (selectedRecord.slot) {
      try {
        const parsed = JSON.parse(selectedRecord.slot) as IAppointmentSlot;
        timeSlot = `${parsed.startTime} - ${parsed.endTime}`;
      } catch {
        // Giữ giá trị mặc định
      }
    }

    switch (type) {
      case "cancel":
        return (
          <>
            <p style={{ marginBottom: 8 }}>
              <strong>Bệnh nhân:</strong> {patientName}
            </p>
            <p style={{ marginBottom: 8 }}>
              <strong>Ngày khám:</strong> {appointmentDate}
            </p>
            <p style={{ marginBottom: 16 }}>
              <strong>Thời gian:</strong> {timeSlot}
            </p>

            <div style={{ marginBottom: 16 }}>
              <label
                htmlFor="cancelReason"
                style={{ display: "block", marginBottom: 8 }}
              >
                <strong>
                  Lý do hủy lịch <span style={{ color: "red" }}>*</span>
                </strong>
              </label>
              <Input.TextArea
                id="cancelReason"
                value={cancelReason}
                onChange={(e) => {
                  setCancelReason(e.target.value);
                  if (cancelReasonError) setCancelReasonError("");
                }}
                placeholder="Nhập lý do hủy lịch..."
                rows={4}
                maxLength={500}
                showCount
                status={cancelReasonError ? "error" : ""}
              />
              {cancelReasonError && (
                <p style={{ color: "red", fontSize: 12, marginTop: 4 }}>
                  {cancelReasonError}
                </p>
              )}
            </div>

            <p style={{ color: "#666", fontSize: 14 }}>
              <strong>Lưu ý:</strong> Thao tác này không thể hoàn tác. Bệnh nhân
              sẽ nhận được thông báo về việc hủy lịch.
            </p>
          </>
        );

      case "confirm":
        return (
          <>
            <div
              style={{
                background: "#f6ffed",
                padding: 16,
                borderRadius: 8,
                marginBottom: 16,
              }}
            >
              <p style={{ marginBottom: 8 }}>
                <strong>Bệnh nhân:</strong> {patientName}
              </p>
              <p style={{ marginBottom: 8 }}>
                <strong>Ngày khám:</strong> {appointmentDate}
              </p>
              <p>
                <strong>Thời gian:</strong> {timeSlot}
              </p>
            </div>

            <p style={{ color: "#666", fontSize: 14 }}>
              Sau khi xác nhận, bệnh nhân sẽ nhận được thông báo và lịch hẹn sẽ
              chuyển sang trạng thái "Đã xác nhận".
            </p>
          </>
        );

      case "finish":
        return (
          <>
            <div
              style={{
                background: "#e6f7ff",
                padding: 16,
                borderRadius: 8,
                marginBottom: 16,
              }}
            >
              <p style={{ marginBottom: 8 }}>
                <strong>Bệnh nhân:</strong> {patientName}
              </p>
              <p style={{ marginBottom: 8 }}>
                <strong>Ngày khám:</strong> {appointmentDate}
              </p>
              <p>
                <strong>Thời gian:</strong> {timeSlot}
              </p>
            </div>

            <p style={{ color: "#666", fontSize: 14 }}>
              Thao tác này sẽ chuyển lịch hẹn sang trạng thái "Đã hoàn thành" và
              không thể chỉnh sửa sau này.
            </p>
          </>
        );

      default:
        return null;
    }
  };

  const getOkButtonProps = (type: ModalType) => {
    switch (type) {
      case "cancel":
        return { danger: true };
      case "confirm":
        return { type: "primary" as const };
      case "finish":
        return { type: "primary" as const };
      default:
        return {};
    }
  };

  const getOkText = (type: ModalType) => {
    switch (type) {
      case "cancel":
        return "Xác nhận hủy";
      case "confirm":
        return "Xác nhận";
      case "finish":
        return "Hoàn thành";
      default:
        return "Xác nhận";
    }
  };

  const handleModalConfirm = () => {
    if (!modalType || !selectedRecord) return;

    if (modalType === "cancel" && !cancelReason.trim()) {
      setCancelReasonError("Vui lòng nhập lý do hủy lịch");
      return;
    }

    let status: AppointmentStatus;
    switch (modalType) {
      case "cancel":
        status = "CANCELED";
        break;
      case "confirm":
        status = "CONFIRMED";
        break;
      case "finish":
        status = "COMPLETED";
        break;
      default:
        return;
    }

    onConfirm(status, modalType === "cancel" ? cancelReason.trim() : undefined);
  };

  if (!modalType) return null;

  return (
    <Modal
      title={
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {getModalIcon(modalType)}
          <span>{getModalTitle(modalType)}</span>
        </div>
      }
      open={open}
      onOk={handleModalConfirm}
      onCancel={onCancel}
      okText={getOkText(modalType)}
      cancelText="Thoát"
      confirmLoading={loading}
      okButtonProps={getOkButtonProps(modalType)}
      width={modalType === "cancel" ? 520 : 480}
    >
      <div style={{ margin: "20px 0" }}>{getModalContent(modalType)}</div>
    </Modal>
  );
});

AppointmentActionModal.displayName = "AppointmentActionModal";

export default AppointmentActionModal;
