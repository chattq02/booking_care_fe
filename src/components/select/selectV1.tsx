import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useEffect } from "react";
import { useInView } from "react-intersection-observer";

interface SelectItemData {
  label: string;
  value: string;
}

interface SelectCustomProps {
  label?: string;
  placeholder?: string;
  items: SelectItemData[];
  className?: string;
  onChange?: (value: string) => void;
  value?: string;
  batchSize?: number;
}

export function SelectV1({
  label,
  placeholder = "Select an option",
  items,
  className,
  onChange,
  value,
  batchSize = 20,
}: SelectCustomProps) {
  const [visibleCount, setVisibleCount] = useState(batchSize);
  const { ref, inView } = useInView({ threshold: 0.2 });

  // Khi inView (cuộn tới cuối danh sách) → load thêm batch
  useEffect(() => {
    if (inView && visibleCount < items.length) {
      setVisibleCount((prev) => Math.min(prev + batchSize, items.length));
    }
  }, [inView, visibleCount, items.length, batchSize]);

  return (
    <Select onValueChange={onChange} value={value}>
      <SelectTrigger className={className || "w-[180px]"}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>

      <SelectContent className="max-h-[300px] overflow-y-auto">
        <SelectGroup>
          {label && <SelectLabel>{label}</SelectLabel>}
          {items.slice(0, visibleCount).map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}

          {/* Sentinel để detect khi cuộn gần cuối */}
          {visibleCount < items.length && (
            <div ref={ref} className="py-2 text-center text-gray-400 text-xs">
              Loading more...
            </div>
          )}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
