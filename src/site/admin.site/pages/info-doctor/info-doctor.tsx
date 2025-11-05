import { useRef, useState } from "react";
import { Button, Input, Select, Modal, Form, Tag, Flex } from "antd";
import {
  UploadOutlined,
  PlusOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { getListDoctor } from "./hooks/use-get-list-doctor";
import type { ResponseDoctor } from "../../types/doctor";
import type { ColumnsType } from "antd/es/table";
import type { UserStatus } from "@/types/auth";
import { DataGrid } from "@/components/data-table";
import { MoreHorizontal, Trash } from "lucide-react";
import ModalUpload, { type ModalUploadRef } from "@/components/modal-upload";
import SearchBox from "./components/search-box";
import { doctorParamsAtom } from "./stores/params";
import { useAtom } from "jotai";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button as ButtonUI } from "@/components/ui/button";

export default function InfoDoctor() {
  const modalRef = useRef<ModalUploadRef>(null);
  const [param, setParam] = useAtom(doctorParamsAtom);

  const { data: listDoctor, isLoading } = useQuery({
    queryKey: [
      "listDoctor",
      param.page,
      param.per_page,
      param.status,
      param.keyword,
    ],
    queryFn: async () =>
      await getListDoctor({
        keyword: param.keyword.trim(),
        page: param.page,
        per_page: param.per_page,
        status: param.status,
      }),
    placeholderData: (pre) => {
      return pre;
    },
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  // Import Excel
  const handleImport = () => {
    modalRef.current?.showModal();
  };

  // Thêm mới
  const handleAdd = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

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
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "CCCD",
      dataIndex: "cccd",
      key: "cccd",
    },
    {
      title: "Điện thoại",
      dataIndex: "phone",
      key: "phone",
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

  const rowSelection = {
    onChange: (
      selectedRowKeys: React.Key[],
      selectedRows: ResponseDoctor[]
    ) => {
      console.log(
        `selectedRowKeys: ${selectedRowKeys}`,
        "selectedRows: ",
        selectedRows
      );
    },
  };

  const handleTableChange = (pagination: any) => {
    setParam({
      ...param,
      page: pagination.current,
      per_page: pagination.pageSize,
    });
  };

  return (
    <div style={{ padding: "15px 20px" }}>
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
            onClick={() => setIsModalOpen(true)}
          >
            Thêm mới
          </Button>
          <Button
            icon={<Trash size={15} className="mt-1" />}
            color="danger"
            variant="outlined"
            onClick={() => setIsModalOpen(true)}
          >
            Xóa
          </Button>
          <Button type="default" icon={<DownloadOutlined />} onClick={() => {}}>
            Export excel
          </Button>
          <Button icon={<UploadOutlined />} onClick={handleImport}>
            Import Excel
          </Button>
        </Flex>
      </Flex>

      <DataGrid<ResponseDoctor>
        columns={columns}
        data={listDoctor?.data ?? []}
        pagination={{
          current: Number(listDoctor?.current_page) ?? 1,
          pageSize: Number(listDoctor?.per_page) ?? 100,
          total: listDoctor?.total ?? 0,
          showSizeChanger: true,
          showTotal: (total) => `Tổng ${total} bản ghi`,
          position: ["bottomCenter"],
        }}
        rowKey="id"
        rowSelection={{
          type: "checkbox",
          fixed: true,
          columnWidth: 40,
          ...rowSelection,
        }}
        loading={isLoading}
        onChange={handleTableChange}
      />

      <ModalUpload ref={modalRef} />

      <Modal
        title="Thêm mới người dùng"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleAdd}>
          <Form.Item
            name="name"
            label="Tên"
            rules={[{ required: true, message: "Nhập tên!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="age"
            label="Tuổi"
            rules={[{ required: true, message: "Nhập tuổi!" }]}
          >
            <Input type="number" />
          </Form.Item>

          <Form.Item>
            <Button htmlType="submit" type="primary" block>
              Thêm
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
