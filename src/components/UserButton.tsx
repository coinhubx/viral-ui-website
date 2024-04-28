"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button, buttonVariants } from "./ui/button";
import { CircleUser } from "lucide-react";
import { useTransition } from "react";
import { useToast } from "./ui/use-toast";
import { signOutAction } from "@/actions/users";
import { User } from "@/lib/types";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { Dialog, DialogTrigger } from "./ui/dialog";
import ProfileSettingsDialog from "./ProfileSettingsDialog";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

type Props = {
  user: User | null;
};

function UserButton({ user }: Props) {
  const router = useRouter();
  const { toast } = useToast();

  const [isPending, startTransition] = useTransition();

  const handleClickSignOutButton = async () => [
    startTransition(async () => {
      const { errorMessage } = await signOutAction();
      if (!errorMessage) {
        router.replace("/login");
        toast({
          title: "Success!",
          description: "You have been logged out",
          variant: "success",
        });
      } else {
        toast({
          title: "Error!",
          description: errorMessage,
          variant: "destructive",
        });
      }
    }),
  ];

  return (
    <Dialog>
      {user ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="icon" className="rounded-full">
              <Avatar>
                <AvatarImage src={user.avatarUrl || undefined} />
                <AvatarFallback className="text-4xl">
                  {user.username[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="sr-only">Toggle user menu</span>
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <DropdownMenuLabel>{user.username}</DropdownMenuLabel>
            <DropdownMenuSeparator />

            <DialogTrigger asChild>
              <DropdownMenuItem>Settings</DropdownMenuItem>
            </DialogTrigger>

            <form action={handleClickSignOutButton}>
              <DropdownMenuItem>
                <button
                  className="cursor-default"
                  type="submit"
                  disabled={isPending}
                >
                  Sign Out
                </button>
              </DropdownMenuItem>
            </form>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <>
          <Link
            href="/create-account"
            className={cn(
              buttonVariants({
                variant: "outline",
                size: "default",
                className: "hidden sm:block",
              }),
            )}
          >
            Create Account
          </Link>
          <Link
            href="/login"
            className={cn(
              buttonVariants({
                variant: "default",
                size: "default",
                className: "",
              }),
            )}
          >
            Login
          </Link>
        </>
      )}

      {user && <ProfileSettingsDialog user={user} />}
    </Dialog>
  );
}

export default UserButton;
