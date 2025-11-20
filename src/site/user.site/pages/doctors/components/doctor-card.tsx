import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { PATH_ROUTE } from "@/site/user.site/lib/enums/path";
import { Send } from "lucide-react";

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
    <Card className="shadow-none rounded-md hover:shadow-md hover:border gap-0 transition-all duration-300 border border-gray-100 hover:border-blue-100 p-2.5 sm:p-3 w-full bg-white hover:bg-linear-to-br hover:from-white hover:to-blue-50/30 ">
      <div
        className="flex gap-4 items-center cursor-pointer pb-2.5 group-hover:from-blue-500/5 group-hover:via-purple-500/3 group-hover:to-pink-500/5 transition-all duration-500 "
        onClick={() => nav(`${PATH_ROUTE.DOCTORS}/${id}`)}
      >
        <div className="w-25 h-28 group-hover:from-blue-500/10 group-hover:to-purple-500/10 rounded-md transition-all duration-300">
          <img
            src={imageUrl}
            alt={name}
            className="h-full w-full rounded-md object-cover"
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
      <div className="flex justify-between items-center gap-3 flex-wrap">
        <Button className="bg-main flex-1">Tạo lịch khám</Button>
        <Button variant="outline" className="bg-white flex-1">
          Chi tiết
        </Button>
        <Button variant="outline" className="bg-white flex-1">
          <Send />
        </Button>
      </div>
    </Card>
  );
}
