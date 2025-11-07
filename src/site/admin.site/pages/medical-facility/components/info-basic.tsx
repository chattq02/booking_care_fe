import { forwardRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { Form, Input, DatePicker, Button, Flex } from "antd";
import TextArea from "antd/es/input/TextArea";
import SunEditor from "suneditor-react";
import dayjs from "dayjs";
import "suneditor/dist/css/suneditor.min.css";

interface InfoBasicProps {}

interface FormValues {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateFounded: dayjs.Dayjs | null;
  description: string;
}

const InfoBasic = forwardRef<HTMLDivElement, InfoBasicProps>(({}, ref) => {
  const { control, handleSubmit } = useForm<FormValues>({
    defaultValues: {
      firstName: "Alex",
      lastName: "Thompson",
      email: "example@email.com",
      phone: "+40 735 631 620",
      dateFounded: dayjs("2010-01-01"),
      description: "<p>Thông tin mô tả bệnh viện...</p>",
    },
  });

  const onSubmit = (data: FormValues) => {
    console.log("submit", {
      ...data,
      dateFounded: data.dateFounded?.format("YYYY-MM-DD"),
    });
  };

  return (
    <div ref={ref} data-section="basic" className="bg-white rounded-md p-5.5">
      <Flex gap={10}>
        <div className="h-6 w-[5px] bg-amber-200 rounded" />
        <h3 className="text-xl font-semibold mb-2">Chỉnh sửa thông tin</h3>
      </Flex>

      <Form
        layout="vertical"
        onFinish={handleSubmit(onSubmit)}
        className="[&_.ant-form-item]:mb-3.5!"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-7">
          <Controller
            name="firstName"
            control={control}
            render={({ field }) => (
              <Form.Item label="Tên bệnh viện">
                <Input {...field} />
              </Form.Item>
            )}
          />

          <Controller
            name="lastName"
            control={control}
            render={({ field }) => (
              <Form.Item label="Email">
                <Input {...field} />
              </Form.Item>
            )}
          />

          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <Form.Item label="Điện thoại">
                <Input {...field} />
              </Form.Item>
            )}
          />

          {/* ✅ DatePicker kết nối form */}
          <Controller
            name="dateFounded"
            control={control}
            render={({ field }) => (
              <Form.Item label="Ngày thành lập">
                <DatePicker
                  className="w-full"
                  placeholder="Chọn ngày"
                  value={field.value ? dayjs(field.value) : null}
                  onChange={(date) => field.onChange(date)}
                />
              </Form.Item>
            )}
          />
        </div>

        <Controller
          name="phone"
          control={control}
          render={({ field }) => (
            <Form.Item label="Địa chỉ">
              <TextArea {...field} rows={2} />
            </Form.Item>
          )}
        />

        {/* ✅ SunEditor thay cho TinyMCE */}
        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <Form.Item label="Mô tả">
              <SunEditor
                setContents={field.value}
                onChange={(content) => field.onChange(content)}
                height="250px"
                setOptions={{
                  buttonList: [
                    ["undo", "redo"],
                    ["bold", "italic", "underline"],
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
                  defaultTag: "div",
                }}
              />
            </Form.Item>
          )}
        />

        <div className="mt-4 flex justify-end">
          <Button type="primary" htmlType="submit">
            Lưu thay đổi
          </Button>
        </div>
      </Form>
    </div>
  );
});

InfoBasic.displayName = "InfoBasic";
export default InfoBasic;
