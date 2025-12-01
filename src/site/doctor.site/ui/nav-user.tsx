import { ChevronsUpDown, LogOut, User2 } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import { useNavigate } from "react-router-dom";

import { useMemo } from "react";
import { useMutation } from "@tanstack/react-query";
import { logOut } from "@/hooks/use-auth";
import { clearTokens } from "@/lib/actions/auth";
import { toast } from "sonner";
import { useAtomValue, useSetAtom } from "jotai";
import { loadingAtom } from "@/stores/loading";
import { userAtom } from "@/stores/auth";
import { getFirstLetter } from "@/helpers/helper";
import { PATH_ROUTE_DOCTOR } from "../lib/enums/path";

export function NavUser() {
  const user = useAtomValue(userAtom);
  const nav = useNavigate();

  const setLoad = useSetAtom(loadingAtom);

  const avatar = useMemo(() => {
    return (
      <Avatar>
        <AvatarImage src={user?.fullName ?? ""} alt={user?.fullName} />
        <AvatarFallback>{getFirstLetter(user?.fullName ?? "")}</AvatarFallback>
      </Avatar>
    );
  }, [user?.fullName]);

  const mutation = useMutation({
    mutationFn: logOut,
    onSuccess: () => {
      toast.success("Đăng xuất thành công");
      clearTokens();
      setTimeout(() => {
        setLoad(false);
        window.location.href = PATH_ROUTE_DOCTOR.LOGIN;
      }, 500);
    },
  });

  const handleLogout = () => {
    setLoad(true);
    mutation.mutate();
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground flex-1 border"
            >
              {avatar}
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">
                  {user?.fullName ?? ""}
                </span>
                <span className="truncate text-xs">{user?.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg mr-6"
            side={"bottom"}
            align="start"
            sideOffset={8}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                {avatar}
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user?.fullName}</span>
                  <span className="truncate text-xs">{user?.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem
                onClick={() => nav(`${PATH_ROUTE_DOCTOR.HOME}`)}
              >
                <User2 />
                Thông tin các nhân
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
