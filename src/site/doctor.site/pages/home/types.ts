// Slot trong appointment
export interface IAppointmentSlot {
  id: string;
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  selected: boolean;
  isBlock: boolean;
}

// Thông tin bệnh nhân
export interface IPatientInfo {
  id: number;
  fullName: string;
  phone: string | null;
  email: string | null;
  avatar: string | null;
  gender: "MALE" | "FEMALE" | "OTHER";
}

// Thông tin 1 appointment
export interface IAppointmentDetail {
  id: number;
  uuid: string;
  doctorId: number;
  patientId: number;
  scheduleId: number;
  facilityId: number;
  paymentStatus: string;
  attachments: string | null;
  paymentAmount: number;
  status: string;
  note: string | null;
  appointmentDate: string;
  slot: IAppointmentSlot;
  remark: string | null;
  createdAt: string;
  updatedAt: string;

  patient: IPatientInfo; // 👈 Join từ Prisma
}

// Kiểu trả về chính
export interface ICurrentNextAppointmentRes {
  current: IAppointmentDetail | null;
  next: IAppointmentDetail | null;
}
