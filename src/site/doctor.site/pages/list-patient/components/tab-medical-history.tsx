import dayjs from "dayjs";
import {
  Descriptions,
  Tag,
  Typography,
  Space,
  Row,
  Col,
  Card,
  Collapse,
} from "antd";
import { CalendarOutlined } from "@ant-design/icons";

interface MedicalHistory {
  date: string;
  diagnosis: string;
  doctor: string;
  prescription: string;
}

const { Panel } = Collapse;

const { Text } = Typography;

export default function TabMedicalHistory() {
  // Dữ liệu mẫu cho lịch sử khám bệnh
  const sampleMedicalHistory: MedicalHistory[] = [
    {
      date: "2024-01-15",
      diagnosis: "Viêm họng cấp",
      doctor: "BS. Nguyễn Văn A",
      prescription: "Paracetamol, Amoxicillin",
    },
    {
      date: "2023-11-20",
      diagnosis: "Cảm cúm",
      doctor: "BS. Trần Thị B",
      prescription: "Vitamin C, Thuốc ho",
    },
    {
      date: "2023-09-10",
      diagnosis: "Khám tổng quát",
      doctor: "BS. Lê Văn C",
      prescription: "Không",
    },
  ];
  // Tạo CSS cho scrollbar tùy chỉnh
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
        height: "calc(100vh - 200px)",
        overflowY: "auto",
        paddingRight: "8px",
        ...scrollbarStyles,
      }}
    >
      <Collapse
        accordion
        style={{
          background: "transparent",
          border: "none",
        }}
      >
        {sampleMedicalHistory.map((record, index) => (
          <Panel
            header={
              <Space>
                <CalendarOutlined />
                <Text strong style={{ fontSize: "14px" }}>
                  {dayjs(record.date).format("DD/MM/YYYY")}
                </Text>
                <Tag
                  color="blue"
                  style={{
                    fontSize: "12px",
                    borderRadius: "10px",
                  }}
                >
                  {record.diagnosis}
                </Tag>
              </Space>
            }
            key={index}
            extra={<Text type="secondary">{record.doctor}</Text>}
            style={{
              marginBottom: "12px",
              borderRadius: "8px",
              border: "1px solid #e8e8e8",
              overflow: "hidden",
            }}
          >
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Card
                  size="small"
                  title="Thông tin khám"
                  style={{
                    borderRadius: "8px",
                  }}
                >
                  <Descriptions column={1} size="small">
                    <Descriptions.Item label="Ngày khám">
                      {dayjs(record.date).format("DD/MM/YYYY")}
                    </Descriptions.Item>
                    <Descriptions.Item label="Bác sĩ">
                      {record.doctor}
                    </Descriptions.Item>
                    <Descriptions.Item label="Chẩn đoán">
                      <Text strong>{record.diagnosis}</Text>
                    </Descriptions.Item>
                  </Descriptions>
                </Card>
              </Col>
              <Col span={12}>
                <Card
                  size="small"
                  title="Đơn thuốc"
                  style={{
                    borderRadius: "8px",
                  }}
                >
                  <Text style={{ fontSize: "14px" }}>
                    {record.prescription}
                  </Text>
                </Card>
              </Col>
            </Row>
          </Panel>
        ))}
      </Collapse>
    </div>
  );
}
