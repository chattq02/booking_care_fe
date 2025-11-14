import { forwardRef, useImperativeHandle, useState } from "react";
import {
  Modal,
  Flex,
  Card,
  Row,
  Col,
  Typography,
  Divider,
  Button,
  Space,
  Switch,
  Descriptions,
  Badge,
  Form,
  Input,
  Select,
  DatePicker,
  TimePicker,
  message,
} from "antd";
import { Dayjs } from "dayjs";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { v4 } from "uuid";
import { useSetAtom } from "jotai";
import { loadingAtom } from "@/stores/loading";
import type { ResponseDoctor } from "@/site/admin.site/types/doctor";

import {
  PhoneOutlined,
  WhatsAppOutlined,
  InstagramOutlined,
  EnvironmentOutlined,
  MailOutlined,
  UserOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import TaskSchedule from "../task-schedule";

const { Option } = Select;
const { TextArea } = Input;

export interface WorkShift {
  session: "morning" | "afternoon" | "evening";
  range: [Dayjs | null, Dayjs | null];
}

export interface HospitalScheduleFormValues {
  dayOfWeek: string[];
  workShifts: WorkShift[];
}

export interface DepartmentScheduleRef {
  showModal: (doctor: ResponseDoctor) => void;
  hideModal: () => void;
}

interface IProps {}

export const DepartmentScheduleModal = forwardRef<
  DepartmentScheduleRef,
  IProps
>(({}, ref) => {
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();
  const [selectedDate, setSelectedDate] = useState("29");
  const [selectedTime, setSelectedTime] = useState(null);
  const [contactMethods, setContactMethods] = useState({
    phone: false,
    whatsapp: true,
    instagram: false,
  });

  const dates = ["29", "30", "31", "1", "2", "3", "4"];
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const morningTimes = [
    "8:00 AM",
    "8:30 AM",
    "9:00 AM",
    "9:30 AM",
    "10:00 AM",
    "10:30 AM",
    "11:00 AM",
    "11:30 AM",
  ];
  const afternoonTimes = [
    "12:00 PM",
    "12:30 PM",
    "1:00 PM",
    "1:30 PM",
    "2:00 PM",
    "2:30 PM",
    "3:00 PM",
    "3:30 PM",
    "4:00 PM",
    "4:30 PM",
  ];

  const handleContactMethodChange = (method, checked) => {
    setContactMethods({
      ...contactMethods,
      [method]: checked,
    });
  };

  const onFinish = (values) => {
    console.log("Form values:", values);
    console.log("Selected date:", selectedDate);
    console.log("Selected time:", selectedTime);

    // message.success('Đặt lịch thành công!');

    // Reset form
    form.resetFields();
    setSelectedTime(null);
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
    // message.error('Vui lòng kiểm tra lại thông tin!');
  };

  const setLoading = useSetAtom(loadingAtom);
  const [modalType, setModalType] = useState<"create" | "edit">("create");

  const showModal = (doctor: ResponseDoctor) => {
    setVisible(true);
    //   setModalType(type_modal || "create");
    //   if (type_modal === "edit") {
    //     const formValues = convertDataToFormValues(data);
    //     form.setFieldsValue(formValues);
    //   } else {
    //     form.resetFields();
    //   }
  };

  const hideModal = () => setVisible(false);

  useImperativeHandle(ref, () => ({
    showModal,
    hideModal,
  }));

  return (
    <Modal
      title="Cấu hình lịch làm việc bệnh viện"
      open={visible}
      onCancel={hideModal}
      styles={{
        body: { maxHeight: "70vh", overflowY: "auto" },
      }}
      width={"80%"}
      footer={[
        <Button key="cancel" onClick={hideModal}>
          Hủy
        </Button>,
        <Button
          key="submit"
          type="primary"
          onClick={() => form.submit()} // submit form khi click
        >
          Lưu cấu hình
        </Button>,
      ]}
    >
      <TaskSchedule />
    </Modal>
  );
});
