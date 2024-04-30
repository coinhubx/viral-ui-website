import Link from "next/link";
import UserButton from "./UserButton";
import { getUser } from "@/lib/auth";
import Sidebar from "./Sidebar";
import { GitHubIcon, XIcon, YouTubeIcon } from "./SocialIcons";

async function Header() {
  const user = await getUser();

  return (
    <header className="flex h-16 w-full items-center border-b bg-background px-4 lg:px-6">
      <nav className="hidden w-full items-center gap-4 text-sm font-medium md:flex">
        <Link
          href="/hot"
          className="flex items-center gap-2 text-lg font-semibold text-primary md:text-base"
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
          href={`/profile/${user?.username}/latest`}
          className="text-muted-foreground transition-colors hover:text-foreground"
        >
          My Components
        </Link>
        <Link
          href="/my-likes/latest"
          className="text-muted-foreground transition-colors hover:text-foreground"
        >
          My Likes
        </Link>
      </nav>

      <Sidebar user={user} />

      <div className="ml-auto flex items-center gap-4">
        <Link
          href="/about"
          className="hidden whitespace-nowrap text-sm font-medium text-muted-foreground transition-colors hover:text-foreground md:block"
        >
          About
        </Link>
        <a
          target="_blank"
          href="https://github.com/ColeBlender/viral-ui-website"
        >
          <GitHubIcon className="size-6" />
        </a>
        <a target="_blank" href="https://twitter.com/ColeBlender">
          <XIcon className="size-6" />
        </a>
        <a
          target="_blank"
          href="https://youtube.com/@coleblender?sub_confirmation=1"
        >
          <YouTubeIcon className="size-6" />
        </a>

        <UserButton user={user} />
      </div>
    </header>
  );
}

export default Header;
