import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";
import { Sparkles } from "lucide-react";
import { ModeToggle } from "./modetoggle";
import { Poppins } from "next/font/google";
import { cn } from "@/lib/utils";
import Link from "next/link";

const font = Poppins({ weight: "600", subsets: ["latin"] });

export default function Navbar() {
  return (
    <div className="fixed z-50 flex h-16 w-full items-center justify-between border-b border-primary/10 bg-secondary px-4 py-2">
      <div className="flex items-center">
        {/* < /> */}
        <Link href="/">
          <h1
            className={cn(
              "hidden text-xl font-bold text-primary md:block md:text-3xl",
              font.className,
            )}
          >
            companion.ai
          </h1>
        </Link>
      </div>
      <div className="flex gap-3 justify-center items-center">
        <Button size={"sm"} variant={"premium"} className="flex gap-2">
          Upgrade <Sparkles size={18} />{" "}
        </Button>
        <ModeToggle />
        <UserButton />
      </div>
    </div>
  );
}
