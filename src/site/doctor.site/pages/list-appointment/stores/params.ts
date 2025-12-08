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
