import { Dayjs } from "dayjs";
export interface ISlot {
  startTime: string;
  endTime: string;
  selected: true;
  price?: number;
  selectedDate?: Dayjs;
}

export interface ISchedule {
  id: string;
  configName: string;
  workStartTime: string;
  workEndTime: string;
  slotDuration: number;
  price: number;
  daySchedules: {
    date: string;
    dayOfWeek: string;
    slots: ISlot[];
  }[];
  selectedDates: string[];
}
