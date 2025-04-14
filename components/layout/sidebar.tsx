"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { LogOut, Users, QrCode, CreditCard, Settings, BarChart } from "lucide-react";
import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import { ModeToggle } from "./mood-toggler";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: BarChart },
  { name: "Members", href: "/members", icon: Users },
  { name: "Check-in", href: "/check-in", icon: QrCode },
  { name: "Subscriptions", href: "/subscriptions", icon: CreditCard },
  
];

export function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <div className="min-h-screen bg-card md:mt-0 mt-16">
      <div className="flex h-screen flex-col">
        <div className="flex h-16 items-center border-b px-6">
          <h1 className="text-xl font-semibold">Gym Management</h1>
        </div>
        <nav className="flex-1 space-y-1 p-4">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.name}
              </Link>
            );
          })}
        </nav>
        <div className="border-t p-4">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <p className="text-sm font-medium">{session?.user?.email}</p>
              <p className="text-xs text-muted-foreground">
                {session?.user?.role}
              </p>
            </div>
            <ModeToggle />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => signOut()}
              className="h-8 w-8"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 