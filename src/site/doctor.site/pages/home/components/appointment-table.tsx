import type { IMyAppointmentRes } from "@/site/user.site/pages/profile/types/type";
import { CalendarOutlined } from "@ant-design/icons";
import {
  Avatar,
  Badge,
  Button as ButtonAnt,
  Card,
  Grid,
  Space,
  Table,
  Tag,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import React, { useState } from "react";
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
import { useGetAppointment } from "../../list-appointment/hooks/useAppointment";
import type { AppointmentParams } from "../../list-appointment/stores/params";

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
const { useBreakpoint } = Grid;

export default function AppointmentTable() {
  const [param, setParam] = useState<AppointmentParams>({
    appointmentDate: dayjs().format("YYYY-MM-DD"),
    keyword: "",
    page: 1,
    per_page: 10,
    status: "PENDING",
  });
  const [dateRange, setDateRange] = useState([
    dayjs().startOf("month"),
    dayjs().endOf("month"),
  ]);
  const screens = useBreakpoint();
  const { data, isLoading, refetch } = useGetAppointment(param);

  const handleCancelClick = (record: IMyAppointmentRes) => {
    //   setSelectedRecord(record);
    //   setModalType("cancel");
    //   modalRef.current?.setCancelReason("");
    //   modalRef.current?.setCancelReasonError("");
    //   setModalVisible(true);
  };

  const handleConfirmClick = (record: IMyAppointmentRes) => {
    //   setSelectedRecord(record);
    //   setModalType("confirm");
    //   setModalVisible(true);
  };

  const handleFinishClick = (record: IMyAppointmentRes) => {
    //   setSelectedRecord(record);
    //   setModalType("finish");
    //   setModalVisible(true);
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
          <Badge
            count={data?.data.length}
            style={{ backgroundColor: "#1890ff" }}
          />
        </Space>
      }
      extra={
        <ButtonAnt type="primary" size={screens.xs ? "small" : "middle"}>
          Xem tất cả
        </ButtonAnt>
      }
      loading={isLoading}
      style={{
        borderRadius: "8px",
        boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
      }}
    >
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
          y: 500,
        }}
        rowKey="id"
        size={screens.xs ? "small" : "middle"}
      />
    </Card>
  );
}
