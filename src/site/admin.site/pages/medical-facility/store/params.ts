import { createParamsAtom } from "@/stores/params";
import type { IParams } from "@/types/params";

export interface MedicalFacilityParams extends IParams {
  status?: "All" | "Active" | "Inactive";
  id?: number | undefined;
  // add other params here
}

export const medicalFacilitiesParamsAtom =
  createParamsAtom<MedicalFacilityParams>("medical_facilities", {
    status: "All",
    id: undefined,
  });
