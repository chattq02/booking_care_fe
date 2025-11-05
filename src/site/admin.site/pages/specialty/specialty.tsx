import {
  useDeleteDepartment,
  useGetTreeDepartment,
} from "./hooks/use-specialty";
import type { ColumnsType } from "antd/es/table";
import { useMemo, useRef } from "react";
import { DataGrid } from "@/components/data-table";
import type { ResponseDepartment } from "./type";
import {
  MinusSquareOutlined,
  PlusOutlined,
  PlusSquareOutlined,
} from "@ant-design/icons";
import { MoreHorizontal, Pen, Trash } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Button as ButtonAnt, Flex } from "antd";
import ModalDepartment, {
  type ModalDepartmentRef,
} from "./components/modal-department";
import { loadingAtom } from "@/stores/loading";
import { useSetAtom } from "jotai";

export default function Specialty() {
  const modelDepartmentRef = useRef<ModalDepartmentRef>(null);
  const { data: listSpecialty, isLoading } = useGetTreeDepartment();
  const setLoading = useSetAtom(loadingAtom);
  const remove = useDeleteDepartment();
  const formatTreeData = (nodes: ResponseDepartment[]): any[] =>
    nodes.map((node) => ({
      title: node.name,
      value: node.id,
      key: node.id,
      children: node.children?.length
        ? formatTreeData(node.children)
        : undefined,
    }));

  const handleDelete = (id: number) => {
    setLoading(true);
    remove.mutate(id);
  };
  const handleUpdate = (recod: ResponseDepartment) => {
    modelDepartmentRef.current?.showModal({
      dataForm: recod,
      dataTree: formatTreeData(listSpecialty?.data ?? []),
      typeModel: "update",
    });
  };

  const columns: ColumnsType<ResponseDepartment> = [
    {
      title: "Tên khoa",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Ghi chú",
      dataIndex: "description",
      key: "description",
    },
    {
      width: 80,
      fixed: "right",
      align: "center",
      title: "",
      key: "action",
      render: (_, record: ResponseDepartment) => (
        <DropdownMenu>
          {record.children?.length === 0 ? (
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-9 w-9 p-0 cursor-pointer">
                <MoreHorizontal size={30} />
              </Button>
            </DropdownMenuTrigger>
          ) : (
            <div className="h-9 w-9"></div>
          )}
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handleUpdate(record)}>
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

  const expandedKeys = useMemo(() => {
    const getKeys = (nodes: ResponseDepartment[]): React.Key[] => {
      return nodes
        .flatMap((node) => [
          node.id, // có thể undefined
          ...(node.children ? getKeys(node.children) : []),
        ])
        .filter((key): key is React.Key => key !== undefined); // loại bỏ undefined
    };
    return getKeys(listSpecialty?.data ?? []);
  }, [listSpecialty?.data]);

  const handleAddNew = () => {
    modelDepartmentRef.current?.showModal({
      dataForm: null,
      dataTree: formatTreeData(listSpecialty?.data ?? []),
    });
  };

  return (
    <div style={{ padding: "15px 20px" }}>
      <Flex style={{ marginBottom: 12 }} gap={14} justify="space-between" wrap>
        <ButtonAnt
          icon={<PlusOutlined />}
          type="primary"
          onClick={handleAddNew}
        >
          Thêm mới
        </ButtonAnt>
      </Flex>
      <DataGrid<ResponseDepartment>
        columns={columns}
        data={listSpecialty?.data ?? []}
        pagination={false}
        rowKey="id"
        loading={isLoading}
        customHeight={190}
        expandable={{
          expandedRowKeys: expandedKeys,
          defaultExpandAllRows: true,
          showExpandColumn: true,
          expandIcon: ({ expanded, onExpand, record }) =>
            record.children && record.children.length > 0 ? (
              <span
                style={{ cursor: "pointer", marginRight: 8 }}
                onClick={(e) => onExpand(record, e)}
              >
                {expanded ? <MinusSquareOutlined /> : <PlusSquareOutlined />}
              </span>
            ) : (
              <span style={{ display: "inline-block", width: 16 }} />
            ),
        }}
        className="[&_.ant-table-cell]:py-0.5! [&_.ant-table-thead_.ant-table-cell]:py-3!"
        rowClassName={(record) => (!record.parentId ? "bg-[#f0f9ff]" : "")}
      />
      <ModalDepartment ref={modelDepartmentRef} />
    </div>
  );
}
