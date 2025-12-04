import { useState } from "react";
import {
  Button,
  Table,
  Modal,
  Form,
  Input,
  InputNumber,
  Popconfirm,
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

interface IProps {
  facilityId: number;
}

export default function Medicine({ facilityId }: IProps) {
  const [params, setParams] = useState({ page: 1, per_page: 10 });
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
      render: (val: number) => `${val.toLocaleString()} đ`,
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

  return (
    <div className="bg-white rounded-md p-5.5">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Danh sách thuốc</h2>

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
      </div>

      <Table
        loading={isLoading}
        rowKey="id"
        dataSource={data?.data || []}
        columns={columns}
        pagination={{
          current: params.page,
          pageSize: params.per_page,
          total: data?.total || 0,
          onChange: (page, per_page) => setParams({ page, per_page }),
        }}
      />

      {/* ---------------------------------------------------
       *  🟦 Modal Add / Edit
       --------------------------------------------------- */}
      <Modal
        title={editing ? "Cập nhật thuốc" : "Thêm thuốc"}
        open={openModal}
        onCancel={() => setOpenModal(false)}
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
            label="Giá"
            name="price"
            rules={[{ required: true, message: "Nhập giá" }]}
          >
            <InputNumber
              className="w-full"
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
