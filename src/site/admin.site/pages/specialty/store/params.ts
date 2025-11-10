import { createParamsAtom } from "@/stores/params";
import type { IParams } from "@/types/params";

export interface SpecialtyParams extends IParams {
  id: number | string | undefined;
  // add other params here
}

export const specialtyParamsAtom =
  createParamsAtom<SpecialtyParams>("specialty_params");
