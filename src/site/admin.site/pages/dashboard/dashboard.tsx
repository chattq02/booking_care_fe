import { DateRangePicker } from "@/components/date-range-box/date-range-box";
import { ChartBarDefault } from "./components/chart-bar-report";
import DashboardStats from "./components/stats-report";
import { SelectV1 } from "@/components/select/selectV1";
import { useState } from "react";
import type { DateRange } from "react-day-picker";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  const [range, setRange] = useState<DateRange | undefined>();
  return (
    <div className="flex flex-col flex-1 gap-4 h-10 py-5 px-5">
      <div className="bg-white rounded-lg p-2.5 w-fit flex gap-4 mx-auto flex-wrap justify-center">
        <SelectV1
          items={[
            { label: "Apple", value: "apple" },
            { label: "Banana", value: "banana" },
            { label: "Blueberry", value: "blueberry" },
            { label: "Grapes", value: "grapes" },
            { label: "Pineapple", value: "pineapple" },
          ]}
        />
        <SelectV1
          items={[
            { label: "Apple", value: "apple" },
            { label: "Banana", value: "banana" },
            { label: "Blueberry", value: "blueberry" },
            { label: "Grapes", value: "grapes" },
            { label: "Pineapple", value: "pineapple" },
          ]}
        />
        <DateRangePicker value={range} onChange={setRange} />
        <Button className="bg-main cursor-pointer">Thống kê</Button>
      </div>
      <DashboardStats />
      <ChartBarDefault />
    </div>
  );
}
