import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const stats = [
  {
    title: "TỔNG BÁC SĨ",
    value: "100",
  },
  {
    title: "TỔNG DOANH THU",
    value: "$1,250.00",
  },
  {
    title: "TỔNG LƯỢT KHÁM",
    value: "1,234",
  },
  {
    title: "TỔNG LỊCH HẸN BỊ HỦY",
    value: "45,678",
  },
];

export default function DashboardStats() {
  return (
    <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-4">
      {stats.map((item) => (
        <Card
          key={item.title}
          className="rounded-2xl shadow-none hover:shadow-md transition-all border gap-2"
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="flex items-center gap-2 text-[16px] font-bold">
              <div className="h-6 w-[5px] bg-amber-200 rounded" />
              {item.title}
            </CardTitle>
          </CardHeader>

          <CardContent className="m-auto">
            <div className="text-3xl font-bold text-[#1C6EFC]">
              {item.value}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
