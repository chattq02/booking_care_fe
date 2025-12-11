import { DataGrid } from "@/components/data-table";
import { Avatar, Button as ButtonAnt, Tag } from "antd";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { ColumnsType } from "antd/lib/table";
import React from "react";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import {
  useGetPatientAppointmentStatus,
  useUpadateStatusAppointmentUser,
} from "@/site/doctor.site/pages/list-appointment/hooks/useAppointment";
import { toast } from "sonner";
import type { IAppointmentHistoryItem } from "@/site/doctor.site/pages/list-appointment/type";

const ActionCell = React.memo(
  ({
    record,
    onCancel,
  }: {
    record: IAppointmentHistoryItem;
    onCancel: (record: IAppointmentHistoryItem) => void;
  }) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-9 w-9 p-0 cursor-pointer">
          <MoreHorizontal size={30} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        hidden={Boolean(record.status === "CANCELED")}
      >
        <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <ButtonAnt className="w-full" onClick={() => onCancel(record)}>
            Hủy lịch
          </ButtonAnt>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
);

export default function MyAppointment() {
  const { data, isLoading, refetch } = useGetPatientAppointmentStatus({
    page: 1,
    per_page: 50,
    status: "CONFIRMED",
  });

  const { mutate, isPending } = useUpadateStatusAppointmentUser();

  const columns: ColumnsType<IAppointmentHistoryItem> = [
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
      title: "Bác sĩ",
      dataIndex: "doctor",
      render: (doctor: { id: number; fullName: string; avatar: string }) => {
        return (
          <div className="flex items-center gap-2">
            <Avatar
              size={32}
              src={doctor.avatar || undefined}
              alt={doctor.fullName}
            >
              {!doctor.avatar && doctor.fullName[0]}
            </Avatar>
            <span className="font-medium">{doctor.fullName}</span>
          </div>
        );
      },
    },
    {
      title: "Bệnh viện",
      dataIndex: "facility",
      render: (facility: { id: number; name: string; address: string }) => {
        return (
          <div className="flex flex-col">
            <span className="font-medium">{facility.name}</span>
            <span className="text-gray-500 text-sm">{facility.address}</span>
          </div>
        );
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
        <ActionCell record={record} onCancel={handleCancel} />
      ),
    },
  ];

  const handleCancel = async (data: IAppointmentHistoryItem) => {
    console.log(data);
    mutate(
      {
        id: data.id,
        status: "CANCELED",
        remark: "",
      },
      {
        onSuccess: () => {
          toast.success("Hủy thành công!");
          refetch();
        },
        onError: (err: any) => {
          toast.error(err.response?.data?.message || "Có lỗi xảy ra!");
        },
      }
    );
  };

  return (
    <div className="mb-6 lg:mb-8">
      <DataGrid<IAppointmentHistoryItem>
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
        maxHeight={{
          isMax: true,
          customScrollY: 800,
        }}
        loading={isLoading || isPending}
        // onChange={handleTableChange}
        className="[&_.ant-table-cell]:py-0.5! [&_.ant-table-thead_.ant-table-cell]:py-3!"
      />
    </div>
  );
}
