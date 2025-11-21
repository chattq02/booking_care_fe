import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
} from "@/components/ui/breadcrumb";
import { useNavigate } from "react-router-dom";
import { PATH_ROUTE } from "../lib/enums/path";

export function BreadcrumbPath() {
  const nav = useNavigate();

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {/* Trang chủ */}
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <div
              className="font-bold text-[30px] text-[#5ca2b9] flex-1 cursor-pointer"
              onClick={() => nav(`${PATH_ROUTE.HOME}`)}
            >
              Booking Care
            </div>
          </BreadcrumbLink>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
