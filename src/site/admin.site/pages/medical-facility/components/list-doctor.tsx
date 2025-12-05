import { DataGrid } from "@/components/data-table";
import type { ResponseDoctor } from "@/site/admin.site/types/doctor";
import { Button, Flex, Select, Tag } from "antd";
import { forwardRef, useRef, useState } from "react";
import { useGetListDoctorMedicalFacility } from "../hooks/use-medical-facility";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { ColumnsType } from "antd/es/table";
import type { UserStatus } from "@/types/auth";
import { Button as ButtonUI } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { PlusOutlined } from "@ant-design/icons";
import SearchBox from "../../info-doctor/components/search-box";
import type { IDoctorParams } from "../../info-doctor/type";
import AddDoctorModal, {
  type AddDoctorModalRef,
} from "./modal/add-doctor-modal";

interface IProps {
  facilityId: number;
}

const ListDoctor = forwardRef<HTMLDivElement, IProps>(({ facilityId }, ref) => {
  const modalRef = useRef<AddDoctorModalRef>(null);
  const [param, setParam] = useState<IDoctorParams>({
    keyword: "",
    status: "All",
    page: 1,
    per_page: 50,
  });
  const {
    data: listDoctors,
    isLoading,
    refetch,
  } = useGetListDoctorMedicalFacility({
    id: Number(facilityId),
    keyword: param.keyword ?? "",
    page: 1,
    per_page: 50,
    status: param.status,
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
            <DropdownMenuItem
              className="hover:bg-gray-100 cursor-pointer"
              onClick={() => console.log("record", record)}
            >
              Xem lịch hẹn
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
      <Flex style={{ marginBottom: 12 }} gap={14} justify="space-between" wrap>
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
              { value: "All", label: "Tất cả" },
              { value: "Active", label: "Đang hoạt động" },
              { value: "Pending", label: "Chưa verify" },
              { value: "Banned", label: "Bị khóa" },
            ]}
          />
        </Flex>
        <Flex gap={14}>
          <Button
            icon={<PlusOutlined />}
            type="primary"
            onClick={() => modalRef.current?.open()}
          >
            Thêm mới
          </Button>
        </Flex>
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

      <AddDoctorModal
        ref={modalRef}
        facilityId={Number(facilityId)}
        refetch={refetch}
      />
    </div>
  );
});

ListDoctor.displayName = "ListDoctor";
export default ListDoctor;
