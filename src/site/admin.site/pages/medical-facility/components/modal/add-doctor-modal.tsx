import { forwardRef, useImperativeHandle, useState } from "react";
import { Modal, Form, Input, Select, Upload, type UploadFile } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import ListAcademicTitle from "@/site/admin.site/components/list-academic-title";
import ListSpecialty from "@/site/admin.site/components/list-specialty";
import type { RegisterDoctorDto } from "@/site/user.site/pages/profile/types/type";
import { useRegisterDoctor } from "../../hooks/use-medical-facility";
import fileApi from "@/apis/upload.api";

export interface AddDoctorModalRef {
  open: () => void;
  close: () => void;
}

interface IAddDoctorModalProps {
  facilityId: number;
  refetch: () => void;
}
const { TextArea } = Input;

const AddDoctorModal = forwardRef<AddDoctorModalRef, IAddDoctorModalProps>(
  ({ facilityId, refetch }, ref) => {
    const [open, setOpen] = useState(false);
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const { mutate: registerDoctor, isPending } = useRegisterDoctor();

    const [form] = Form.useForm();

    // Expose API cho parent
    useImperativeHandle(ref, () => ({
      open: () => setOpen(true),
      close: () => {
        form.resetFields();
        setOpen(false);
      },
    }));

    const onSubmit = async (values: RegisterDoctorDto) => {
      let avatar = typeof values.avatar === "string" ? values.avatar : null;
      if (
        values.avatar &&
        typeof values.avatar !== "string" &&
        values?.avatar instanceof File
      ) {
        const res = await fileApi.upload(values.avatar);
        avatar = res.data.FileUrl;
      }
      registerDoctor(
        {
          ...values,
          facilityId,
          departmentId: Number(values.departmentId),
          academicTitleId: Number(values.academicTitleId),
          avatar: avatar ?? "",
        },
        {
          onSuccess: () => {
            form.resetFields();
            refetch();
            setOpen(false);
          },
        }
      );
    };

    return (
      <Modal
        title="Thêm bác sĩ"
        open={open}
        onCancel={() => {
          form.resetFields();
          setOpen(false);
        }}
        okText="Lưu"
        confirmLoading={isPending}
        width={800}
        onOk={() =>
          form
            .validateFields()
            .then((values) => {
              onSubmit(values);
            })
            .catch(() => {})
        }
      >
        <Form form={form} layout="vertical">
          {/* Nguyên info */}
          <div className="grid grid-cols-2 gap-x-4">
            <Form.Item
              label="Họ và tên"
              name="fullName"
              rules={[{ required: true, message: "Vui lòng nhập họ tên" }]}
            >
              <Input placeholder="Nhập họ tên" />
            </Form.Item>

            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: "Vui lòng nhập email" },
                { type: "email", message: "Email không hợp lệ" },
              ]}
            >
              <Input placeholder="email@example.com" />
            </Form.Item>

            <Form.Item
              label="Số điện thoại"
              name="phone"
              rules={[
                { required: true, message: "Vui lòng nhập số điện thoại" },
                {
                  pattern: /^(0[0-9]{9}|84[0-9]{9})$/,
                  message: "Số điện thoại không hợp lệ (VD: 0912345678)",
                },
              ]}
            >
              <Input placeholder="Nhập số điện thoại" />
            </Form.Item>

            {/* NEW FIELD: CCCD */}
            <Form.Item label="CCCD" name="cccd">
              <Input placeholder="Nhập số CCCD" maxLength={12} />
            </Form.Item>
          </div>

          <div className="grid grid-cols-2 gap-x-4">
            <Form.Item
              label="Chức danh (Học vị)"
              name="academicTitleId"
              rules={[{ required: true, message: "Vui lòng chọn chức danh" }]}
            >
              <ListAcademicTitle
                style={{
                  width: "100%",
                }}
              />
            </Form.Item>

            <Form.Item
              label="Chuyên khoa"
              name="departmentId"
              rules={[{ required: true, message: "Vui lòng chọn chuyên khoa" }]}
            >
              <ListSpecialty
                facilityId={facilityId}
                style={{
                  width: "100%",
                }}
              />
            </Form.Item>
          </div>
          <div className="grid grid-cols-2 gap-x-4">
            <div className="grid grid-cols-2 gap-x-4">
              <Form.Item
                label="Trạng thái"
                name="user_status"
                initialValue={"Active"}
              >
                <Select
                  options={[
                    { label: "Đang hoạt động", value: "Active" },
                    { label: "Ngưng hoạt động", value: "InActive" },
                    { label: "Chưa verify", value: "Pending" },
                    { label: "Bị khóa", value: "Banned" },
                  ]}
                />
              </Form.Item>

              <Form.Item
                label="Giới tính"
                name="gender"
                rules={[{ required: true, message: "Vui lòng chọn giới tính" }]}
              >
                <Select
                  placeholder="Chọn giới tính"
                  options={[
                    { label: "Nam", value: "MALE" },
                    { label: "Nữ", value: "FEMALE" },
                    { label: "Khác", value: "OTHER" },
                  ]}
                />
              </Form.Item>
            </div>

            <Form.Item
              label="Địa chỉ"
              name="address"
              rules={[{ required: true, message: "Vui lòng nhập địa chỉ" }]}
            >
              <TextArea placeholder="Nhập thông tin..." rows={3} />
            </Form.Item>
          </div>
          {/* Avatar upload */}
          <Form.Item label="Ảnh đại diện" name="avatar" valuePropName="file">
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

                    form.setFieldValue("avatar", file.originFileObj);
                  }
                } else {
                  form.setFieldValue("avatar", null);
                }
              }}
              onRemove={() => {
                form.setFieldValue("avatar", null);
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
          </Form.Item>
        </Form>
      </Modal>
    );
  }
);

AddDoctorModal.displayName = "AddDoctorModal";
export default AddDoctorModal;
