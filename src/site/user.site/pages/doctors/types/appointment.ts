export interface IAppointment {
  id: number;
  uuid: string;
  doctorId: number;
  patientId: number;
  scheduleId: number;
  status: "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELED";
  note?: string | null;

  // Thông tin quan hệ (có thể optional nếu backend không trả đầy đủ)
  doctor?: {
    id: number;
    fullName: string;
    email?: string;
    phone?: string;
  };
  patient?: {
    id: number;
    fullName: string;
    email?: string;
    phone?: string;
  };
  schedule?: {
    id: number;
    date: string; // YYYY-MM-DD
    startTime: string; // HH:mm
    endTime: string; // HH:mm
  };
  prescription?: {
    id: number;
    uuid: string;
    note?: string | null;
  };

  createdAt: string; // ISO datetime
  updatedAt: string; // ISO datetime
}

export interface ICreateAppointment {
  doctorId: number;
  slotId: string;
  note?: string;
}
