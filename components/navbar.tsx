"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { signOut } from "@/app/actions/auth";

export function Navbar() {
  const pathname = usePathname();

  const handleSignOut = async () => {
    await signOut();
  };

  const isAuthPage = pathname?.startsWith("/auth");

  if (isAuthPage) {
    return null;
  }

  return (
    <nav className="border-b bg-background">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/dashboard" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600" />
            <span className="text-xl font-bold">Smart Task Evaluator</span>
          </Link>

          <div className="flex items-center space-x-4">
            <Link href="/dashboard">
              <Button variant={pathname === "/dashboard" ? "default" : "ghost"}>
                Dashboard
              </Button>
            </Link>
            <Link href="/tasks/new">
              <Button variant={pathname === "/tasks/new" ? "default" : "ghost"}>
                New Task
              </Button>
            </Link>
            <Link href="/history">
              <Button variant={pathname === "/history" ? "default" : "ghost"}>
                History
              </Button>
            </Link>
            <form action={signOut}>
              <Button variant="outline" size="icon" title="Sign Out">
                <LogOut className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>
      </div>
    </nav>
  );
}
