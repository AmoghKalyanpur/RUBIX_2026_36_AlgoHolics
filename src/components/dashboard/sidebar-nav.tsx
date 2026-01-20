'use client';

import {
  LineChart,
  Bot,
  Newspaper,
  FileText,
  Bell,
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
import { ThemeToggle } from "@/components/theme-toggle";

const mainNavItems = [
  { href: "/dashboard/analysis", icon: LineChart, label: "Analysis" },
  { href: "/dashboard/live-news", icon: Newspaper, label: "Live News" },
  { href: "/dashboard/finbot", icon: Bot, label: "FinBot" },
  { href: "/dashboard/analysis", icon: FileText, label: "Generate Reports" },
];

const footerNavItems = [
  { href: "/dashboard/analysis", icon: Bell, label: "Notifications" },
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
        <SidebarContent className="p-2 flex flex-col justify-between">
          <SidebarMenu>
            {mainNavItems.map((item) => (
              <SidebarMenuItem key={item.href + item.label}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname.startsWith(item.href) && item.label !== 'Generate Reports'}
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
          <SidebarMenu>
              {footerNavItems.map((item) => (
              <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton
                  asChild
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
              <SidebarMenuItem>
                <div className="flex justify-start w-full">
                  <ThemeToggle />
                </div>
              </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-14 items-center justify-between border-b bg-background px-4">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="md:hidden" />
          </div>
        </header>
        <main className="flex-1 overflow-auto p-4 md:p-6">
            {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
