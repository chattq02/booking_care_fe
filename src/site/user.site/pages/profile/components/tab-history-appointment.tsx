import { DataGrid } from "@/components/data-table";
import { useGetPatientAppointmentStatus } from "@/site/doctor.site/pages/list-appointment/hooks/useAppointment";
import type { IAppointmentHistoryItem } from "@/site/doctor.site/pages/list-appointment/type";
import type { ColumnsType } from "antd/es/table";
import { Tag, Space, Tooltip } from "antd";

export default function TabHistoryAppointment() {
  const { data, isLoading } = useGetPatientAppointmentStatus({
    page: 1,
    per_page: 50,
    status: "COMPLETED",
  });

  console.log("data", data);

  // Format hiển thị slot
  const formatSlot = (slotString: string) => {
    try {
      const slot = JSON.parse(slotString);
      return `${slot.startTime} - ${slot.endTime}`;
    } catch {
      return slotString;
    }
  };

  // Render bác sĩ
  const renderDoctor = (doctor: any) => {
    if (!doctor) return "-";
    return (
      <Tooltip title={`ID: ${doctor.id}`}>
        <span className="text-blue-600 font-medium">
          {doctor.fullName || "Không có tên"}
        </span>
      </Tooltip>
    );
  };

  // Render cơ sở y tế
  const renderFacility = (facility: any) => {
    if (!facility) return "-";
    return (
      <div className="max-w-xs">
        <div className="font-medium">{facility.name}</div>
        <div className="text-sm text-gray-500">{facility.address}</div>
      </div>
    );
  };

  // Render đơn thuốc
  const renderPrescription = (prescription: any) => {
    if (
      !prescription ||
      !prescription.items ||
      prescription.items.length === 0
    ) {
      return <span className="text-gray-400">Không có</span>;
    }

    const items = prescription.items;
    return (
      <Tooltip
        title={
          <div className="p-2">
            <div className="font-bold mb-2">Chi tiết đơn thuốc:</div>
            {items.map((item: any, index: number) => (
              <div key={index} className="mb-1">
                • {item.medicineName} - {item.dosage}
                {item.unit}
              </div>
            ))}
          </div>
        }
      >
        <div className="p-2">
          {items.map((item: any, index: number) => (
            <div key={index} className="mb-1">
              • {item.medicineName} - {item.dosage}
              {item.unit}
            </div>
          ))}
        </div>
      </Tooltip>
    );
  };

  // Render chẩn đoán và kết luận
  const renderDiagnosis = (record: any) => {
    return (
      <div className="max-w-xs">
        <div className="font-semibold text-gray-800">
          {record.diagnosis || "Chưa có"}
        </div>
        {record.conclusion && (
          <div className="text-sm text-gray-600 mt-1">
            Kết luận: {record.conclusion}
          </div>
        )}
      </div>
    );
  };

  // Render chỉ số sức khỏe
  const renderHealthIndicators = (record: any) => {
    const indicators = [];
    if (record.bloodPressure) indicators.push(`HA: ${record.bloodPressure}`);
    if (record.temperature) indicators.push(`Nhiệt: ${record.temperature}°C`);
    if (record.heartRate) indicators.push(`Mạch: ${record.heartRate}/phút`);
    if (record.weight && record.height) {
      const bmi = (record.weight / (record.height / 100) ** 2).toFixed(1);
      indicators.push(`BMI: ${bmi}`);
    }

    if (indicators.length === 0) return "-";

    return (
      <Tooltip title={indicators.join(", ")}>
        <div className="max-w-xs">
          {indicators.slice(0, 2).map((ind, idx) => (
            <div key={idx} className="text-sm">
              {ind}
            </div>
          ))}
          {indicators.length > 2 && (
            <div className="text-sm text-blue-500">
              +{indicators.length - 2} chỉ số
            </div>
          )}
        </div>
      </Tooltip>
    );
  };

  // Render trạng thái thanh toán
  const renderPaymentStatus = (status: string, amount: number) => {
    const statusConfig: Record<string, { color: string; text: string }> = {
      PAID: { color: "green", text: "Đã thanh toán" },
      UNPAID: { color: "red", text: "Chưa thanh toán" },
      PENDING: { color: "orange", text: "Đang xử lý" },
    };

    const config = statusConfig[status] || { color: "default", text: status };

    return (
      <Space direction="vertical" size={0}>
        <Tag color={config.color}>{config.text}</Tag>
        {amount && (
          <div className="text-sm font-medium">
            {amount.toLocaleString("vi-VN")} đ
          </div>
        )}
      </Space>
    );
  };

  const medicalHistoryColumns: ColumnsType<IAppointmentHistoryItem> = [
    {
      title: "Thông tin lịch hẹn",
      key: "appointmentInfo",
      width: 180,
      render: (_, record) => (
        <Space direction="vertical" size={2}>
          <div className="font-semibold">{record?.appointmentDate}</div>
          <div className="text-sm text-gray-500">
            {record.slot ? formatSlot(record.slot as any) : "-"}
          </div>
          <Tag color={record.status === "COMPLETED" ? "blue" : "default"}>
            {record.status === "COMPLETED" ? "Hoàn thành" : record.status}
          </Tag>
        </Space>
      ),
    },
    {
      title: "Bác sĩ & Cơ sở",
      key: "doctorFacility",
      width: 200,
      responsive: ["md"],
      render: (_, record) => (
        <Space direction="vertical" size={4}>
          {renderDoctor(record.doctor)}
          {renderFacility(record?.facility)}
        </Space>
      ),
    },
    {
      title: "Chẩn đoán",
      key: "diagnosis",
      width: 200,
      render: (_, record) => renderDiagnosis(record),
    },
    {
      title: "Chỉ số sức khỏe",
      key: "healthIndicators",
      width: 150,
      responsive: ["lg"],
      render: (_, record) => renderHealthIndicators(record),
    },
    {
      title: "Đơn thuốc",
      key: "prescription",
      width: 120,
      responsive: ["xl"],
      align: "center",
      render: (_, record) => renderPrescription(record.prescription),
    },
    {
      title: "Thanh toán",
      key: "payment",
      width: 140,
      responsive: ["xl"],
      render: (_, record) =>
        renderPaymentStatus(record.paymentStatus, record.paymentAmount || 0),
    },
    {
      title: "Thông tin khác",
      key: "additionalInfo",
      width: 180,
      render: (_, record) => (
        <Space direction="vertical" size={2}>
          {record.medicalHistory && (
            <Tooltip title={`Tiền sử: ${record.medicalHistory}`}>
              <div className="text-sm truncate max-w-[150px]">
                Tiền sử: {record.medicalHistory}
              </div>
            </Tooltip>
          )}
          {record?.note && (
            <Tooltip title={`Ghi chú: ${record.note}`}>
              <div className="text-sm text-gray-500 truncate max-w-[150px]">
                {record.note}
              </div>
            </Tooltip>
          )}
          <div className="text-xs text-gray-400">ID: {record.id}</div>
        </Space>
      ),
    },
  ];

  return (
    <div className="mb-6 lg:mb-8">
      <DataGrid<IAppointmentHistoryItem>
        columns={medicalHistoryColumns}
        data={(data?.data as any) ?? []}
        pagination={{
          current: Number(data?.current_page) ?? 1,
          pageSize: Number(data?.per_page) ?? 100,
          total: data?.total ?? 0,
          showSizeChanger: true,
          showTotal: (total) => `Tổng ${total} bản ghi`,
          position: ["bottomCenter"],
        }}
        rowKey="id"
        maxHeight={{
          isMax: true,
          customScrollY: 800,
        }}
        loading={isLoading}
        // Thêm các props tuỳ chỉnh nếu cần
        scroll={{ x: 1200 }}
        className="[&_.ant-table-cell]:py-2! [&_.ant-table-thead_.ant-table-cell]:py-3!"
      />
    </div>
  );
}
