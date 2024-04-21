"use client";

import { createAccountAction, loginAction } from "@/actions/users";
import { Button } from "@/registry/ui/button";
import { Input } from "@/registry/ui/input";
// import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

function LoginPage() {
  const router = useRouter();

  const [isPending, startTransition] = useTransition();

  const handleClickLoginButton = async (formData: FormData) => {
    startTransition(async () => {
      const { errorMessage } = await loginAction(formData);
      if (!errorMessage) {
        router.replace("/");
        // toast.success("Successfully logged in");
      } else {
        // toast.error(errorMessage);
      }
    });
  };

  return (
    <main className="flex min-h-screen items-center justify-center px-4 pb-24">
      <div className="relative flex w-full max-w-sm flex-col items-center rounded-lg border bg-popover p-8">
        <h1
          className={`mb-8 text-2xl font-semibold ${isPending && "opacity-0"}`}
        >
          Login
        </h1>

        {isPending && (
          <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-y-2 text-primary">
            <p>Logging in...</p>
            {/* <Loader2 className="size-6 animate-spin" /> */}
          </div>
        )}

        <form
          className={`flex w-full flex-col gap-4 ${isPending && "-z-10 opacity-0"}`}
          action={handleClickLoginButton}
        >
          <Input
            type="text"
            name="email"
            placeholder="Email"
            required
            disabled={isPending}
          />
          <Input
            type="password"
            name="password"
            placeholder="Password"
            required
            disabled={isPending}
          />
          <Button disabled={isPending}>Login</Button>

          <p className="mt-3 text-center text-xs">
            Don't have an account?
            <Link
              href="/create-account"
              className="ml-2 underline transition-colors duration-200 ease-in-out hover:text-primary"
            >
              Create Account
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
}

export default LoginPage;