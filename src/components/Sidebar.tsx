"use client";

import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { User } from "@/lib/types";

type Props = {
  user: User | null;
};

function Sidebar({ user }: Props) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <Sheet open={open} onOpenChange={(open) => setOpen(open)}>
      <SheetTrigger asChild onClick={() => setOpen(!open)}>
        <Button variant="outline" size="icon" className="shrink-0 md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle navigation menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left">
        <nav className="grid gap-6 text-lg font-medium">
          <Link
            href="/hot"
            className="flex items-center gap-2 text-lg font-semibold text-primary"
          >
            ViralUI
            <span className="sr-only">ViralUI</span>
          </Link>
          <Link
            href="/add-component"
            className="text-muted-foreground hover:text-foreground"
          >
            Add Component
          </Link>
          <Link
            href={`/profile/${user?.username}/hot`}
            className="text-muted-foreground hover:text-foreground"
          >
            My Components
          </Link>
          <Link
            href="/my-likes/hot"
            className="text-muted-foreground hover:text-foreground"
          >
            My Likes
          </Link>
          <Link
            href="/about"
            className="text-muted-foreground hover:text-foreground"
          >
            About
          </Link>
        </nav>
      </SheetContent>
    </Sheet>
  );
}

export default Sidebar;
