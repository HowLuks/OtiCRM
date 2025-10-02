'use client';
import {
  SidebarContent,
  SidebarHeader,
  SidebarTrigger,
  SidebarFooter
} from "@/components/ui/sidebar";
import { NavMenu } from "./nav-menu";
import { Shapes } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useUser } from "@/firebase";

export function AppSidebar() {
  const { user } = useUser();

  const getInitials = (name: string | null | undefined, fallback: string) => {
    if (name) {
      const names = name.split(' ');
      if (names.length > 1) {
        return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
      }
      return name.substring(0, 2).toUpperCase();
    }
    return fallback.substring(0, 2).toUpperCase();
  }

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
      {user && (
        <SidebarFooter>
            <div className="flex items-center gap-3 rounded-md p-2 hover:bg-sidebar-accent">
                <Avatar className="h-9 w-9">
                    {user.photoURL && <AvatarImage src={user.photoURL} alt="User Avatar" data-ai-hint="person avatar" />}
                    <AvatarFallback>{getInitials(user.displayName, user.email || 'U')}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col text-sm truncate">
                    <span className="font-semibold truncate">{user.displayName || 'Usuário'}</span>
                    <span className="text-muted-foreground truncate">{user.email}</span>
                </div>
            </div>
        </SidebarFooter>
      )}
    </>
  );
}
