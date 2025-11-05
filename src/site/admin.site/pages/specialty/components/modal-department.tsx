import { forwardRef, useImperativeHandle, useState } from "react";
import { Form, Input, Modal, Button, TreeSelect } from "antd";
import { useForm, Controller } from "react-hook-form";
import { useAtom } from "jotai";
import { loadingAtom } from "@/stores/loading";
import type { ResponseDepartment } from "../type";
import {
  useCreateDepartment,
  useUpdateDepartment,
} from "../hooks/use-specialty";

export interface DepartmentFormValues {
  id?: number;
  name: string;
  description?: string;
  parentId?: number | null;
}

interface ModalDepartmentProps {
  dataForm?: ResponseDepartment | null;
  dataTree: ResponseDepartment[] | undefined;
  typeModel?: "create" | "update";
}

export interface ModalDepartmentRef {
  showModal: ({ dataForm, dataTree, typeModel }: ModalDepartmentProps) => void;
  hideModal: () => void;
}

const ModalDepartment = forwardRef<ModalDepartmentRef>((_, ref) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [treeData, setTreeData] = useState<ResponseDepartment[]>([]);
  const [loading, setLoading] = useAtom(loadingAtom);
  const create = useCreateDepartment({
    onSuccessCallback: () => {
      setLoading(false);
      hideModal();
    },
    onErrorCallback() {
      setLoading(false);
    },
  });
  const update = useUpdateDepartment({
    onSuccessCallback: () => {
      setLoading(false);
      hideModal();
    },
    onErrorCallback() {
      setLoading(false);
    },
  });
  const [typeModel, setTypeModel] = useState<"create" | "update">("create");

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<DepartmentFormValues>({
    defaultValues: { id: 0, name: "", description: "", parentId: null },
  });

  const showModal = ({ dataForm, dataTree }: ModalDepartmentProps) => {
    setTreeData(dataTree ?? []);
    if (dataForm) {
      setTypeModel("update");
      setValue("id", dataForm.id);
      setValue("name", dataForm.name);
      setValue("description", dataForm?.description ?? "");
      setValue("parentId", dataForm.parentId ?? null);
    } else {
      setTypeModel("create");
      reset();
    }
    setIsModalOpen(true);
  };

  const hideModal = () => {
    setIsModalOpen(false);
    reset();
  };

  useImperativeHandle(ref, () => ({
    showModal,
    hideModal,
  }));

  const onSubmit = (data: DepartmentFormValues) => {
    setLoading(true);
    if (typeModel === "create") {
      create.mutate(data);
    } else {
      update.mutate(data);
    }
  };

  return (
    <Modal
      title={
        typeModel === "create"
          ? "Thêm khoa / phòng ban"
          : "Cập nhật khoa / phòng ban"
      }
      open={isModalOpen}
      onCancel={hideModal}
      footer={null}
    >
      <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
        {/* Tên khoa / phòng ban */}
        <Form.Item
          label="Tên khoa / phòng ban"
          validateStatus={errors.name ? "error" : ""}
          help={errors.name?.message}
        >
          <Controller
            name="name"
            control={control}
            rules={{ required: "Tên khoa / phòng ban không được để trống" }}
            render={({ field }) => (
              <Input {...field} placeholder="Nhập tên khoa / phòng ban" />
            )}
          />
        </Form.Item>
        {/* ParentId (tùy chọn) */}
        <Form.Item label="Khoa / phòng ban cha (tùy chọn)">
          <Controller
            name="parentId"
            control={control}
            render={({ field }) => (
              <TreeSelect
                {...field}
                allowClear
                placeholder="Chọn khoa / phòng ban cha"
                treeDefaultExpandAll
                treeData={treeData} // bạn cần prepare treeData từ listDepartment
              />
            )}
          />
        </Form.Item>

        {/* Ghi chú */}
        <Form.Item
          label="Ghi chú"
          validateStatus={errors.description ? "error" : ""}
          help={errors.description?.message}
        >
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <Input.TextArea
                {...field}
                rows={3}
                placeholder="Nhập ghi chú (tùy chọn)"
              />
            )}
          />
        </Form.Item>

        {/* Footer buttons */}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
          <Button onClick={hideModal}>Hủy</Button>
          <Button type="primary" htmlType="submit" loading={loading}>
            Lưu
          </Button>
        </div>
      </Form>
    </Modal>
  );
});

export default ModalDepartment;
