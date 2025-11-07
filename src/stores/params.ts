import { parse, stringify } from "qs";
import { atomWithHash } from "jotai-location";
import type { IParams } from "@/types/params";

export const createParamsAtom = <T extends IParams = IParams>(
  key: string,
  defaultParams?: Partial<T>
) =>
  atomWithHash<T>(
    key,
    {
      keyword: "",
      page: 1,
      per_page: 50,
      ...(defaultParams || {}),
    } as T,
    {
      serialize: (value) => {
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
        const q = parse(str) as Record<string, any>;
        return {
          keyword: q.keyword ?? "",
          page: Number(q.page) || 1,
          per_page: Number(q.per_page) || 50,
          ...q, // 👈 giữ lại mọi param bổ sung (vd: status, categoryId,...)
        } as T;
      },
    }
  );
