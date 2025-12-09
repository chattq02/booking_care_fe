import React from "react";
import {
  Select,
  Flex,
  Button as ButtonAnt,
  ConfigProvider,
  DatePicker,
  Avatar,
  Tag,
} from "antd";

import type { ColumnsType } from "antd/es/table";
import { DataGrid } from "@/components/data-table";
import { MoreHorizontal } from "lucide-react";
import { useAtom } from "jotai";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import "dayjs/locale/vi";
import viVN from "antd/locale/vi_VN";
import {
  useGetAppointment,
  useUpadateStatusAppointment,
} from "./hooks/useAppointment";
import type { IMyAppointmentRes } from "@/site/user.site/pages/profile/types/type";
import { appointmentParamsAtom, type AppointmentStatus } from "./stores/params";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import { toast } from "sonner";
import AppointmentActionModal, {
  type AppointmentActionModalRef,
  type ModalType,
} from "./components/modal-confirm-status";

const ActionCell = React.memo(
  ({
    record,
    onCancel,
    onConfirm,
    onFinish,
  }: {
    record: IMyAppointmentRes;
    onCancel: (record: IMyAppointmentRes) => void;
    onConfirm: (record: IMyAppointmentRes) => void;
    onFinish: (record: IMyAppointmentRes) => void;
  }) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-9 w-9 p-0 cursor-pointer">
          <MoreHorizontal size={30} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <ButtonAnt className="w-full" onClick={() => onCancel(record)}>
            Hủy lịch
          </ButtonAnt>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <ButtonAnt className="w-full" onClick={() => onConfirm(record)}>
            Xác nhận
          </ButtonAnt>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <ButtonAnt className="w-full" onClick={() => onFinish(record)}>
            Hoàn thành
          </ButtonAnt>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
);

