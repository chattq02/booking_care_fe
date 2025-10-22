import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Empty, EmptyHeader, EmptyTitle } from "@/components/ui/empty";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { DatePicker } from "@/site/user.site/ui/date-picker";
import {
  CalendarDays,
  Clock,
  MapPin,
  MegaphoneOff,
  PenLine,
  Trash2,
} from "lucide-react";

export default function AppointmentSchedule() {
  const appointments = [
    {
      id: 1,
      day: "Thứ 2",
      date: 14,
      month: "June 2023",
      doctor: "Dr. Ashton Cleve",
      time: "10:00am - 10:30am",
      active: true,
    },
    {
      id: 2,
      day: "Thứ 3",
      date: 15,
      month: "June 2023",
      doctor: "Dr. Ashton Cleve",
      time: "10:00am - 10:30am",
      active: false,
    },
  ];
  return (
    <Card className="flex-1 rounded-lg shadow-none border pt-5">
      <CardHeader className="flex flex-col space-y-2">
        <div className="flex items-center  justify-between w-full">
          <CardTitle className="text-[20px] font-bold flex items-center gap-3">
            <div>
              <CalendarDays />
            </div>
            <div className="text-main">Lịch hẹn của tôi</div>
          </CardTitle>
          <div className="flex items-center justify-between">
            <DatePicker />
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col h-[calc(100vh-228px)] gap-4 overflow-y-auto">
        {appointments?.length === 0 ? (
          <div className="text-center text-gray-500 py-10 m-auto">
            <Empty>
              <EmptyHeader>
                <div>
                  <MegaphoneOff size={50} />
                </div>
                <EmptyTitle>Không có lịch hẹn nào.</EmptyTitle>
              </EmptyHeader>
            </Empty>
          </div>
        ) : (
          appointments?.map((item) => (
            <div
              key={item.id}
              className={cn(
                "flex items-center justify-start gap-5 p-3 rounded-xl border transition-all",
                item.active
                  ? "bg-red-50 border-red-100 hover:bg-red-100"
                  : "bg-green-50 border-green-100 hover:bg-green-100"
              )}
            >
              <div
                className={cn(
                  "flex items-center justify-center px-3 gap-3 py-2 rounded-lg text-sm font-medium w-[90px] h-[90px] bg-white border",
                  item.active ? "text-red-800" : "text-green-800"
                )}
              >
                <div className="flex flex-col items-center">
                  <span>{item.day}</span>
                  <span className="text-[30px] font-bold">{item.date}</span>
                </div>
              </div>
              <Separator orientation="vertical" />
              <div className="flex items-center justify-start gap-4">
                <div className="w-22 h-22">
                  <img
                    src={
                      "https://hoangphucphoto.com/wp-content/uploads/2024/01/anh-nt-4-1024x1024.jpeg"
                    }
                    alt={""}
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
                <div className="flex flex-col space-y-2">
                  <span className="font-bold text-[20px] text-gray-900 line-clamp-1">
                    {item.doctor}
                  </span>
                  <div className="flex items-center gap-2">
                    <div>
                      <Clock size={20} />
                    </div>
                    <div className="text-sm text-gray-500">{item.time}</div>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <div>
                      <MapPin size={20} />
                    </div>
                    <span className="text-sm text-gray-500 line-clamp-1">
                      {item.month}
                    </span>
                  </div>
                </div>
              </div>
              <div className="ml-auto flex flex-col gap-2.5">
                <Button
                  variant="outline"
                  className="bg-white cursor-pointer text-red-500"
                >
                  <Trash2 />
                  Hủy lịch
                </Button>
                <Button className="bg-main cursor-pointer">
                  <PenLine />
                  Đổi lịch
                </Button>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
