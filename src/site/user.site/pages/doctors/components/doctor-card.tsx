import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { PATH_ROUTE } from "@/site/user.site/lib/enums/path";
import { Send } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getFirstLetter } from "@/helpers/helper";

interface DoctorCardProps {
  id: string | number;
  name: string;
  specialty: {
    id: string | number;
    name: string;
  }[];
  role?: string;
  imageUrl: string | null;
  facilities: {
    id: string | number;
    name: string;
  }[];
}

export function DoctorCard({
  id,
  name,
  specialty,
  role = "Bác sĩ",
  imageUrl,
  facilities,
}: DoctorCardProps) {
  const nav = useNavigate();

  return (
    <Card className="shadow-none rounded-md hover:shadow-md hover:border gap-0 transition-all duration-300 border border-gray-100 hover:border-blue-100 p-2.5 sm:p-3 w-full bg-white hover:bg-linear-to-br hover:from-white hover:to-blue-50/30 ">
      <div
        className="flex gap-4 items-center cursor-pointer pb-2.5 group-hover:from-blue-500/5 group-hover:via-purple-500/3 group-hover:to-pink-500/5 transition-all duration-500 "
        onClick={() => nav(`${PATH_ROUTE.DOCTORS}/${id}`)}
      >
        <div className="w-28 h-30 group-hover:from-blue-500/10 group-hover:to-purple-500/10 rounded-md transition-all duration-300">
          <Avatar className="h-full w-full rounded-md! object-cover">
            <AvatarImage src={imageUrl ?? ""} alt={name} />
            <AvatarFallback className="h-full w-full rounded-md! object-cover text-[30px] font-bold bg-[#d4f3ee]">
              {getFirstLetter(name ?? "")}
            </AvatarFallback>
          </Avatar>
        </div>

        <div className="p-0 flex-1">
          <Badge
            variant="secondary"
            className="w-fit text-xs font-medium bg-[#e0e5eb] text-[#455768]"
          >
            {role}
          </Badge>

          <div className="mt-1 font-bold text-[#101519] line-clamp-2 text-[16px]">
            {name}
          </div>
          <div className="mt-1 line-clamp-1">
            {facilities &&
              facilities.length > 0 &&
              facilities.map((item) => {
                return (
                  <div
                    className="text-[13px] font-semibold text-[#455768]"
                    key={item.id}
                  >
                    {item.name.trim()}
                  </div>
                );
              })}
          </div>
          <div className="line-clamp-2">
            {specialty && specialty.length > 0 && (
              <div className="mt-1">
                {specialty.map((item) => (
                  <div className="text-[13px] text-[#455768]" key={item.id}>
                    {item.name}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="flex justify-between items-center gap-3 flex-wrap">
        <Button
          className="bg-main flex-1 cursor-pointer"
          onClick={() => nav(`${PATH_ROUTE.DOCTORS}/${id}/?tab=schedule`)}
        >
          Tạo lịch khám
        </Button>
        <Button variant="outline" className="bg-white flex-1">
          <Send />
        </Button>
      </div>
    </Card>
  );
}
