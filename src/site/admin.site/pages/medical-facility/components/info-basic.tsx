import { forwardRef, useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Form, Input, Button, Flex, Avatar, Switch, Spin, Modal } from "antd";
import TextArea from "antd/es/input/TextArea";
import SunEditor from "suneditor-react";
import "suneditor/dist/css/suneditor.min.css";
import {
  useCreateMedicalFacility,
  useDeleteMedicalFacility,
  useGetMedicalFacilityDetail,
  useUpdateMedicalFacility,
} from "../hooks/use-medical-facility";
import type { ResponseMedicalFacility, TActive } from "../type";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { PATH_ROUTE_ADMIN } from "@/site/admin.site/libs/enums/path";
import { ExclamationCircleFilled } from "@ant-design/icons";

interface InfoBasicProps {
  facilityId: number;
}

const InfoBasic = forwardRef<HTMLDivElement, InfoBasicProps>(
  ({ facilityId }, ref) => {
    const hasfacilityId = Boolean(facilityId);
    const [modal, modalElement] = Modal.useModal();
    const { data, isLoading } = useGetMedicalFacilityDetail(
      Number(facilityId),
      hasfacilityId
    );

    const nav = useNavigate();

    const [isActive, setIsActive] = useState<TActive>("Active");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { mutate: create, isPending: isPendingCreate } =
      useCreateMedicalFacility();

    const { mutate, isPending } = useUpdateMedicalFacility();

    const { mutate: deleteFacility, isPending: isPendingDelete } =
      useDeleteMedicalFacility();

    // 1. luôn gọi useForm — không condition
    const { control, handleSubmit, reset, watch, formState } =
      useForm<ResponseMedicalFacility>({
        defaultValues: {
          name: "",
          address: "",
          code: "",
          email: "",
          phone: "",
          website: "",
          description: "",
        },
      });

    // 2. không dùng useEffect, dùng reset trực tiếp khi có data
    useEffect(() => {
      if (data) {
        reset({
          name: data.name ?? "",
          email: data.email ?? "",
          phone: data.phone ?? "",
          code: data.code ?? "",
          website: data.website ?? "",
          address: data.address ?? "",
          description: data.description ?? "",
        });
        setIsActive(data.isActive || "Active");
      }
    }, [data, reset]);

    // 3. loading thì return sau khi hook đã được chạy
    if (isLoading) {
      return <Spin spinning />;
    }

    const handleSaveChanges = () => {
      modal.confirm({
        title: hasfacilityId ? "Xác nhận cập nhật" : "Xác nhận tạo mới",
        icon: <ExclamationCircleFilled />,
        content: hasfacilityId
          ? "Bạn có chắc chắn muốn lưu các thay đổi này?"
          : "Bạn có chắc chắn muốn tạo mới bệnh viện này?",
        okText: "Xác nhận",
        cancelText: "Hủy",
        okButtonProps: {
          type: "primary",
        },
        onOk: () => {
          setIsSubmitting(true);
          handleSubmit(onSubmit)();
        },
      });
    };

    const onSubmit = (data: ResponseMedicalFacility) => {
      if (hasfacilityId) {
        mutate(
          {
            ...data,
            id: facilityId,
            isActive: isActive,
          },
          {
            onSuccess: () => {
              toast.success("Cập nhật thành công");
              setIsSubmitting(false);
            },
            onError: () => {
              setIsSubmitting(false);
            },
          }
        );
      } else {
        create(
          {
            ...data,
            code: data.email,
            isActive: isActive,
          },
          {
            onSuccess: (data) => {
              setTimeout(() => {
                nav(
                  `${PATH_ROUTE_ADMIN.MEDICAL_FACILITY}/${data.id}/${data.name}`
                );
              }, 500);
              setIsSubmitting(false);
            },
            onError: () => {
              setIsSubmitting(false);
            },
          }
        );
      }
    };

    const handleDeleteMecility = (id: number) => {
      modal.confirm({
        title: "Xác nhận xóa",
        icon: <ExclamationCircleFilled />,
        content: (
          <div>
            <p className="mb-2">Bạn có chắc chắn muốn xóa bệnh viện này?</p>
          </div>
        ),
        okText: "Xóa",
        cancelText: "Hủy",
        okButtonProps: {
          danger: true,
        },
        onOk: () => {
          deleteFacility(id, {
            onSuccess: () => {
              toast.success("Xóa bệnh viện thành công");
              nav(PATH_ROUTE_ADMIN.MEDICAL_FACILITY);
            },
          });
        },
      });
    };

    // Kiểm tra xem form có thay đổi không
    const hasChanges = formState.isDirty;

    return (
      <div className="bg-white rounded-md px-5.5 pb-4.5">
        {/* Header */}
        <div className="flex items-center py-4 mb-4 justify-between border-b border-gray-200">
          <div className="flex items-center gap-4">
            <Avatar size={64} src={data?.imageUrl} />
            <div>
              <h2 className="text-lg font-semibold">
                {hasfacilityId ? data?.name ?? "---" : watch("name")}
              </h2>
              <p className="text-sm text-gray-500">
                {hasfacilityId ? data?.email ?? "---" : watch("email")}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-gray-600">Hoạt động</span>
            <Switch
              defaultChecked={
                (hasfacilityId ? data?.isActive === "Active" : isActive)
                  ? true
                  : false
              }
              onChange={(value) => setIsActive(value ? "Active" : "InActive")}
            />
          </div>
        </div>
        <Flex
          gap={10}
          align="center"
          className="mb-5!"
          data-section="profile"
          ref={ref}
        >
          <div className="h-6 w-[5px] bg-[#9afaeb] rounded" />
          <h3 className="text-xl font-semibold">Thông tin cơ bản</h3>
        </Flex>

        <Form
          layout="vertical"
          onFinish={handleSaveChanges}
          className="[&_.ant-form-item]:mb-3.5!"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-7">
            <Controller
              name="name"
              control={control}
              rules={{
                required: "Tên bệnh viện không được để trống",
              }}
              render={({ field, fieldState }) => (
                <Form.Item
                  label="Tên bệnh viện"
                  validateStatus={fieldState.error ? "error" : ""}
                  help={fieldState.error?.message}
                  required
                >
                  <Input {...field} placeholder="Nhập thông tin..." />
                </Form.Item>
              )}
            />

            <Controller
              name="email"
              control={control}
              rules={{
                required: "Email không được để trống",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Email không hợp lệ",
                },
              }}
              render={({ field, fieldState }) => (
                <Form.Item
                  label="Email"
                  validateStatus={fieldState.error ? "error" : ""}
                  help={fieldState.error?.message}
                  required
                >
                  <Input {...field} placeholder="Nhập thông tin..." />
                </Form.Item>
              )}
            />
            <Controller
              name="phone"
              control={control}
              rules={{
                required: "Điện thoại không được để trống",
              }}
              render={({ field, fieldState }) => (
                <Form.Item
                  label="Điện thoại"
                  validateStatus={fieldState.error ? "error" : ""}
                  help={fieldState.error?.message}
                  required
                >
                  <Input {...field} placeholder="Nhập thông tin..." />
                </Form.Item>
              )}
            />

            {/* ✅ DatePicker kết nối form */}
            <Controller
              name="code"
              control={control}
              render={({ field }) => (
                <Form.Item label="Mã bệnh viện">
                  <Input {...field} disabled />
                </Form.Item>
              )}
            />
            <Controller
              name="website"
              control={control}
              render={({ field }) => (
                <Form.Item label="Link web">
                  <Input
                    {...field}
                    placeholder="Nhập thông tin..."
                    value={field.value ?? ""}
                  />
                </Form.Item>
              )}
            />
            <Controller
              name="address"
              control={control}
              rules={{
                required: "Địa chỉ không được để trống",
              }}
              render={({ field, fieldState }) => (
                <Form.Item
                  label="Địa chỉ"
                  validateStatus={fieldState.error ? "error" : ""}
                  help={fieldState.error?.message}
                  required
                >
                  <TextArea
                    {...field}
                    placeholder="Nhập thông tin..."
                    rows={2}
                  />
                </Form.Item>
              )}
            />
          </div>

          {/* ✅ SunEditor thay cho TinyMCE */}
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <Form.Item label="Mô tả">
                <SunEditor
                  setContents={field.value}
                  onChange={(content) => field.onChange(content)}
                  height="300px"
                  setOptions={{
                    buttonList: [
                      ["undo", "redo"],
                      ["bold", "italic", "underline", "fontSize"],
                      ["fontColor", "hiliteColor"],
                      [
                        "align",
                        "list",
                        "link",
                        "image",
                        "video",
                        "table",
                        "preview",
                      ],
                      ["removeFormat"],
                    ],
                    fontSize: [
                      8, 10, 12, 14, 16, 18, 20, 24, 28, 32, 36, 48, 60, 72, 96,
                    ],
                    defaultTag: "div",
                    defaultStyle: "font-size: 18px;",
                  }}
                />
              </Form.Item>
            )}
          />

          <div
            className={`mt-4 flex ${
              !hasfacilityId ? "justify-end" : "justify-between"
            } `}
          >
            {hasfacilityId && (
              <Button
                danger
                onClick={() => handleDeleteMecility(facilityId)}
                loading={isPendingDelete}
                disabled={isPendingDelete}
              >
                Xóa bệnh viện
              </Button>
            )}
            <Button
              type="primary"
              htmlType="submit"
              loading={isPendingCreate || isPending || isSubmitting}
              disabled={
                isPendingCreate || isPending || isSubmitting || !hasChanges
              }
            >
              Lưu thay đổi
            </Button>
          </div>
        </Form>
        {modalElement}
      </div>
    );
  }
);

InfoBasic.displayName = "InfoBasic";
export default InfoBasic;
