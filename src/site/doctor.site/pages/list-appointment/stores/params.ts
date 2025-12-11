import dayjs, { Dayjs } from "dayjs";

import { createParamsAtom } from "@/stores/params";
import type { IParams } from "@/types/params";

export type AppointmentStatus =
  | "PENDING"
  | "CONFIRMED"
  | "COMPLETED"
  | "CANCELED";

export interface AppointmentParams {
  page: number;
  per_page: number;
  status: AppointmentStatus;
  appointmentDate: Dayjs | null | string;
}

export interface AppointmentParams extends IParams {
  status: AppointmentStatus;
  appointmentDate: Dayjs | null | string;
}

export const appointmentParamsAtom = createParamsAtom<AppointmentParams>(
  "apointment-params",
  {
    status: "PENDING",
    appointmentDate: dayjs().format("YYYY-MM-DD"), // Luôn có giá trị
  }
);

export interface AppointmentReportParams {
  fromDate: string;
  toDate: string;
}

export interface AppointmentParamsDasboard extends IParams {
  status: AppointmentStatus;
  fromDate: Dayjs | null | string;
  toDate: Dayjs | null | string;
}

export interface AppointmentCurrentNextPatientParams {
  doctorId: number | null;
  appointmentDate: Dayjs | null | string;
}

export interface AppointmentCompletedPaidParams {
  doctorId?: number;
  patientId?: number;
  fromDate?: string;
  toDate?: string;
  page?: number;
  per_page?: number;
  keyword: string;
}

export interface AppointmentUserFindParams {
  page?: number;
  per_page?: number;
  status?: AppointmentStatus;
}
