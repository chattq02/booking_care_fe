import { DataGrid } from "@/components/data-table";
import { useAtom, useSetAtom } from "jotai";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import { Flex, message, Select, Tag } from "antd";
import SearchBox from "../info-doctor/components/search-box";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Button as ButtonAnt } from "antd";
import { MoreHorizontal, Pen, Trash } from "lucide-react";
import { PlusOutlined } from "@ant-design/icons";
import React, { memo, useCallback, useMemo } from "react";
import { loadingAtom } from "@/stores/loading";
import type { ResponseMedicalFacility } from "./type";
import { medicalFacilitiesParamsAtom } from "./store/params";
import { useGetListMedicalFacility } from "./hooks/use-medical-facility";
import {
  Avatar as AvatarUI,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import { PATH_ROUTE_ADMIN } from "../../libs/enums/path";

// 🔥 Tách ActionCell ra ngoài để tránh re-render không cần thiết
const ActionCell = React.memo(
  ({
    record,
    onDelete,
  }: {
    record: ResponseMedicalFacility;
    onDelete: (id: number) => void;
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
          <ButtonAnt icon={<Pen size={15} className="mt-1" />}>
            Chỉnh sửa
          </ButtonAnt>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onDelete(record.id ?? 0)}>
          <ButtonAnt
            icon={<Trash size={15} className="mt-1" />}
            className="w-full"
            danger
          >
            Xóa
          </ButtonAnt>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
);

// 🔥 Tách StatusTag ra ngoài
const StatusTag = memo(({ isActive }: { isActive: string }) =>
  isActive === "Active" ? (
    <Tag color="success">Hoạt động</Tag>
  ) : (
    <Tag color="error">Tạm ngừng</Tag>
  )
);

// 🔥 Tách AvatarWithName ra ngoài
const AvatarWithName = memo(
  ({ record, text }: { record: ResponseMedicalFacility; text: string }) => (
    <Flex align="center" gap={8}>
      <AvatarUI>
        <AvatarImage src={record.imageUrl || ""} alt={text} />
        <AvatarFallback>CN</AvatarFallback>
      </AvatarUI>
      <div style={{ whiteSpace: "pre-wrap" }}>{text}</div>
    </Flex>
  )
);

export default function MedicalFacility() {
  const [param, setParam] = useAtom(medicalFacilitiesParamsAtom);
  const [messageApi, contextHolder] = message.useMessage();
  const { data: listMedical, isLoading } = useGetListMedicalFacility(param);
  const setLoading = useSetAtom(loadingAtom);
  const nav = useNavigate();

  // 🔥 Tối ưu: sử dụng useCallback để tránh re-create function
  const handleDelete = useCallback(
    (id: number) => {
      setLoading(true);
      // mutation.mutate(id);
    },
    [setLoading]
  );

  // 🔥 Tối ưu columns với dependencies tối thiểu
  const columns = useMemo<ColumnsType<ResponseMedicalFacility>>(
    () => [
      {
        title: "Id",
        width: 80,
        dataIndex: "id",
        key: "id",
        align: "center",
      },
      {
        title: "Tên cơ sở",
        dataIndex: "name",
        key: "name",
        render: (text, record) => (
          <AvatarWithName record={record} text={text} />
        ),
      },
      {
        title: "Mã cơ sở",
        dataIndex: "code",
        key: "code",
      },
      {
        title: "Email",
        dataIndex: "email",
        key: "email",
      },
      {
        title: "Phone",
        dataIndex: "phone",
        key: "phone",
      },
      {
        title: "Địa chỉ",
        dataIndex: "address",
        key: "address",
      },
      {
        width: 140,
        align: "center",
        title: "Trạng thái",
        dataIndex: "isActive",
        key: "isActive",
        render: (text) => <StatusTag isActive={text} />,
      },
      {
        width: 80,
        fixed: "right",
        align: "center",
        title: "",
        key: "action",
        render: (_, record) => (
          <ActionCell record={record} onDelete={handleDelete} />
        ),
      },
    ],
    [handleDelete]
  );

  // 🔥 Tối ưu: debounce handleTableChange
  const handleTableChange = useCallback(
    (pagination: any) => {
      setParam({
        ...param,
        page: pagination.current,
        per_page: pagination.pageSize,
      });
    },
    [param, setParam]
  );

  // 🔥 Tối ưu: memoize table data
  const tableData = useMemo(() => listMedical?.data ?? [], [listMedical?.data]);

  const paginationConfig: TablePaginationConfig = useMemo(
    () => ({
      current: Number(listMedical?.current_page) ?? 1,
      pageSize: Number(listMedical?.per_page) ?? 100,
      total: listMedical?.total ?? 0,
      showSizeChanger: true,
      showTotal: (total: number) => `Tổng ${total} bản ghi`,
      position: ["bottomCenter"] as const,
      pageSizeOptions: ["50", "100", "200"], // Giảm số lượng records nếu cần
    }),
    [listMedical]
  );

  return (
    <div style={{ padding: "15px 20px" }}>
      {contextHolder}
      <Flex style={{ marginBottom: 12 }} gap={14} justify="space-between" wrap>
        <Flex gap={14}>
          <SearchBox
            width={350}
            placeholder="Tìm kiếm..."
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
              { value: "Active", label: "Đang hoạt động" },
              { value: "InActive", label: "Tạm ngừng" },
            ]}
          />
        </Flex>

        <ButtonAnt
          icon={<PlusOutlined />}
          type="primary"
          // onClick={() => modelAcademicRef.current?.showModal()}
        >
          Thêm mới
        </ButtonAnt>
      </Flex>

      <DataGrid<ResponseMedicalFacility>
        columns={columns}
        data={tableData}
        pagination={paginationConfig}
        loading={isLoading}
        onChange={handleTableChange}
        className="[&_.ant-table-cell]:py-0.5! [&_.ant-table-cell]:hover:underline [&_.ant-table-cell]:cursor-pointer [&_.ant-table-thead_.ant-table-cell]:py-3!"
        onRow={(record) => ({
          onClick: () => {
            nav(
              `${PATH_ROUTE_ADMIN.MEDICAL_FACILITY}/${record.id}/${record.name}`
            );
          },
        })}
      />
    </div>
  );
}
