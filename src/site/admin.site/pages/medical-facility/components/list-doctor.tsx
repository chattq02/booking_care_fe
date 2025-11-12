import { DataGrid } from "@/components/data-table";
import type { ResponseDoctor } from "@/site/admin.site/types/doctor";
import { Flex, Tag } from "antd";
import { forwardRef } from "react";
import { useGetListDoctorMedicalFacility } from "../hooks/use-medical-facility";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { ColumnsType } from "antd/es/table";
import type { UserStatus } from "@/types/auth";
import { Button as ButtonUI } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";

interface IProps {
  facilityId: number;
}

const ListDoctor = forwardRef<HTMLDivElement, IProps>(({ facilityId }, ref) => {
  const { data: listDoctors, isLoading } = useGetListDoctorMedicalFacility({
    id: Number(facilityId),
    keyword: "",
    page: 1,
    per_page: 50,
  });

  const columns: ColumnsType<ResponseDoctor> = [
    {
      title: "Id",
      width: 80,
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Tên",
      dataIndex: "fullName",
      key: "fullName",
    },
    {
      title: "Chức vụ",
      dataIndex: "academicTitle",
      key: "academicTitle",
      render: (value) => {
        return <div>{value?.name ?? ""}</div>;
      },
    },
    {
      title: "Phòng ban",
      dataIndex: "departments",
      key: "departments",
      render: (value) => {
        return (
          <div style={{ whiteSpace: "pre-line" }}>
            {value
              ?.map((val: { id: number; name: string }) => val.name)
              .join(",\n")}
          </div>
        );
      },
    },
    {
      width: 180,
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      width: 180,
      title: "CCCD",
      dataIndex: "cccd",
      key: "cccd",
      ellipsis: true,
    },
    {
      width: 180,
      title: "Điện thoại",
      dataIndex: "phone",
      key: "phone",
      ellipsis: true,
    },
    {
      width: 150,
      title: "Trạng thái",
      dataIndex: "user_status",
      key: "user_status",
      render: (value: UserStatus) => {
        let color, text;

        switch (value) {
          case "Active":
            color = "green";
            text = "Đang hoạt động";
            break;
          case "InActive":
            color = "blue";
            text = "Ngưng hoạt động";
            break;
          case "Pending":
            color = "orange";
            text = "Chưa verify";
            break;
          default:
            color = "gray";
            text = "Tài khoản bị khóa";
        }

        return (
          <div className="flex justify-center">
            <Tag color={color}>{text}</Tag>
          </div>
        );
      },
    },
    {
      width: 80,
      fixed: "right",
      align: "center",
      title: "",
      key: "action",
      render: (_, record) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <ButtonUI variant="ghost" className="h-9 w-9 p-0 cursor-pointer">
              <MoreHorizontal size={30} />
            </ButtonUI>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => console.log("record", record)}>
              Copy payment ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View customer</DropdownMenuItem>
            <DropdownMenuItem>View payment details</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];
  return (
    <div className="bg-white rounded-md p-5.5">
      <Flex gap={10} align="center" className="mb-5!">
        <div className="h-6 w-[5px] bg-[#9afaeb] rounded" />
        <h3
          className="text-xl font-semibold"
          ref={ref}
          data-section="listDoctor"
        >
          Danh sách bác sĩ
        </h3>
      </Flex>

      <DataGrid<ResponseDoctor>
        columns={columns}
        data={listDoctors?.data ?? []}
        pagination={{
          current: Number(listDoctors?.current_page) ?? 1,
          pageSize: Number(listDoctors?.per_page) ?? 100,
          total: listDoctors?.total ?? 0,
          showSizeChanger: true,
          showTotal: (total) => `Tổng ${total} bản ghi`,
          position: ["bottomCenter"],
        }}
        maxHeight={{
          isMax: false,
          customScrollY: 400,
        }}
        rowKey="id"
        loading={isLoading}
      />
    </div>
  );
});

ListDoctor.displayName = "ListDoctor";
export default ListDoctor;
