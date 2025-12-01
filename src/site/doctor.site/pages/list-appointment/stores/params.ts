import dayjs, { Dayjs } from "dayjs";
import { parse, stringify } from "qs";
import { atomWithHash } from "jotai-location";

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

export const appointmentParamsAtom = atomWithHash<AppointmentParams>(
  "appointment_params",
  {
    page: 1,
    per_page: 100,
    appointmentDate: dayjs(),
    status: "PENDING",
  },
  {
    serialize: (value) => {
      // loại bỏ giá trị null, undefined, hoặc rỗng
      const cleaned = Object.fromEntries(
        Object.entries(value).filter(
          ([, v]) => v !== null && v !== undefined && v !== ""
        )
      );

      return stringify(cleaned, {
        addQueryPrefix: false,
        skipNulls: true,
        encode: true,
      });
    },

    deserialize: (str) => {
      const q = parse(str) as any;
      return {
        page: Number(q.page) || 1,
        per_page: Number(q.per_page) || 100,
        status: (q.status as AppointmentStatus) ?? "PENDING",
        appointmentDate: q.appointmentDate ?? "",
      };
    },
  }
);
