import type { AppointmentStatus } from "./stores/params";

// ROOT RESPONSE ITEM
export interface ICompletedPaidAppointmentRes {
  patientId: number;
  patient: PatientInfo;
  appointments: AppointmentInfo[];
}

// ---------------- CHILD TYPES ----------------

export interface PatientInfo {
  id: number;
  fullName: string;
  avatar: string | null;
  phone: string;
  bhyt: string | null;
  gender: string;
  address: string;
  cccd: string;
}

export interface AppointmentInfo {
  id: number;
  appointmentDate: string;
  slot: string; // JSON.stringify({ startTime, endTime, price })
  doctor: DoctorInfo;
  paymentStatus: string; // PAID
  status: string; // COMPLETED
  createdAt: string;
}

export interface DoctorInfo {
  id: number;
  fullName: string;
  avatar: string | null;
}

export interface IPatientDetailAppointmentRes {
  appointment: IAppointmentDetail;
  patient: IPatientDetail;
  doctor: IDoctorDetail;
}

export interface IAppointmentDetail {
  id: number;
  appointmentDate: string; // ISO date string
  paymentStatus: string; // "PAID" | "UNPAID" | ...
  status: string; // "COMPLETED" | ...
  createdAt: string;
  slot: ISlotDetail;
}

export interface ISlotDetail {
  startTime: string; // "14:00"
  endTime: string; // "14:30"
  price: number; // 200000
}

export interface IPatientDetail {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  birthday: string; // ISO date string
  gender: string; // "MALE" | "FEMALE" | ...
  avatar: string | null;
  address: string;
  cccd: string;
  bhyt: string;
  medicalHistory: string;
}

export interface IDoctorDetail {
  id: number;
  fullName: string;
  departments: string[];
  facilities: IFacilityDetail[];
}

export interface IFacilityDetail {
  id: number;
  name: string;
  address: string;
  phone: string;
  email: string;
}

// Interface cho mỗi mục trong đơn thuốc
interface PrescriptionItem {
  medicineId: number;
  name: string;
  dosage: number;
  quantity: number;
  frequency: string;
  duration: string;
  mealTime: string;
  startDate: string | null; // ISO string format
  endDate: string | null; // ISO string format
  instruction: string;
  note: string;
  unit: string;
}

// Interface cho toàn bộ đơn thuốc
interface Prescription {
  diagnosis: string;
  notes: string;
  items: PrescriptionItem[];
}

// Interface chính cho dữ liệu khám bệnh
export interface MedicalAppointmentData {
  appointmentId: number;
  bloodPressure: string;
  heartRate: number;
  weight: number;
  height: number;
  temperature: number;
  diagnosis: string;
  medicalHistory: string;
  conclusion: string;
  prescription: Prescription;
}

export interface IAppointmentHistoryItem {
  id: number;
  doctor: DoctorInfo;
  status: AppointmentStatus;
  appointmentDate: string;
  slot: ISlotDetail;
  patient: PatientInfo;
  note: string | null;
  createdAt: string;
  updatedAt: string;
  uuid: string;
  facility: IFacilityMini;
  paymentStatus: "UNPAID" | "PAID" | "REFUNDED";
  paymentAmount: number | null;
  doctorId: number;
  patientId: number;
  scheduleId: number;
  attachments: any | null;
  facilityId: number;
  remark: string | null;
  bloodPressure: string | null;
  temperature: number | null;
  weight: number | null;
  height: number | null;
  medicalHistory: string | null;
  diagnosis: string | null;
  conclusion: string | null;
  heartRate: number | null;
  instruction: string | null;
  prescription: Prescription | null;
}

export interface IFacilityMini {
  id: number;
  name: string;
  address: string;
}

export interface IPatientDetailHistory {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  birthday: string;
  gender: string;
  avatar: string | null;
  address: string;
  cccd: string;
  bhyt: string | null;
}

export interface IAppointmentHistoryRes {
  data_history: IAppointmentHistoryItem[];
  patient: IPatientDetailHistory; // dùng type riêng cho lịch sử
  current_page: number;
  next_page_url: string | null;
  prev_page_url: string | null;
  per_page: number;
  total: number;
}
