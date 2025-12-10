import React, { useState } from "react";
import { Table, Flex, DatePicker } from "antd";
import type { ColumnsType } from "antd/es/table";
import dayjs, { Dayjs } from "dayjs";

import { useGetCompletedAndPaidAppointments } from "../list-appointment/hooks/useAppointment";
import type { AppointmentCompletedPaidParams } from "../list-appointment/stores/params";
import type { ICompletedPaidAppointmentRes } from "../list-appointment/type";
import SearchBox from "@/site/admin.site/pages/info-doctor/components/search-box";
import type { RangePickerProps } from "antd/es/date-picker";
import { useNavigate } from "react-router-dom";
import { PATH_ROUTE_DOCTOR } from "../../lib/enums/path";

const { RangePicker } = DatePicker;

// Type cho row của Table
interface PatientTableRow {
  key: number;
  fullName: string;
  phone: string;
  appointmentDate: string;
  startTime: string;
  endTime: string;
  doctorName: string;
  status: string;
  paymentStatus: string;
  appointmentId: number;
}

const ListPatient: React.FC = () => {
  const [dateRange, setDateRange] = useState<[Dayjs, Dayjs]>([
    dayjs().startOf("month"),
    dayjs().endOf("month"),
  ]);
  const [filters, setFilters] = useState<AppointmentCompletedPaidParams>({
    fromDate: dateRange[0].format("YYYY-MM-DD"),
    toDate: dateRange[1].format("YYYY-MM-DD"),
    page: 1,
    per_page: 10,
    keyword: "",
  });

  const { data, isLoading } = useGetCompletedAndPaidAppointments(filters);

  const navigate = useNavigate();

  // Map Data
  const tableData: PatientTableRow[] =
    data?.data?.map((item: ICompletedPaidAppointmentRes) => {
      const appt = item.appointments[0];
      const slot = JSON.parse(appt.slot) as {
        startTime: string;
        endTime: string;
      };

      return {
        key: item.patient.id,
        fullName: item.patient.fullName,
        phone: item.patient.phone,
        appointmentDate: appt.appointmentDate,
        startTime: slot.startTime,
        endTime: slot.endTime,
        doctorName: appt.doctor.fullName,
        status: appt.status,
        paymentStatus: appt.paymentStatus,
        appointmentId: appt.id,
      };
    }) ?? [];

  // Columns
  const columns: ColumnsType<PatientTableRow> = [
    { title: "ID", dataIndex: "key" },
    { title: "Tên bệnh nhân", dataIndex: "fullName" },
    { title: "SĐT", dataIndex: "phone" },
    {
      title: "Ngày khám",
      dataIndex: "appointmentDate",
      render: (v) => dayjs(v).format("DD/MM/YYYY"),
    },
    {
      title: "Khung giờ",
      render: (_, r) => `${r.startTime} - ${r.endTime}`,
    },
    { title: "Bác sĩ", dataIndex: "doctorName" },
    { title: "Trạng thái", dataIndex: "status" },
    { title: "Thanh toán", dataIndex: "paymentStatus" },
  ];

  // ==========================
  // HANDLERS
  // ==========================

  const handleTableChange = (pagination: any) => {
    setFilters({
      ...filters,
      page: pagination.current,
      per_page: pagination.pageSize,
    });
  };

  const handleFilterChange: RangePickerProps["onChange"] = (dates: any) => {
    setDateRange(dates);
  };

  const handleCalendarChange: RangePickerProps["onCalendarChange"] = (
    dates: [Dayjs | null, Dayjs | null] | null
  ) => {
    if (dates && dates[0] && dates[1]) {
      const startDate = dates[0];
      const endDate = dates[1];

      setDateRange([startDate, endDate]);
      setFilters({
        ...filters,
        fromDate: dates[0].format("YYYY-MM-DD"),
        toDate: dates[1].format("YYYY-MM-DD"),
        page: 1,
      });
    }
  };

  return (
    <div style={{ padding: "15px 20px" }}>
      <Flex style={{ marginBottom: 12 }} gap={14} justify="space-between" wrap>
        {/* LEFT SIDE FILTERS */}
        <Flex gap={14}>
          {/* Search */}
          <SearchBox
            value={filters.keyword}
            onSearch={(value) =>
              setFilters({
                ...filters,
                keyword: value,
                page: 1,
              })
            }
          />

          {/* Date Range */}
          <RangePicker
            value={[dateRange[0], dateRange[1]]}
            onChange={handleFilterChange}
            onCalendarChange={handleCalendarChange}
            format="YYYY/MM/DD"
            allowClear={false}
            style={{ flex: 1 }}
          />
        </Flex>
      </Flex>

      {/* TABLE */}
      <Table<PatientTableRow>
        columns={columns}
        dataSource={tableData}
        pagination={{
          current: Number(data?.current_page) ?? 1,
          pageSize: Number(data?.per_page) ?? 10,
          total: data?.total ?? 0,
          showSizeChanger: true,
          showTotal: (total) => `Tổng ${total} bản ghi`,
          position: ["bottomCenter"],
        }}
        bordered
        scroll={{ x: "max-content", y: 800 }}
        rowKey="key"
        onChange={handleTableChange}
        loading={isLoading}
        onRow={(record) => ({
          onClick: () => {
            navigate(
              `${PATH_ROUTE_DOCTOR.PATIENTS_DETAIL}?patientId=${record.key}`
            );
          },
        })}
      />
    </div>
  );
};

export default ListPatient;
