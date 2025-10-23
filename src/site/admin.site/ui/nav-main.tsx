import { ChevronRight } from "lucide-react";

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
import { useNavigate } from "react-router-dom";
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
  return (
    <>
      <SidebarGroup>
        <SidebarMenu>
          {items.map((item) => (
            <>
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
                      onClick={() => nav(item.url)}
                    >
                      <div>{item.icon}</div>
                      <span className="text-[16px] font-bold">
                        {item.title}
                      </span>
                      {(item.items?.length ?? 0) > 0 && (
                        <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                      )}
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.items?.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.name}>
                          <SidebarMenuSubButton
                            asChild
                            className="h-10 px-4 gap-3 cursor-pointer"
                            onClick={() => nav(subItem.link)}
                          >
                            <div>
                              <div>{subItem.icon}</div>
                              <span className="text-[14px] font-bold">
                                {subItem.name}
                              </span>
                            </div>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
              <Separator className=" data-[orientation=vertical]:h-1" />
            </>
          ))}
        </SidebarMenu>
      </SidebarGroup>
    </>
  );
}
