export type TActive = "Active" | "Inactive";

export interface ResponseMedicalFacility {
  id: number;
  uuid: string;
  name: string;
  code: string;
  address: string;
  phone: string;
  email: string;
  website: string | null;
  description: string;
  province: string;
  district: string;
  ward: string;
  imageUrl: string;
  isActive: TActive; // nếu chỉ có 2 trạng thái
  createdAt: Date; // ISO Date string
  updatedAt: Date; // ISO Date string
}
