"use client";

import * as React from "react";
import { CalendarIcon } from "lucide-react";
import { differenceInDays, format } from "date-fns";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import type { DateRange } from "react-day-picker";
import { toast } from "sonner";

export function DateRangePicker({
  className,
  value,
  onChange,
  maxDays = 30,
}: {
  className?: string;
  value?: DateRange;
  onChange?: (range: DateRange | undefined) => void;
  maxDays?: number;
}) {
  const [date, setDate] = React.useState<DateRange | undefined>(value);

  const handleSelect = (range: DateRange | undefined) => {
    if (range?.from && range?.to) {
      const diff = differenceInDays(range.to, range.from);
      if (diff > maxDays) {
        toast.error(`Khoảng thời gian không được vượt quá ${maxDays} ngày.`);
        return;
      }
    }
    setDate(range);
    onChange?.(range);
  };

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-fit justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className=" h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <div className="mt-0.5">
                  {format(date.from, "dd-MM-yyyy")} {" ---> "}
                  {format(date.to, "dd-MM-yyyy")}
                </div>
              ) : (
                format(date.from, "dd-MM-yyyy")
              )
            ) : (
              <span>Chọn khoảng ngày</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={handleSelect}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
