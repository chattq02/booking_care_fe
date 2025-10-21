import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Plus, Send } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { PATH_ROUTE } from "@/site/user.site/libs/enum/path";

interface DoctorCardProps {
  id: string;
  name: string;
  specialty: string;
  role?: string;
  imageUrl: string;
}

export function DoctorCard({
  id,
  name,
  specialty,
  role = "Bác sĩ",
  imageUrl,
}: DoctorCardProps) {
  const nav = useNavigate();

  return (
    <Card className="shadow-none rounded-xl hover:shadow-md transition-all border-none py-0 gap-0">
      <div
        className="flex p-3 gap-4 items-center cursor-pointer"
        onClick={() => nav(`${PATH_ROUTE.DOCTORS}/${id}`)}
      >
        <div className="w-22 h-22">
          <img
            src={imageUrl}
            alt={name}
            className="h-full w-full rounded-full object-cover"
          />
        </div>

        <div className="p-0">
          <Badge
            variant="secondary"
            className="w-fit text-xs font-medium bg-[#e0e5eb] text-[#455768]"
          >
            {role}
          </Badge>

          <div className="mt-1 font-semibold text-[#101519] line-clamp-2 text-[13px]">
            {name}
          </div>
          <div className="mt-1 text-[13px] text-[#455768]">{specialty}</div>
        </div>
      </div>
      <Separator className="mr-2 data-[orientation=vertical]:h-4" />
      <div className="flex justify-end items-center gap-2 p-2 mr-2">
        <Button variant="outline" className="bg-white">
          <Plus /> Tạo lịch khám
        </Button>
        <Button className="bg-[#01aaa8]">
          <Send />
          Liên hệ
        </Button>
      </div>
    </Card>
  );
}
