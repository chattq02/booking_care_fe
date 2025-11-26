import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { PATH_ROUTE } from "@/site/user.site/lib/enums/path";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getFirstLetter } from "@/helpers/helper";

interface FacilityCardProps {
  id: string | number;
  name: string;
  address: string;
  imageUrl: string | null;
  phone: string | null;
}

export function FacilityCard({
  id,
  name,
  imageUrl,
  address,
  phone,
}: FacilityCardProps) {
  const nav = useNavigate();

  return (
    <Card className="shadow-none rounded-md hover:shadow-md hover:border gap-0 transition-all duration-300 border border-gray-100 hover:border-blue-100 p-2.5 sm:p-3 w-full bg-white hover:bg-linear-to-br hover:from-white hover:to-blue-50/30 ">
      <div
        className="flex gap-4 items-center cursor-pointer  group-hover:from-blue-500/5 group-hover:via-purple-500/3 group-hover:to-pink-500/5 transition-all duration-500 "
        onClick={() => nav(`${PATH_ROUTE.FACILITYDETAIL}/${id}`)}
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
          <div className="mt-1 font-bold text-[#101519] line-clamp-2 text-[16px]">
            {name}
          </div>
          <div className="mt-1 line-clamp-2 text-[13px] text-[#455768] font-semibold">
            {address}
          </div>
          <div className="line-clamp-2">
            <div className="mt-1">
              <div className="text-[13px] text-[#455768]">
                Hotline: {phone ?? "_"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
