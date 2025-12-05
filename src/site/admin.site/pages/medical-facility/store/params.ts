import { createParamsAtom } from "@/stores/params";
import type { UserStatus } from "@/types/auth";
import type { IParams } from "@/types/params";

export interface MedicalFacilityParams extends IParams {
  status?: UserStatus | "All";
  id?: number | undefined;
  // add other params here
}

export const medicalFacilitiesParamsAtom =
  createParamsAtom<MedicalFacilityParams>("medical_facilities", {
    status: "All",
    id: undefined,
  });

export interface MedicineParams extends IParams {
  facilityId: number;
}
