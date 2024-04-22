"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "./ui/button";
import { CircleUser } from "lucide-react";
import { useTransition } from "react";
import { useToast } from "./ui/use-toast";
import { signOutAction } from "@/actions/users";
import { User } from "@/lib/types";
import Link from "next/link";

type Props = {
  user: User | null;
};

function UserButton({ user }: Props) {
  const { toast } = useToast();

  const [isPending, startTransition] = useTransition();

  const handleClickSignOutButton = async () => [
    startTransition(async () => {
      const { errorMessage } = await signOutAction();
      if (!errorMessage) {
        toast({
          title: "Success!",
          description: "You have been logged out.",
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
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary" size="icon" className="rounded-full">
          <CircleUser className="h-5 w-5" />
          <span className="sr-only">Toggle user menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {user ? (
          <>
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Settings</DropdownMenuItem>
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
          </>
        ) : (
          <DropdownMenuItem>
            <Link className="w-full cursor-default" href="/login">
              Login
            </Link>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default UserButton;
