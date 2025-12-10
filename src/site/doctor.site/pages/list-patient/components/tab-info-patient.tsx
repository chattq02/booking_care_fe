import { Descriptions, Card } from "antd";
import type { IPatientDetail } from "../../list-appointment/type";

interface IProps {
  patient: IPatientDetail | undefined;
}

export default function TabInfoPatient({ patient }: IProps) {
  const scrollbarStyles = {
    /* Tùy chỉnh scrollbar cho Chrome, Safari và Edge */
    "&::-webkit-scrollbar": {
      width: "8px",
    },
    "&::-webkit-scrollbar-track": {
      background: "#f1f1f1",
      borderRadius: "4px",
    },
    "&::-webkit-scrollbar-thumb": {
      background: "#c1c1c1",
      borderRadius: "4px",
    },
    "&::-webkit-scrollbar-thumb:hover": {
      background: "#a8a8a8",
    },
    /* Tùy chỉnh scrollbar cho Firefox */
    scrollbarWidth: "thin",
    scrollbarColor: "#c1c1c1 #f1f1f1",
  } as React.CSSProperties;
  return (
    <div
      style={{
        height: "300px",
        overflowY: "auto",
        paddingRight: "8px",
        ...scrollbarStyles,
      }}
    >
      <Card
        title="Thông tin cá nhân"
        size="small"
        style={{
          borderRadius: "10px",
          border: "1px solid #e8e8e8",
        }}
      >
        <Descriptions column={1} size="small">
          <Descriptions.Item label="Họ và tên">
            {patient?.fullName ?? "---"}
          </Descriptions.Item>
          <Descriptions.Item label="Ngày sinh">
            {patient?.birthday ?? "---"}
          </Descriptions.Item>
          <Descriptions.Item label="Giới tính">
            {patient?.gender ?? "---"}
          </Descriptions.Item>
          <Descriptions.Item label="CMND/CCCD">
            {patient?.cccd ?? "---"}
          </Descriptions.Item>
          <Descriptions.Item label="Bảo hiểm y tế">
            {patient?.bhyt ?? "---"}
          </Descriptions.Item>
          <Descriptions.Item label="Địa chỉ">
            {patient?.address ?? "---"}
          </Descriptions.Item>
        </Descriptions>
      </Card>
    </div>
  );
}
