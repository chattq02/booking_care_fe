import type { IParams } from "@/types/params";

export type TActive = "Active" | "Inactive";

export interface ResponseMedicalFacility {
  id: number;
  uuid: string;
  name: string;
  code: string;
  address: string;
  phone: string;
  email: string;
  website: string | null;
  description: string;
  province: string;
  district: string;
  ward: string;
  imageUrl: string;
  isActive: TActive; // nếu chỉ có 2 trạng thái
  createdAt: Date; // ISO Date string
  updatedAt: Date; // ISO Date string
}

type ScheduleType = "DOCTOR" | "DEPARTMENT" | "FACILITY";
type ScheduleStatus = "NORMAL" | "OFF" | "FIXED";

export interface ScheduleParams extends IParams {
  type?: ScheduleType;
  id: number | undefined;
}

export interface ResponseSchedule {
  id: number;
  doctorId: number | null;
  facilityId: number | null;
  departmentId: number | null;
  date: string | null;
  slots: ISlots; // đã parse JSON string từ DB
  type: ScheduleType;
  status: ScheduleStatus;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}

export interface ISession {
  startTime: string; // "HH:mm"
  endTime: string; // "HH:mm"
  session: "morning" | "afternoon" | "evening";
}

export interface ISlots {
  [key: string]: ISession[];
}

export interface IWorkSchedule {
  type: ScheduleType;
  slots: unknown;
  status: ScheduleStatus;
  doctorId?: number;
  facilityId?: number;
  departmentId?: number;
}

export type Shift = {
  session: string;
  startTime: string;
  endTime: string;
};

export type Slots = Record<string, Shift[]>;

interface SlotData {
  startTime: string;
  endTime: string;
  selected: boolean;
}

interface DaySchedule {
  date: string;
  dayOfWeek: string;
  slots: SlotData[];
}

interface ScheduleConfig {
  id: string;
  configName: string;
  workStartTime: string;
  workEndTime: string;
  slotDuration: number;
  price: number;
  daySchedules: DaySchedule[];
  selectedDates: string[];
}

export interface ScheduleDataDoctor {
  slots: ScheduleConfig[];
  id: number;
  type: string;
  status: string;
}
