import { ChevronRight } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: React.ReactNode;
    isActive?: boolean;
    isCollapsed?: boolean;
    items?: {
      name: string;
      icon: React.ReactNode;
      link: string;
    }[];
  }[];
}) {
  const nav = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <SidebarGroup>
      <SidebarMenu>
        {items.map((item) => {
          const hasChildren = (item.items?.length ?? 0) > 0;
          const isActiveLink = currentPath === item.url;

          return (
            <div key={item.title}>
              <Collapsible
                key={item.title}
                asChild
                defaultOpen={item.isActive}
                className="group/collapsible"
                open={item.isCollapsed}
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton
                      tooltip={item.title}
                      onClick={() => {
                        if (!hasChildren) nav(item.url);
                      }}
                      className={`flex items-center gap-2 hover:bg-muted mb-2 ${
                        isActiveLink
                          ? "bg-[#9afaeb] text-primary font-bold"
                          : "hover:bg-muted"
                      }`}
                    >
                      <div>{item.icon}</div>
                      <span className="text-[16px] font-bold">
                        {item.title}
                      </span>
                      {hasChildren && (
                        <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                      )}
                    </SidebarMenuButton>
                  </CollapsibleTrigger>

                  {hasChildren && (
                    <CollapsibleContent>
                      <SidebarMenuSub className="mb-2">
                        {item?.items?.map((subItem) => {
                          const isActiveSub = currentPath.includes(
                            subItem.link
                          );
                          return (
                            <SidebarMenuSubItem key={subItem.name}>
                              <SidebarMenuSubButton
                                asChild
                                className={`h-10 px-4 gap-3 cursor-pointer ${
                                  isActiveSub
                                    ? "bg-[#9afaeb] text-primary font-bold"
                                    : "hover:bg-muted"
                                }`}
                                onClick={() => nav(subItem.link)}
                              >
                                <div className="flex items-center gap-2">
                                  <div>{subItem.icon}</div>
                                  <span className="text-[14px] font-semibold">
                                    {subItem.name}
                                  </span>
                                </div>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          );
                        })}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  )}
                </SidebarMenuItem>
              </Collapsible>
              <Separator className="data-[orientation=vertical]:h-1" />
            </div>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