export default function ListAppointment() {
  const [param, setParam] = useAtom(appointmentParamsAtom);

  const [modalVisible, setModalVisible] = React.useState(false);
  const [modalType, setModalType] = React.useState<ModalType>(null);
  const [selectedRecord, setSelectedRecord] =
    React.useState<IMyAppointmentRes | null>(null);

  const modalRef = React.useRef<AppointmentActionModalRef>(null);

  const { data, isLoading, refetch } = useGetAppointment({
    fromDate: "",
    keyword: "",
    page: 1,
    per_page: 10,
    status: "PENDING",
    toDate: "",
  });
  const { mutate, isPending } = useUpadateStatusAppointment();

  const columns: ColumnsType<IMyAppointmentRes> = [
    {
      title: "Ngày",
      dataIndex: "appointmentDate",
      key: "appointmentDate",
    },
    {
      title: "Thời gian",
      dataIndex: "slot",
      key: "slot",
      render: (slot: string) => {
        if (!slot) return "-";

        try {
          const parsed = JSON.parse(slot) as {
            id: string;
            startTime: string;
            endTime: string;
            selected: boolean;
            isBlock: boolean;
          };

          return (
            <span className="font-medium">
              {parsed.startTime} - {parsed.endTime}
            </span>
          );
        } catch (error) {
          return "-";
        }
      },
    },
    {
      title: "Bệnh nhân",
      dataIndex: "patient",
      key: "patient",
      render: (patient: {
        id: number;
        fullName: string;
        avatar: string;
        bhyt: string;
        cccd: string;
        gender: "FEMALE" | "MALE" | "OTHER";
        address: string;
        phone: string;
      }) => {
        return (
          <div className="flex items-center gap-2">
            <Avatar
              size={32}
              src={patient.avatar || undefined}
              alt={patient.fullName}
            >
              {!patient.avatar && patient.fullName[0]}
            </Avatar>
            <span className="font-medium">{patient.fullName}</span>
          </div>
        );
      },
    },
    {
      title: "Bhyt",
      dataIndex: "patient",
      key: "bhyt",
      render: (patient: {
        id: number;
        fullName: string;
        avatar: string;
        bhyt: string;
        cccd: string;
        gender: "FEMALE" | "MALE" | "OTHER";
        address: string;
        phone: string;
      }) => {
        return patient.bhyt ?? "";
      },
    },
    {
      title: "CCCD",
      dataIndex: "patient",
      key: "CCCD",
      render: (patient: {
        id: number;
        fullName: string;
        avatar: string;
        bhyt: string;
        cccd: string;
        gender: "FEMALE" | "MALE" | "OTHER";
        address: string;
        phone: string;
      }) => {
        return patient.cccd ?? "";
      },
    },
    {
      title: "Giới tính",
      dataIndex: "patient",
      key: "gender",
      render: (patient: {
        id: number;
        fullName: string;
        avatar: string;
        bhyt: string;
        cccd: string;
        gender: "FEMALE" | "MALE" | "OTHER";
        address: string;
        phone: string;
      }) => {
        const genderMap = {
          FEMALE: "Nữ",
          MALE: "Nam",
          OTHER: "Khác",
        };
        return genderMap[patient.gender] || patient.gender;
      },
    },
    {
      title: "Địa chỉ",
      dataIndex: "patient",
      key: "address",
      render: (patient: {
        id: number;
        fullName: string;
        avatar: string;
        bhyt: string;
        cccd: string;
        gender: "FEMALE" | "MALE" | "OTHER";
        address: string;
        phone: string;
      }) => {
        return patient.address;
      },
    },
    {
      title: "SĐT",
      dataIndex: "patient",
      key: "address",
      render: (patient: {
        id: number;
        fullName: string;
        avatar: string;
        bhyt: string;
        cccd: string;
        gender: "FEMALE" | "MALE" | "OTHER";
        address: string;
        phone: string;
      }) => {
        return patient.phone;
      },
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status: string) => {
        const color = status.toLowerCase() === "confirmed" ? "green" : "orange";
        const text =
          status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
        return (
          <Tag color={color} className="font-semibold px-3 py-1 rounded-full">
            {text}
          </Tag>
        );
      },
    },
    {
      title: "Giá",
      dataIndex: "paymentAmount",
      key: "paymentAmount",
      render: (price: number) =>
        price ? price.toLocaleString("vi-VN") + "₫" : "---",
    },
    {
      title: "Lý do khám",
      dataIndex: "note",
      key: "note",
      render: (text: string | null) => text || "",
    },
    {
      width: 80,
      fixed: "right",
      align: "center",
      title: "",
      key: "action",
      render: (_, record) => (
        <ActionCell
          record={record}
          onCancel={handleCancelClick}
          onConfirm={handleConfirmClick}
          onFinish={handleFinishClick}
        />
      ),
    },
  ];

  const handleCancelClick = (record: IMyAppointmentRes) => {
    setSelectedRecord(record);
    setModalType("cancel");
    modalRef.current?.setCancelReason("");
    modalRef.current?.setCancelReasonError("");
    setModalVisible(true);
  };

  const handleConfirmClick = (record: IMyAppointmentRes) => {
    setSelectedRecord(record);
    setModalType("confirm");
    setModalVisible(true);
  };

  const handleFinishClick = (record: IMyAppointmentRes) => {
    setSelectedRecord(record);
    setModalType("finish");
    setModalVisible(true);
  };

  const handleModalConfirm = (status: AppointmentStatus, remark?: string) => {
    if (!selectedRecord) return;

    const successMessage = getSuccessMessage(status);

    const payload: {
      id: number;
      status: AppointmentStatus;
      remark?: string;
    } = {
      id: Number(selectedRecord.id),
      status,
    };

    if (remark) {
      payload.remark = remark;
    }

    mutate(payload, {
      onSuccess: () => {
        refetch();
        toast.success(successMessage);
        handleCloseModal();
      },
      onError: () => {
        toast.error(`Có lỗi xảy ra khi ${getModalTitle(modalType)}`);
      },
    });
  };

  const getSuccessMessage = (status: AppointmentStatus) => {
    switch (status) {
      case "CANCELED":
        return "Hủy lịch thành công";
      case "CONFIRMED":
        return "Xác nhận lịch thành công";
      case "COMPLETED":
        return "Đã hoàn thành ca khám thành công";
      default:
        return "Thao tác thành công";
    }
  };

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

  const handleCloseModal = () => {
    setModalVisible(false);
    setModalType(null);
    setSelectedRecord(null);
    if (modalRef.current) {
      modalRef.current.setCancelReason("");
      modalRef.current.setCancelReasonError("");
    }
  };

  const handleTableChange = (pagination: any) => {
    setParam({
      ...param,
      page: pagination.current,
      per_page: pagination.pageSize,
    });
  };

  return (
    <div style={{ padding: "15px 20px" }}>
      <Flex style={{ marginBottom: 12 }} gap={14} justify="space-between" wrap>
        <Flex gap={14}>
          <ConfigProvider locale={viVN}>
            <DatePicker
              value={dayjs(param.appointmentDate)}
              allowClear={false}
              placeholder="Chọn ngày"
              size="middle"
              format="YYYY-MM-DD"
              onChange={(value: Dayjs | null) => {
                setParam({
                  ...param,
                  appointmentDate: value ? value.format("YYYY-MM-DD") : null,
                  page: 1,
                });
              }}
            />
          </ConfigProvider>
          <Select
            defaultValue={param.status}
            style={{ width: 150 }}
            onChange={(value) =>
              setParam({
                ...param,
                status: value,
                page: 1,
              })
            }
            options={[
              { value: "PENDING", label: "Chờ duyệt" },
              { value: "CONFIRMED", label: "Đã xác nhận" },
              { value: "COMPLETED", label: "Đã hoàn thành" },
              { value: "CANCELED", label: "Đã hủy" },
            ]}
          />
        </Flex>
        <Flex gap={14}>
          <ButtonAnt type="primary" onClick={() => {}}>
            Duyệt
          </ButtonAnt>
        </Flex>
      </Flex>

      <DataGrid<IMyAppointmentRes>
        columns={columns}
        data={data?.data ?? []}
        pagination={{
          current: Number(data?.current_page) ?? 1,
          pageSize: Number(data?.per_page) ?? 100,
          total: data?.total ?? 0,
          showSizeChanger: true,
          showTotal: (total) => `Tổng ${total} bản ghi`,
          position: ["bottomCenter"],
        }}
        rowKey="id"
        loading={isLoading || isPending}
        onChange={handleTableChange}
        className="[&_.ant-table-cell]:py-0.5! [&_.ant-table-thead_.ant-table-cell]:py-3!"
      />

      {/* Modal component tách riêng */}
      <AppointmentActionModal
        ref={modalRef}
        open={modalVisible}
        modalType={modalType}
        selectedRecord={selectedRecord}
        onCancel={handleCloseModal}
        onConfirm={handleModalConfirm}
        loading={isPending}
      />
    </div>
  );
}
