import { forwardRef, useImperativeHandle, useState } from "react";
import {
  Form,
  Input,
  Modal,
  Button,
  TreeSelect,
  Upload,
  type UploadFile,
} from "antd";
import { useForm, Controller } from "react-hook-form";
import { useAtom } from "jotai";
import { loadingAtom } from "@/stores/loading";
import type { ResponseDepartment } from "../type";
import {
  useCreateDepartment,
  useUpdateDepartment,
} from "../hooks/use-specialty";
import { UploadOutlined } from "@ant-design/icons";
import fileApi from "@/apis/upload.api";

export interface DepartmentFormValues {
  id?: number;
  name: string;
  description?: string;
  parentId?: number | null;
  imageUrl?: string | null | File;
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
  const [fileList, setFileList] = useState<UploadFile[]>([]);
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
    defaultValues: {
      id: 0,
      name: "",
      description: "",
      parentId: null,
      imageUrl: "",
    },
  });

  const showModal = ({ dataForm, dataTree }: ModalDepartmentProps) => {
    setTreeData(dataTree ?? []);
    if (dataForm) {
      if (dataForm?.imageUrl) {
        setFileList([
          {
            uid: "-1",
            name: "image.png",
            status: "done",
            url: dataForm.imageUrl,
          },
        ]);
        setValue("imageUrl", dataForm.imageUrl);
      } else {
        setFileList([]);
        setValue("imageUrl", null);
      }
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

  const onSubmit = async (data: DepartmentFormValues) => {
    setLoading(true);

    let imageUrl = typeof data.imageUrl === "string" ? data.imageUrl : null;

    if (
      data.imageUrl &&
      typeof data.imageUrl !== "string" &&
      data.imageUrl instanceof File
    ) {
      const res = await fileApi.upload(data.imageUrl);
      imageUrl = res.data.FileUrl;
    }

    const payload = { ...data, imageUrl };

    if (typeModel === "create") {
      create.mutate(payload);
    } else {
      update.mutate(payload);
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
          required
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
                value={field.value ?? undefined}
                onChange={(value) => field.onChange(value ?? null)}
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
        <Form.Item label="Ảnh khoa / phòng ban">
          <Controller
            name="imageUrl"
            control={control}
            render={({ field }) => (
              <Upload
                name="file"
                fileList={fileList}
                listType="picture-card"
                multiple={false}
                maxCount={1}
                beforeUpload={() => false} // ngăn upload tự động của antd
                onChange={({ fileList: newFileList }) => {
                  setFileList(newFileList);
                  if (newFileList.length > 0) {
                    const file = newFileList[0];
                    if (file.originFileObj) {
                      // chỉ lưu tạm file local (chưa upload)
                      field.onChange(file.originFileObj);
                    }
                  } else {
                    field.onChange(null);
                  }
                }}
                onRemove={() => {
                  field.onChange(null);
                  setFileList([]);
                }}
              >
                {fileList.length >= 1 ? null : (
                  <div>
                    <UploadOutlined />
                    <div style={{ marginTop: 8 }}>Tải ảnh lên</div>
                  </div>
                )}
              </Upload>
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
