import { Button, Table } from "antd";

export default function TabHistoryAppointment() {
  const medicalHistoryData = [
    {
      key: "1",
      date: "2024-01-10",
      doctor: "BS. Nguyễn Văn A",
      diagnosis: "Viêm họng cấp",
      treatment: "Kháng sinh, giảm đau",
      prescription: "Amoxicillin 500mg",
      status: "completed",
    },
    {
      key: "2",
      date: "2023-12-05",
      doctor: "BS. Trần Thị B",
      diagnosis: "Cảm cúm",
      treatment: "Nghỉ ngơi, bổ sung vitamin",
      prescription: "Vitamin C, Paracetamol",
      status: "completed",
    },
    {
      key: "3",
      date: "2023-11-20",
      doctor: "BS. Lê Văn C",
      diagnosis: "Khám sức khỏe định kỳ",
      treatment: "Tư vấn sức khỏe",
      prescription: "Không",
      status: "completed",
    },
  ];

  const medicalHistoryColumns = [
    {
      title: "Ngày khám",
      dataIndex: "date",
      key: "date",
      className: "font-medium",
    },
    {
      title: "Bác sĩ",
      dataIndex: "doctor",
      key: "doctor",
      responsive: ["md"],
    },
    {
      title: "Chẩn đoán",
      dataIndex: "diagnosis",
      key: "diagnosis",
      className: "font-semibold text-gray-800",
    },
    {
      title: "Điều trị",
      dataIndex: "treatment",
      key: "treatment",
      responsive: ["lg"],
    },
    {
      title: "Đơn thuốc",
      dataIndex: "prescription",
      key: "prescription",
      responsive: ["xl"],
    },
    {
      title: "Thao tác",
      key: "action",
      render: () => (
        <Button
          type="link"
          size="small"
          className="text-blue-600 hover:text-blue-800 font-medium"
        >
          Xem chi tiết
        </Button>
      ),
    },
  ];
  return (
    <div className="mb-6 lg:mb-8">
      <h3 className="text-lg lg:text-xl font-bold text-gray-900 mb-4 lg:mb-6">
        Lịch sử khám bệnh
      </h3>
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <Table
          columns={medicalHistoryColumns}
          dataSource={medicalHistoryData}
          pagination={{
            pageSize: 5,
            showSizeChanger: true,
            showQuickJumper: true,
            className: "px-4 py-2",
          }}
          scroll={{ x: 1000 }}
          className="custom-table"
        />
      </div>
    </div>
  );
}
