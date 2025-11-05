import { forwardRef, useImperativeHandle, useState } from "react";
import { Form, Input, Modal, Button, message } from "antd";
import { useForm, Controller } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createAcademicTilte,
  updateAcademicTilte,
} from "../hooks/use-acdemic-title";
import { useAtom, useSetAtom } from "jotai";

import { loadingAtom } from "@/stores/loading";
import type { ResponseAcademicTitle } from "../type";
import { academicParamsAtom } from "../store/params";

export interface AcademicFormValues {
  id?: number;
  name: string;
  description?: string;
}

export interface ModalAcademicRef {
  showModal: (data?: ResponseAcademicTitle) => void;
  hideModal: () => void;
}

const ModalAcademic = forwardRef<ModalAcademicRef>((_, ref) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [param, setParam] = useAtom(academicParamsAtom);
  const setLoading = useSetAtom(loadingAtom);
  const queryClient = useQueryClient();
  const [typeModel, setTypeModel] = useState<"create" | "update">("create");

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<AcademicFormValues>({
    defaultValues: { id: 0, name: "", description: "" },
  });

  const showModal = (data: ResponseAcademicTitle | undefined) => {
    if (data) {
      setTypeModel("update");
      setValue("name", data.name);
      setValue("id", data.id);
      setValue("description", data.description);
    } else {
      setIsModalOpen(true);
      reset();
    }
  };
  const hideModal = () => {
    setIsModalOpen(false);
    reset();
  };

  // ✅ Mutation: gọi API tạo học vị
  const mutation = useMutation({
    mutationFn:
      typeModel === "create" ? createAcademicTilte : updateAcademicTilte,
    onSuccess: () => {
      messageApi.success(
        typeModel === "create"
          ? "Thêm học vị thành công!"
          : "Cập nhật học vị thành công!"
      );
      queryClient.refetchQueries({
        queryKey: [
          "listAcademicTitle",
          param.page,
          param.per_page,
          param.keyword,
        ],
        exact: true,
      });
      if (typeModel === "create") {
        setParam({
          ...param,
          page: 1,
        });
      }
      hideModal();
      setLoading(false);
    },
    onError: (err: any) => {
      setLoading(false);
      messageApi.error(err.response?.data?.message || "Có lỗi xảy ra!");
    },
  });

  // Cho phép component cha gọi hàm
  useImperativeHandle(ref, () => ({
    showModal,
    hideModal,
  }));

  const onSubmit = (data: AcademicFormValues) => {
    setLoading(true);
    mutation.mutate(data);
  };

  return (
    <>
      {contextHolder}
      <Modal
        title={typeModel === "create" ? "Thêm học vị" : "Cập nhật học vị"}
        open={isModalOpen}
        onCancel={hideModal}
        footer={null}
      >
        <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
          {/* Name */}
          <Form.Item
            label="Tên học vị"
            validateStatus={errors.name ? "error" : ""}
            help={errors.name?.message}
          >
            <Controller
              name="name"
              control={control}
              rules={{ required: "Tên học vị không được để trống" }}
              render={({ field }) => (
                <Input {...field} placeholder="Nhập tên học vị" />
              )}
            />
          </Form.Item>

          {/* Desc */}
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
            <Button
              type="primary"
              htmlType="submit"
              loading={mutation.isPending}
            >
              Lưu
            </Button>
          </div>
        </Form>
      </Modal>
    </>
  );
});

export default ModalAcademic;
