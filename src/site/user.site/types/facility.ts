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
  isActive: "Active" | "Inactive" | string; // tuỳ backend
  isParent: boolean;
  parentId: number | null;
  createdAt: string; // hoặc Date nếu bạn parse
  updatedAt: string; // hoặc Date nếu bạn parse
}
