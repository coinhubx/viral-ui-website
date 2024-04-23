import Link from "next/link";
import ModeToggle from "./ModeToggle";
import UserButton from "./UserButton";
import { getUser } from "@/lib/auth";
import Sidebar from "./Sidebar";

async function Header() {
  const user = await getUser();

  return (
    <header className="flex h-16 w-full items-center gap-4 border-b bg-background px-4 md:px-6">
      <nav className="hidden w-full flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
        <Link
          href="/"
          className="flex items-center gap-2 text-lg font-semibold md:text-base"
        >
          ViralUI
          <span className="sr-only">ViralUI</span>
        </Link>
        <Link
          href="/add-component"
          className="text-muted-foreground transition-colors hover:text-foreground"
        >
          Add Component
        </Link>
        <Link
          href="/my-components"
          className="text-muted-foreground transition-colors hover:text-foreground"
        >
          My Components
        </Link>
        <Link
          href="/my-likes"
          className="text-muted-foreground transition-colors hover:text-foreground"
        >
          My Likes
        </Link>
      </nav>

      <Sidebar />

      <div className="flex w-full items-center justify-end gap-4 md:ml-auto md:w-fit md:gap-2 lg:gap-4">
        <ModeToggle />

        <UserButton user={user} />
      </div>
    </header>
  );
}

export default Header;
