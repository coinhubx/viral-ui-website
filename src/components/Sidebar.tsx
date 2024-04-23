"use client";

import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

function Sidebar() {
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
            href="/"
            className="flex items-center gap-2 text-lg font-semibold"
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
            href="/my-components"
            className="text-muted-foreground hover:text-foreground"
          >
            My Components
          </Link>
          <Link
            href="/my-likes"
            className="text-muted-foreground hover:text-foreground"
          >
            My Likes
          </Link>
        </nav>
      </SheetContent>
    </Sheet>
  );
}

export default Sidebar;
