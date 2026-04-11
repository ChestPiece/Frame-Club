"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  LayoutDashboard,
  Package,
  ShoppingCart,
  UserRound,
} from "lucide-react";
import { logout } from "@/app/admin/login/actions";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { href: "/admin/products", label: "Products", icon: Package },
];

function isActive(pathname: string, href: string) {
  if (href === "/admin") {
    return pathname === href;
  }

  return pathname.startsWith(href);
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <SidebarProvider defaultOpen>
      <Sidebar className="border-r border-border-dark bg-bg-recessed" collapsible="icon" variant="sidebar">
        <SidebarHeader className="gap-1 border-b border-border-dark px-6 py-6 group-data-[collapsible=icon]:px-2">
          <p className="technical-label text-xl tracking-[0.08em] text-text-primary group-data-[collapsible=icon]:text-sm">THE FRAME CLUB</p>
          <p className="text-[10px] uppercase tracking-[0.26em] text-text-muted group-data-[collapsible=icon]:hidden">Admin Core</p>
        </SidebarHeader>

        <SidebarContent className="px-2 py-4">
          <SidebarMenu className="gap-1">
            {navItems.map((item) => {
              const active = isActive(pathname, item.href);
              const Icon = item.icon;

              return (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    render={<Link href={item.href} />}
                    size="lg"
                    isActive={active}
                    tooltip={item.label}
                    className={`display-kicker h-11 border-l-[3px] border-transparent px-4 text-[10px] tracking-[0.2em] ${
                      active
                        ? "border-brand-mid bg-brand text-text-primary"
                        : "bg-transparent text-text-muted hover:bg-bg-surface hover:text-text-primary"
                    }`}
                  >
                    <Icon className="h-4 w-4" strokeWidth={1.5} />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarContent>

        <SidebarFooter className="border-t border-border-dark px-4 py-4 group-data-[collapsible=icon]:hidden">
          <div className="border border-border-dark/60 bg-bg-surface p-3">
            <p className="text-[10px] uppercase tracking-[0.2em] text-text-primary">System Admin</p>
            <p className="mt-1 text-[10px] text-text-muted">v2.4.1 Active</p>
          </div>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset className="min-h-screen bg-bg-base text-text-primary">
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-border-dark bg-bg-base/85 px-6 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <SidebarTrigger className="text-text-muted hover:text-text-primary" />
            <p className="technical-label text-xs text-text-primary">ADMIN CORE</p>
          </div>

          <div className="flex items-center gap-3">
            <Button type="button" variant="ghost" size="icon" className="relative text-text-muted hover:text-text-primary" aria-label="Notifications">
              <Bell className="h-4 w-4" strokeWidth={1.5} />
              <span className="absolute right-1 top-1 h-1.5 w-1.5 bg-brand-mid" />
            </Button>

            <span className="hidden text-xs text-text-muted md:inline">Superuser Mode</span>

            <DropdownMenu>
              <DropdownMenuTrigger
                render={<Button variant="outline" size="sm" className="display-kicker gap-2 border-border-dark text-[10px]" />}
              >
                <UserRound className="h-4 w-4" strokeWidth={1.5} />
                Account
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="min-w-52">
                <DropdownMenuItem render={<Link href="/" />}>Storefront</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem disabled>Signed in as Admin</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <form action={logout} className="w-full">
                    <button type="submit" className="w-full text-left">Sign Out</button>
                  </form>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <main className="p-8">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
