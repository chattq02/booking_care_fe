import type { UserStatus } from "@/types/auth";
import type { IParams } from "@/types/params";

export interface IDoctorParams extends IParams {
  status?: UserStatus;
}
