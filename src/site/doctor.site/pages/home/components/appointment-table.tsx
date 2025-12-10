import type { IMyAppointmentRes } from "@/site/user.site/pages/profile/types/type";
import { CalendarOutlined } from "@ant-design/icons";
import {
  Avatar,
  Button as ButtonAnt,
  Card,
  Flex,
  Select,
  Space,
  Table,
  Tag,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import { Dayjs } from "dayjs";
import React, { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import {
  useGetAppointment,
  useUpadateStatusAppointment,
} from "../../list-appointment/hooks/useAppointment";
import type {
  AppointmentParamsDasboard,
  AppointmentStatus,
} from "../../list-appointment/stores/params";
import type {
  AppointmentActionModalRef,
  ModalType,
} from "../../list-appointment/components/modal-confirm-status";
import AppointmentActionModal from "../../list-appointment/components/modal-confirm-status";
import { toast } from "sonner";
import "dayjs/locale/vi";
import SearchBox from "@/site/admin.site/pages/info-doctor/components/search-box";

const ActionCell = React.memo(
  ({
    record,
    onCancel,
    onConfirm,
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
      </DropdownMenuContent>
    </DropdownMenu>
  )
);

interface IProps {
  dateRange: Dayjs[];
  refetch_user: () => void;
}

export default function AppointmentTable({ dateRange, refetch_user }: IProps) {
  const [param, setParam] = useState<AppointmentParamsDasboard>({
    fromDate: dateRange[0].format("YYYY-MM-DD"),
    toDate: dateRange[1].format("YYYY-MM-DD"),
    keyword: "",
    page: 1,
    per_page: 10,
    status: "PENDING",
  });
  const { data, isLoading, refetch } = useGetAppointment(param);
  const [modalVisible, setModalVisible] = React.useState(false);
  const [modalType, setModalType] = React.useState<ModalType>(null);
  const [selectedRecord, setSelectedRecord] =
    React.useState<IMyAppointmentRes | null>(null);
  const modalRef = React.useRef<AppointmentActionModalRef>(null);

  const { mutate, isPending } = useUpadateStatusAppointment();

  useEffect(() => {
    setParam((prev) => ({
      ...prev,
      fromDate: dateRange[0].format("YYYY-MM-DD"),
      toDate: dateRange[1].format("YYYY-MM-DD"),
    }));
  }, [dateRange]);

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

  const handleCloseModal = () => {
    setModalVisible(false);
    setModalType(null);
    setSelectedRecord(null);
    if (modalRef.current) {
      modalRef.current.setCancelReason("");
      modalRef.current.setCancelReasonError("");
    }
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
        refetch_user();
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

  const handleTableChange = (pagination: any) => {
    setParam({
      ...param,
      page: pagination.current,
      per_page: pagination.pageSize,
    });
  };

  return (
    <Card
      title={
        <Space>
          <CalendarOutlined />
          <span>
            Lịch hẹn ({dateRange[0].format("DD/MM")} -{" "}
            {dateRange[1].format("DD/MM")})
          </span>
        </Space>
      }
      extra={
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
      }
      loading={isLoading}
      style={{
        borderRadius: "8px",
        boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
      }}
    >
      <Flex gap={14} justify="space-between" wrap style={{ marginBottom: 16 }}>
        <Flex gap={14}>
          <SearchBox
            value={param.keyword}
            onSearch={(value) => {
              setParam({
                ...param,
                keyword: value,
                page: 1,
              });
            }}
          />
        </Flex>
      </Flex>
      <Table
        columns={columns}
        dataSource={data?.data ?? []}
        pagination={{
          current: Number(data?.current_page) ?? 1,
          pageSize: Number(data?.per_page) ?? 100,
          total: data?.total ?? 0,
          showSizeChanger: true,
          showTotal: (total) => `Tổng ${total} bản ghi`,
          position: ["bottomCenter"],
        }}
        bordered
        scroll={{
          x: "max-content",
          y: 300,
        }}
        rowKey="id"
        onChange={handleTableChange}
      />
      <AppointmentActionModal
        ref={modalRef}
        open={modalVisible}
        modalType={modalType}
        selectedRecord={selectedRecord}
        onCancel={handleCloseModal}
        onConfirm={handleModalConfirm}
        loading={isPending}
      />
    </Card>
  );
}
