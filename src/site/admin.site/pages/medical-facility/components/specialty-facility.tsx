import { Button as ButtonAnt, Flex } from "antd";
import { forwardRef, useRef } from "react";
import {
  HospitalScheduleModal,
  type HospitalScheduleRef,
} from "./modal/modal-schedule-facility";
import { DataGrid } from "@/components/data-table";
import type { ResponseDepartment } from "../../specialty/type";
import { MinusSquareOutlined, PlusSquareOutlined } from "@ant-design/icons";
import {
  useDeleteDepartment,
  useGetTreeDepartment,
} from "../../specialty/hooks/use-specialty";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { ColumnsType } from "antd/es/table";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Pen, Trash } from "lucide-react";
import type { ModalDepartmentRef } from "../../specialty/components/modal-department";
import ModalDepartment from "../../specialty/components/modal-department";
import { formatTreeData } from "../../specialty/specialty";
import { useSetAtom } from "jotai";
import { loadingAtom } from "@/stores/loading";

interface IProps {
  facilityId: number;
}

const SpecialtyFacility = forwardRef<HTMLDivElement, IProps>(
  ({ facilityId }, ref) => {
    const hospitalScheduleModalRef = useRef<HospitalScheduleRef>(null);
    const modelDepartmentRef = useRef<ModalDepartmentRef>(null);
    const { data: listSpecialty, isLoading } = useGetTreeDepartment(facilityId);

    const remove = useDeleteDepartment(Number(facilityId));
    const setLoading = useSetAtom(loadingAtom);

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
                <Button
                  variant="ghost"
                  className="h-9 w-9 p-0 cursor-pointer"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreHorizontal size={30} />
                </Button>
              </DropdownMenuTrigger>
            ) : (
              <div className="h-9 w-9"></div>
            )}
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  handleUpdate(record);
                }}
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
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(record.id ?? 0);
                }}
              >
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

    const handleAddNew = () => {
      modelDepartmentRef.current?.showModal({
        dataForm: null,
        dataTree: formatTreeData(listSpecialty?.data ?? []),
      });
    };

    return (
      <>
        <div className="bg-white rounded-md p-5.5">
          <Flex
            gap={10}
            align="center"
            justify="space-between"
            className="mb-5!"
          >
            <Flex gap={10} align="center">
              <div className="h-6 w-[5px] bg-[#9afaeb] rounded" />
              <h3
                className="text-xl font-semibold"
                ref={ref}
                data-section="specialtyFacility"
              >
                Chuyên khoa
              </h3>
            </Flex>
            <ButtonAnt type="primary" htmlType="submit" onClick={handleAddNew}>
              Thêm mới
            </ButtonAnt>
          </Flex>
          <DataGrid<ResponseDepartment>
            columns={columns}
            data={listSpecialty?.data ?? []}
            pagination={false}
            rowKey="id"
            loading={isLoading}
            maxHeight={{
              isMax: false,
              customScrollY: 400,
            }}
            onRow={(record) => ({
              onClick: () => {
                modelDepartmentRef.current?.showModal({
                  dataForm: record,
                  dataTree: formatTreeData(listSpecialty?.data ?? []),
                });
              },
            })}
            expandable={{
              defaultExpandAllRows: true,
              showExpandColumn: true,
              expandIcon: ({ expanded, onExpand, record }) =>
                record.children && record.children.length > 0 ? (
                  <span
                    style={{ cursor: "pointer", marginRight: 8 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onExpand(record, e);
                    }}
                  >
                    {expanded ? (
                      <MinusSquareOutlined />
                    ) : (
                      <PlusSquareOutlined />
                    )}
                  </span>
                ) : (
                  <span style={{ display: "inline-block", width: 16 }} />
                ),
            }}
            className="[&_.ant-table-cell]:py-0.5! [&_.ant-table-cell]:hover:underline [&_.ant-table-cell]:cursor-pointer [&_.ant-table-thead_.ant-table-cell]:py-3!"
            rowClassName={(record) => (!record.parentId ? "bg-[#f0f9ff]" : "")}
          />
          <ModalDepartment ref={modelDepartmentRef} facilityId={facilityId} />
        </div>
        <HospitalScheduleModal ref={hospitalScheduleModalRef} />
      </>
    );
  }
);

export default SpecialtyFacility;
