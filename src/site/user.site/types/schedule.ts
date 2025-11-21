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
    slots: {
      startTime: string;
      endTime: string;
      selected: true;
    }[];
  }[];
  selectedDates: string[];
}
