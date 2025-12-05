import { useCallback, useState } from "react";
import {
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  Popconfirm,
  Flex,
} from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import type {
  ICreateMedicineDto,
  IMedicine,
  IUpdateMedicineDto,
} from "../../type";
import {
  useCreateMedicine,
  useDeleteMedicine,
  useGetListMedicine,
  useUpdateMedicine,
} from "../../hooks/use-medicine";
import SearchBox from "../../../info-doctor/components/search-box";
import { DataGrid } from "@/components/data-table";
import type { MedicineParams } from "../../store/params";

interface IProps {
  facilityId: number;
}

export default function Medicine({ facilityId }: IProps) {
  const [params, setParams] = useState<MedicineParams>({
    keyword: "",
    page: 1,
    per_page: 50,
    facilityId,
  });
  const [openModal, setOpenModal] = useState(false);
  const [editing, setEditing] = useState<IMedicine | null>(null);

  const [form] = Form.useForm();

  // 🔹 Fetch list
  const { data, isLoading } = useGetListMedicine(params);

  const createMutation = useCreateMedicine({
    onSuccessCallback: () => {
      setOpenModal(false);
      form.resetFields();
    },
  });

  const updateMutation = useUpdateMedicine({
    onSuccessCallback: () => {
      setOpenModal(false);
      form.resetFields();
      setEditing(null);
    },
  });

  const deleteMutation = useDeleteMedicine();

  // -------------------------------------------------------
  // 🟢 Handle submit
  // -------------------------------------------------------
  const handleSubmit = () => {
    form.validateFields().then((values) => {
      if (editing) {
        const payload: IUpdateMedicineDto = {
          ...values,
          id: editing.id,
          facilityId,
        };
        updateMutation.mutate(payload);
      } else {
        const payload: ICreateMedicineDto = { ...values, facilityId };
        createMutation.mutate(payload);
      }
    });
  };

  // -------------------------------------------------------
  // 🟡 Columns table
  // -------------------------------------------------------
  const columns = [
    {
      title: "Tên thuốc",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Nhà sản xuất",
      dataIndex: "manufacturer",
      key: "manufacturer",
    },
    {
      title: "Đơn vị",
      dataIndex: "unit",
      key: "unit",
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      render: (val: number) => (val ? `${val?.toLocaleString()} đ` : 0),
    },
    {
      title: "Tồn kho",
      dataIndex: "stock",
      key: "stock",
      render: (val: number) => (val ? val?.toLocaleString() : 0),
    },

    {
      title: "Hành động",
      key: "actions",
      width: 120,
      render: (_: any, record: IMedicine) => (
        <div className="flex gap-2">
          <Button
            icon={<EditOutlined />}
            size="small"
            onClick={() => {
              setEditing(record);
              form.setFieldsValue(record);
              setOpenModal(true);
            }}
          />
          <Popconfirm
            title="Xóa thuốc?"
            okText="Xóa"
            cancelText="Huỷ"
            onConfirm={() => deleteMutation.mutate(record.id)}
          >
            <Button icon={<DeleteOutlined />} size="small" danger />
          </Popconfirm>
        </div>
      ),
    },
  ];

  const handleTableChange = useCallback(
    (pagination: any) => {
      setParams({
        ...params,
        page: pagination.current,
        per_page: pagination.pageSize,
      });
    },
    [params, setParams]
  );

  return (
    <div className="bg-white rounded-md p-5.5">
      <Flex gap={10} align="center" className="mb-5!">
        <div className="h-6 w-[5px] bg-[#9afaeb] rounded" />
        <h3 className="text-xl font-semibold" data-section="listDoctor">
          Danh sách thuốc
        </h3>
      </Flex>
      <Flex style={{ marginBottom: 12 }} gap={14} justify="space-between" wrap>
        <Flex gap={14}>
          <SearchBox
            value={params.keyword}
            onSearch={(value) => {
              setParams({
                ...params,
                keyword: value,
                page: 1,
              });
            }}
          />
        </Flex>
        <Flex gap={14}>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setEditing(null);
              form.resetFields();
              setOpenModal(true);
            }}
          >
            Thêm thuốc
          </Button>
        </Flex>
      </Flex>

      <DataGrid<IMedicine>
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
        onChange={handleTableChange}
        maxHeight={{
          isMax: false,
          customScrollY: 500,
        }}
        rowKey="id"
        loading={isLoading}
      />

      {/* ---------------------------------------------------
       *  🟦 Modal Add / Edit
       --------------------------------------------------- */}
      <Modal
        title={editing ? "Cập nhật thuốc" : "Thêm thuốc"}
        open={openModal}
        onCancel={() => setOpenModal(false)}
        cancelText={"Hủy"}
        onOk={handleSubmit}
        confirmLoading={createMutation.isPending || updateMutation.isPending}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Tên thuốc"
            name="name"
            rules={[{ required: true, message: "Nhập tên thuốc" }]}
          >
            <Input placeholder="Ví dụ: Paracetamol" />
          </Form.Item>

          <Form.Item
            label="Nhà sản xuất"
            name="manufacturer"
            rules={[{ required: true, message: "Nhập nhà sản xuất" }]}
          >
            <Input placeholder="Ví dụ: DH Pharma" />
          </Form.Item>

          <Form.Item
            label="Đơn vị"
            name="unit"
            rules={[{ required: true, message: "Nhập đơn vị" }]}
          >
            <Input placeholder="Ví dụ: viên, hộp" />
          </Form.Item>
          <Form.Item
            label="Số lượng"
            name="stock"
            rules={[{ required: true, message: "Nhập số lượng" }]}
            className="w-full"
          >
            <InputNumber
              style={{ width: "100%" }}
              placeholder="0"
              min={1}
              formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            />
          </Form.Item>
          <Form.Item
            label="Giá"
            name="price"
            rules={[{ required: true, message: "Nhập giá" }]}
            className="w-full"
          >
            <InputNumber
              style={{ width: "100%" }}
              placeholder="0"
              min={0}
              formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
