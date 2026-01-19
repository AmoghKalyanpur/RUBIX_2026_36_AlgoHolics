"use client";

import {
  LineChart,
  Bot,
  Newspaper,
  PanelLeft,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Button } from "../ui/button";

const navItems = [
  { href: "/dashboard/analysis", icon: LineChart, label: "Analysis" },
  { href: "/dashboard/live-news", icon: Newspaper, label: "Live News" },
  { href: "/dashboard/finbot", icon: Bot, label: "FinBot" },
];

export function SidebarNav({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <SidebarProvider>
      <Sidebar side="left" variant="sidebar" collapsible="icon">
        <SidebarHeader className="h-14 items-center justify-center p-2 text-primary-foreground group-data-[collapsible=icon]:h-10">
          <Link
            href="/"
            className="flex items-center gap-2 group-data-[collapsible=icon]:justify-center"
          >
            <LineChart className="size-6 shrink-0" />
            <span className="font-bold text-lg group-data-[collapsible=icon]:hidden">
              <span className="text-sidebar-ring">F</span>in<span className="text-sidebar-ring">S</span>ight
            </span>
          </Link>
        </SidebarHeader>
        <SidebarContent className="p-2">
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname.startsWith(item.href)}
                  tooltip={item.label}
                  className="justify-start"
                >
                  <Link href={item.href}>
                    <item.icon />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter className="p-2">
          {/* Footer content can go here */}
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-14 items-center justify-between border-b bg-background px-4">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="md:hidden" />
            <h1 className="text-lg font-semibold tracking-tight">
              {navItems.find((item) => pathname.startsWith(item.href))?.label}
            </h1>
          </div>
        </header>
        <main className="flex-1 overflow-auto p-4 md:p-6">
            {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
