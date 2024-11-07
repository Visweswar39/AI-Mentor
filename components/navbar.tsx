import { Button } from "@/components/ui/button";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { Sparkles } from "lucide-react";
import { ModeToggle } from "./modetoggle";
import { Poppins } from "next/font/google";
import { cn } from "@/lib/utils";

const font = Poppins({ weight: "600", subsets: ["latin"] });

export default function Navbar() {
  return (
    <div className="flex justify-between bg-green-300 h-16 px-4 py-2 border-b-2 border-primary/10">
      <div className={cn("font-bold text-3xl", font.className)}>
        companion.ai
      </div>
      <div className="flex gap-3 justify-center items-center">
        <Button size={"sm"} variant={"premium"} className="flex gap-2">
          Upgrade <Sparkles size={18} />{" "}
        </Button>
        <ModeToggle />
        <header>
          <SignedOut>
            <Button>
              <SignInButton />{" "}
            </Button>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </header>
      </div>
    </div>
  );
}
