import { DataGrid } from "@/components/data-table";
import { useMutation, useQuery } from "@tanstack/react-query";


import { useAtom, useSetAtom } from "jotai";

import type { ColumnsType } from "antd/es/table";
import { Avatar, Flex, message, Tag } from "antd";
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

import React, { useCallback, useMemo, useRef } from "react";
import { loadingAtom } from "@/stores/loading";
import type { ResponseMedicalFacility } from "./type";
import { medicalFacilitiesParamsAtom } from "./store/params";
import { useGetListMedicalFacility } from "./hooks/use-medical-facility";
import { Avatar as AvatarUI, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { academicParamsAtom } from "./store/params";

export default function MedicalFacility() {
  const [param, setParam] = useAtom(medicalFacilitiesParamsAtom);
  // const modelAcademicRef = useRef<ModalAcademicRef>(null);
  const [messageApi, contextHolder] = message.useMessage();
  const { data: listMedical, isLoading } = useGetListMedicalFacility(param);
  const setLoading = useSetAtom(loadingAtom);

  const handleDelete = useCallback((id: number) => {
    setLoading(true);
    // mutation.mutate(id);
  }, [setLoading]);

  const ActionCell = React.memo(({ record, onDelete }: { record: ResponseMedicalFacility; onDelete: (id: number) => void }) => (
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
          <ButtonAnt icon={<Pen size={15} className="mt-1" />}>Chỉnh sửa</ButtonAnt>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onDelete(record.id ?? 0)}>
          <ButtonAnt icon={<Trash size={15} className="mt-1" />} danger>Xóa</ButtonAnt>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ));



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
          <Flex align="center" gap={8}>
            {/* <AvatarUI>
              <AvatarImage src={record.imageUrl || ""} alt={text} />
              <AvatarFallback>CN</AvatarFallback>
            </AvatarUI> */}
            <div style={{ whiteSpace: "pre-wrap" }}>{text}</div>
          </Flex>
        ),
      },
      {
        title: "Mã cơ sở",
        dataIndex: "code",
        key: "code",
        render: (text) => <div style={{ whiteSpace: "pre-wrap" }}>{text}</div>,
      },
      {
        title: "Email",
        dataIndex: "email",
        key: "email",
        render: (text) => <div style={{ whiteSpace: "pre-wrap" }}>{text}</div>,
      },
      {
        title: "Phone",
        dataIndex: "phone",
        key: "phone",
        render: (text) => <div style={{ whiteSpace: "pre-wrap" }}>{text}</div>,
      },
      {
        title: "Địa chỉ",
        dataIndex: "address",
        key: "address",
        render: (text) => <div style={{ whiteSpace: "pre-wrap" }}>{text}</div>,
      },
      {
        width: 140,
        align: "center",
        title: "Trạng thái",
        dataIndex: "isActive",
        key: "isActive",
        render: (text) =>
          text === "Active" ? (
            <Tag color="success">Hoạt động</Tag>
          ) : (
            <Tag color="error">Tạm ngừng</Tag>
          ),
      },
      {
        width: 80,
        // fixed: "right",
        align: "center",
        title: "",
        key: "action",
        render: (_, record) => <ActionCell record={record} onDelete={handleDelete} />,
      },
    ],
    [handleDelete] // 🔹 chỉ re-tạo khi handleDelete thay đổi
  );

  const handleTableChange = (pagination: any) => {
    setParam({
      ...param,
      page: pagination.current,
      per_page: pagination.pageSize,
    });
  };


  return (
    <div style={{ padding: "15px 20px" }}>
      {contextHolder}
      <Flex style={{ marginBottom: 12 }} gap={14} justify="space-between" wrap>
        <SearchBox
          width={350}
          placeholder="Nhập tên chức danh"
          value={param.keyword}
          onSearch={(value) => {
            setParam({
              ...param,
              keyword: value,
              page: 1,
            });
          }}
        />

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
        data={listMedical?.data ?? []}
        pagination={{
          current: Number(listMedical?.current_page) ?? 1,
          pageSize: Number(listMedical?.per_page) ?? 100,
          total: listMedical?.total ?? 0,
          showSizeChanger: true,
          showTotal: (total) => `Tổng ${total} bản ghi`,
          position: ["bottomCenter"],
        }}
        loading={isLoading}
        onChange={handleTableChange}
        className="[&_.ant-table-cell]:py-0.5! [&_.ant-table-thead_.ant-table-cell]:py-3!"
      />
      {/* <ModalAcademic ref={modelAcademicRef} /> */}
    </div>
  );
}
