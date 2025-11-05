import { parse, stringify } from "qs";
import type { UserStatus } from "@/types/auth";
import { atomWithHash } from "jotai-location";

export interface DoctorParams {
  keyword: string;
  page: number;
  per_page: number;
  status: UserStatus | "All";
}

export const doctorParamsAtom = atomWithHash<DoctorParams>(
  "doctor_params",
  {
    keyword: "",
    page: 1,
    per_page: 100,
    status: "Active",
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
        keyword: q.keyword ?? "",
        page: Number(q.page) || 1,
        per_page: Number(q.per_page) || 100,
        status: (q.status as UserStatus) ?? "All",
      };
    },
  }
);
