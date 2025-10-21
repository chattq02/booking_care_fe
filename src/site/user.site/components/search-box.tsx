import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export function SearchBox() {
  return (
    <div className="w-full">
      <Search className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground size-4" />
      <Input placeholder="Tìm kiếm..." className="pl-8" />
    </div>
  );
}
