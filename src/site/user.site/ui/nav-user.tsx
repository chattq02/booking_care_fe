import { ChevronsUpDown, LogOut, User2, LogIn } from "lucide-react";

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
import { Button } from "@/components/ui/button";

import { PATH_ROUTE } from "../lib/enums/path";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { logOut } from "@/hooks/use-auth";
import { toast } from "sonner";
import { clearTokens } from "@/lib/actions/auth";
import { useSetAtom } from "jotai";
import { loadingAtom } from "@/stores/loading";

export function NavUser({
  user,
  isAuth,
}: {
  user: {
    name: string;
    email: string;
    avatar?: string;
  };
  isAuth: boolean;
}) {
  const nav = useNavigate();
  const setLoad = useSetAtom(loadingAtom);

  const mutation = useMutation({
    mutationFn: logOut,
    onSuccess: () => {
      toast.success("Đăng xuất thành công");
      clearTokens();
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    },
  });

  const handleLogout = () => {
    setLoad(true);
    mutation.mutate();
  };

  const handleLogin = () => {
    nav(PATH_ROUTE.LOGIN);
  };

  // Nếu chưa đăng nhập, hiển thị nút Đăng nhập
  if (!isAuth) {
    return (
      <Button
        onClick={handleLogin}
        variant="outline"
        className="flex items-center gap-2 cursor-pointer px-4 py-2 rounded-md hover:bg-gray-100 border"
      >
        <LogIn className="size-4" />
        <span>Đăng nhập</span>
      </Button>
    );
  }

  // Nếu đã đăng nhập, hiển thị dropdown user
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex items-center gap-2 cursor-pointer px-2 py-1 rounded-md hover:bg-gray-100 border">
          <Avatar className="h-8 w-8 rounded-lg">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback className="rounded-lg">
              {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
            </AvatarFallback>
          </Avatar>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-medium">{user.name}</span>
            <span className="truncate text-xs">{user.email}</span>
          </div>
          <ChevronsUpDown className="ml-auto size-4" />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg mr-6"
        side={"bottom"}
        align="start"
        sideOffset={8}
      >
        <DropdownMenuLabel className="p-0 font-normal">
          <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
            <Avatar className="h-8 w-8 rounded-lg">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="rounded-lg">
                {user.name ? user.name.charAt(0).toUpperCase() : "U"}
              </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">{user.name}</span>
              <span className="truncate text-xs">{user.email}</span>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => nav(`${PATH_ROUTE.PROFILE}`)}>
            <User2 className="mr-2 size-4" />
            Thông tin cá nhân
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className="mr-2 size-4" />
          Đăng xuất
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
