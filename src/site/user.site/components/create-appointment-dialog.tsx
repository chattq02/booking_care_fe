import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";

export function DialogCreateAppointment() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-main w-full">
          <Plus />
          Tạo lịch khám
        </Button>
      </DialogTrigger>
      <DialogContent className="pt-2">
        <DialogHeader>
          <DialogTitle className="text-[24px]">Tạo lịch khám</DialogTitle>
        </DialogHeader>
        <div className="flex items-center gap-2">
          <div className="grid flex-1 gap-2">
            <Input
              id="link"
              defaultValue="https://ui.shadcn.com/docs/installation"
              readOnly
            />
          </div>
        </div>
        <DialogFooter className="sm:justify-end">
          <Button type="submit" variant="default">
            Đặt lịch
          </Button>
          <DialogClose asChild>
            <Button type="submit" variant="secondary">
              Đóng
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
