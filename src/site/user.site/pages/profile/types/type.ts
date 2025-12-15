export interface IMyAppointmentRes {
  id: number;
  doctor: {
    id: number;
    fullName: string;
    avatar: string | null;
  };
  status: "PENDING" | "CONFIRMED" | "CANCELED" | string;
  appointmentDate: string;
  slot: string; // JSON string
  patient: {
    id: number;
    fullName: string;
    avatar: string | null;
  };
  note: string | null;
  createdAt: string;
  updatedAt: string;
  uuid: string;
  facility: {
    id: number;
    name: string;
  };
  paymentStatus: "UNPAID" | "PAID" | string;
  paymentAmount: number;
  doctorId: number;
  patientId: number;
  scheduleId: number;
  attachments: any | null;
  facilityId: number;
}

export interface IAppointmentSlot {
  id: string;
  startTime: string;
  endTime: string;
  selected: boolean;
  isBlock: boolean;
}

export interface IParamMyAppointment {
  page: number;
  per_page: number;
}

export interface RegisterDoctorDto {
  name: string;
  email: string;
  password: string;
  phone?: string;
  gender: "MALE" | "FEMALE" | "OTHER";
  cccd: string;
  avatar?: File | string;
  academicTitleId: number;
  departmentId: number;
  facilityId: number;
}

export interface RegisterUserDto {
  fullName: string;
  email: string;
  password: string;
}

export interface ReportAppointment {
  total_revenue: number;
  total_appointment: number;
  total_patients: number;
  total_appointment_cancel: number;
  total_appointment_pending: number;
}
