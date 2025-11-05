import { parse, stringify } from "qs";
import { atomWithHash } from "jotai-location";
import type { IParams } from "@/types/params";

export const createParamsAtom = (key: string) =>
  atomWithHash<IParams>(
    key,
    {
      keyword: "",
      page: 1,
      per_page: 100,
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
          encode: false,
        });
      },

      deserialize: (str) => {
        const q = parse(str) as any;
        return {
          keyword: q.keyword ?? "",
          page: Number(q.page) || 1,
          per_page: Number(q.per_page) || 100,
        };
      },
    }
  );
