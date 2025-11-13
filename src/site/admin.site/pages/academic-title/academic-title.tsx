import { DataGrid } from "@/components/data-table";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  deleteAcademicTilte,
  getListAcademicTilte,
} from "./hooks/use-acdemic-title";

import { useAtom, useSetAtom } from "jotai";
import type { ResponseAcademicTitle } from "./type";
import type { ColumnsType } from "antd/es/table";
import { Flex, message } from "antd";
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
import ModalAcademic, {
  type ModalAcademicRef,
} from "./components/modal-academic";
import { useMemo, useRef } from "react";
import { loadingAtom } from "@/stores/loading";
import { academicParamsAtom } from "./store/params";
import { stringify } from "qs";

export default function AcademicTitle() {
  const [param, setParam] = useAtom(academicParamsAtom);
  const modelAcademicRef = useRef<ModalAcademicRef>(null);
  const [messageApi, contextHolder] = message.useMessage();
  const setLoading = useSetAtom(loadingAtom);

  const key = useMemo(() => stringify(param), [param]);

  const {
    data: listAcademicTitle,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["listAcademicTitle", key],
    queryFn: async () =>
      await getListAcademicTilte({
        keyword: param.keyword,
        page: param.page,
        per_page: param.per_page,
      }),
    placeholderData: (pre) => {
      return pre;
    },
  });

  const mutation = useMutation({
    mutationFn: deleteAcademicTilte,
    onSuccess: () => {
      messageApi.success("Xóa vị thành công!");
      refetch();
      setLoading(false);
    },
    onError: (err: any) => {
      messageApi.error(err.response?.data?.message || "Có lỗi xảy ra!");
    },
  });

  const handleDelete = (id: number) => {
    setLoading(true);
    mutation.mutate(id);
  };

  const columns: ColumnsType<ResponseAcademicTitle> = [
    {
      title: "Id",
      width: 80,
      dataIndex: "id",
      key: "id",
      align: "center",
    },
    {
      title: "Tên",
      dataIndex: "name",
      key: "name",
      render: (text) => <div style={{ whiteSpace: "pre-wrap" }}>{text}</div>,
    },
    {
      title: "Ghi chú",
      dataIndex: "description",
      key: "description",
      render: (text) => <div style={{ whiteSpace: "pre-wrap" }}>{text}</div>,
    },
    {
      width: 80,
      fixed: "right",
      align: "center",
      title: "",
      key: "action",
      render: (_, record: ResponseAcademicTitle) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-9 w-9 p-0 cursor-pointer">
              <MoreHorizontal size={30} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => modelAcademicRef.current?.showModal(record)}
            >
              <ButtonAnt
                icon={<Pen size={15} className="mt-1" />}
                color="primary"
                variant="solid"
                className="w-full"
              >
                Chỉnh sửa
              </ButtonAnt>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleDelete(record.id ?? 0)}>
              <ButtonAnt
                icon={<Trash size={15} className="mt-1" />}
                color="danger"
                variant="outlined"
                className="w-full"
              >
                Xóa
              </ButtonAnt>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
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
          onClick={() => modelAcademicRef.current?.showModal()}
        >
          Thêm mới
        </ButtonAnt>
      </Flex>
      <DataGrid<ResponseAcademicTitle>
        columns={columns}
        data={listAcademicTitle?.data ?? []}
        pagination={{
          current: Number(listAcademicTitle?.current_page) ?? 1,
          pageSize: Number(listAcademicTitle?.per_page) ?? 100,
          total: listAcademicTitle?.total ?? 0,
          showSizeChanger: true,
          showTotal: (total) => `Tổng ${total} bản ghi`,
          position: ["bottomCenter"],
        }}
        rowKey="id"
        loading={isLoading}
        onChange={handleTableChange}
        className="[&_.ant-table-cell]:py-0.5! [&_.ant-table-thead_.ant-table-cell]:py-3!"
      />
      <ModalAcademic ref={modelAcademicRef} />
    </div>
  );
}
