import type {
  HospitalScheduleFormValues,
  WorkShift,
} from "./components/modal/modal-schedule-facility";
import type { ISlots } from "./type";
import dayjs, { Dayjs } from "dayjs";

export const convertDataToFormValues = (
  data: ISlots | undefined
): HospitalScheduleFormValues => {
  if (!data) return { dayOfWeek: [], workShifts: [] };

  // Lấy tất cả các ngày, kể cả ngày không có ca
  const daysWithData = Object.keys(data);

  // Lấy dữ liệu của ngày đầu tiên có ca để map workShifts
  const firstDayWithSlots = daysWithData.find(
    (day) => data[day] && data[day].length > 0
  );
  const firstDaySessions = firstDayWithSlots ? data[firstDayWithSlots] : [];

  const workShifts: WorkShift[] = firstDaySessions.map((session) => ({
    session: session.session as "morning" | "afternoon" | "evening",
    range: [
      dayjs(session.startTime, "HH:mm"),
      dayjs(session.endTime, "HH:mm"),
    ] as [Dayjs, Dayjs],
  }));

  return {
    dayOfWeek: daysWithData, // sẽ bao gồm cả 'sunday'
    workShifts, // [] nếu không có ca
  };
};

export const convertFormValuesToSlots = (formValues: {
  dayOfWeek: string[];
  workShifts: WorkShift[];
}) => {
  const result: Record<string, any> = {};

  formValues.dayOfWeek.forEach((day) => {
    result[day] = formValues.workShifts.map((shift) => ({
      session: shift.session as "morning" | "afternoon" | "evening",
      startTime: shift.range[0]?.format("HH:mm") || "",
      endTime: shift.range[1]?.format("HH:mm") || "",
    }));
  });

  return result;
};

export const mergeEditIntoDetail = (
  detail: ISlots | undefined,
  dataEdit: ISlots
): ISlots => {
  const result: ISlots = { ...detail };

  Object.entries(dataEdit).forEach(([key, value]) => {
    // Nếu key tồn tại → thay thế, nếu không → thêm mới
    result[key] = value;
  });

  return result;
};
