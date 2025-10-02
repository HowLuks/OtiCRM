'use client';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarTrigger,
  SidebarFooter
} from "@/components/ui/sidebar";
import { NavMenu } from "./nav-menu";
import { Shapes } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export function AppSidebar() {
  return (
    <>
      <SidebarHeader>
        <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Shapes className="h-6 w-6" />
            </div>
            <span className="text-lg font-semibold">OtiCRM</span>
            <div className="flex-1" />
            <SidebarTrigger className="hidden md:flex" />
        </div>
      </SidebarHeader>
      <SidebarContent className="p-2">
        <NavMenu />
      </SidebarContent>
      <SidebarFooter>
        <div className="flex items-center gap-3 rounded-md p-2 hover:bg-sidebar-accent">
            <Avatar className="h-9 w-9">
                <AvatarImage src="https://picsum.photos/seed/user/40/40" alt="User Avatar" data-ai-hint="person avatar" />
                <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <div className="flex flex-col text-sm">
                <span className="font-semibold">João Doria</span>
                <span className="text-muted-foreground">joao.doria@example.com</span>
            </div>
        </div>
      </SidebarFooter>
    </>
  );
}
