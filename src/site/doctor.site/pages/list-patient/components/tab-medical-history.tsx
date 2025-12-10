import dayjs from "dayjs";
import {
  Descriptions,
  Tag,
  Typography,
  Space,
  Card,
  Collapse,
  Flex,
} from "antd";
import { CalendarOutlined } from "@ant-design/icons";
import { useGetDetailPatientHistory } from "../../list-appointment/hooks/useAppointment";

const { Panel } = Collapse;

const { Text } = Typography;
interface IProps {
  patientId: number;
}

export default function TabMedicalHistory({ patientId }: IProps) {
  const { data } = useGetDetailPatientHistory(Number(patientId));

  console.log("data", data?.data_history);
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
        {data?.data_history.map((record, index) => (
          <Panel
            header={
              <Space>
                <CalendarOutlined />
                <Text strong style={{ fontSize: "14px" }}>
                  {dayjs(record.appointmentDate).format("DD/MM/YYYY")}
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
            extra={<Text type="secondary">BS. {record.doctor.fullName}</Text>}
            style={{
              marginBottom: "12px",
              borderRadius: "8px",
              border: "1px solid #e8e8e8",
              overflow: "hidden",
            }}
          >
            <Flex vertical gap={10}>
              <Card
                size="small"
                title="Thông tin khám"
                style={{
                  borderRadius: "8px",
                }}
              >
                <Descriptions column={1} size="small">
                  <Descriptions.Item label="Ngày khám">
                    {dayjs(record.appointmentDate).format("DD/MM/YYYY")}
                  </Descriptions.Item>
                  <Descriptions.Item label="Bác sĩ">
                    {record.doctor.fullName}
                  </Descriptions.Item>
                  <Descriptions.Item label="Chẩn đoán">
                    <Text strong>{record.diagnosis}</Text>
                  </Descriptions.Item>
                </Descriptions>
              </Card>
              <Card
                size="small"
                title="Thông tin sức khỏe"
                style={{
                  borderRadius: "8px",
                }}
              >
                <Descriptions column={1} size="small">
                  <Descriptions.Item label="Huyết áp">
                    <Text strong>{record.bloodPressure}</Text>
                  </Descriptions.Item>
                  <Descriptions.Item label="Nhịp tim">
                    <Text strong>{record.heartRate}</Text>
                  </Descriptions.Item>
                  <Descriptions.Item label="Cân nặng">
                    <Text strong>{record.weight}</Text>
                  </Descriptions.Item>
                  <Descriptions.Item label="Chiều cao">
                    <Text strong>{record.height}</Text>
                  </Descriptions.Item>
                  <Descriptions.Item label="Tiền sử">
                    <Text strong>{record.medicalHistory}</Text>
                  </Descriptions.Item>
                  <Descriptions.Item label="Ghi chú">
                    <Text strong>{record.conclusion}</Text>
                  </Descriptions.Item>
                </Descriptions>
              </Card>
              <Card size="small" title="Đơn thuốc" style={{ borderRadius: 8 }}>
                {record?.prescription?.items?.length ? (
                  record.prescription.items.map((item: any) => (
                    <Card
                      key={item.id}
                      size="small"
                      style={{
                        marginBottom: 10,
                        borderRadius: 8,
                        background: "#fafafa",
                        border: "1px solid #eee",
                      }}
                      title={
                        <div style={{ fontWeight: 600, fontSize: 14 }}>
                          {item.medicineName}
                        </div>
                      }
                    >
                      <div style={{ fontSize: 14 }}>
                        <div>
                          <strong>Liều lượng:</strong> {item.dosage} {item.unit}
                        </div>
                        <div>
                          <strong>Số lượng:</strong> {item.quantity}
                        </div>
                        <div>
                          <strong>Tần suất:</strong> {item.frequency}
                        </div>
                        <div>
                          <strong>Thời gian dùng:</strong> {item.duration} ngày
                        </div>
                        <div>
                          <strong>Thời điểm uống:</strong> {item.mealTime}
                        </div>
                        <div>
                          <strong>Hướng dẫn:</strong> {item.instruction}
                        </div>
                        {item.startDate && (
                          <div>
                            <strong>Từ ngày:</strong> {item.startDate}
                          </div>
                        )}
                        {item.endDate && (
                          <div>
                            <strong>Đến ngày:</strong> {item.endDate}
                          </div>
                        )}
                        {item.note && (
                          <div>
                            <strong>Ghi chú:</strong> {item.note}
                          </div>
                        )}
                      </div>
                    </Card>
                  ))
                ) : (
                  <Text>Không có đơn thuốc</Text>
                )}
              </Card>
            </Flex>
          </Panel>
        ))}
      </Collapse>
    </div>
  );
}
