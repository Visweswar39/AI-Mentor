"use client";
import { cn } from "@/lib/utils";
import { House, Plus, Settings } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const routes = [
    {
      name: "Home",
      icon: House,
      href: "/",
    },
    {
      name: "Create",
      icon: Plus,
      href: "/create",
    },
    {
      name: "Settings",
      icon: Settings,
      href: "/settings",
    },
  ];
  return (
    <div className="h-full p-1 flex flex-col gap-4">
      {routes.map((route) => {
        return (
          <div
            key={route.name}
            className={cn(
              "flex flex-col items-center p-4 rounded-lg font-medium hover:bg-primary/10 hover:text-primary cursor-pointer",
              pathname === route.href && "bg-primary/10 text-primary",
            )}
            onClick={()=> router.push(route.href)}
          >
            <route.icon />
            <p className="text-12">{route.name}</p>
          </div>
        );
      })}
    </div>
  );
}
