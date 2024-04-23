"use client";

import { loginAction } from "@/actions/users";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import useTranslateY from "@/hooks/useTranslateY";
import { EyeIcon, EyeOffIcon, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();

  const [showPassword, setShowPassword] = useState(false);

  const [isPending, startTransition] = useTransition();

  const { translateY, containerRef, titleRef } = useTranslateY();

  const handleClickLoginButton = async (formData: FormData) => {
    startTransition(async () => {
      const { errorMessage } = await loginAction(formData);
      if (!errorMessage) {
        router.replace("/");
        toast({
          title: "Success!",
          description: "You are now logged in",
          variant: "success",
        });
      } else {
        toast({
          title: "Error!",
          description: errorMessage,
          variant: "destructive",
        });
      }
    });
  };

  return (
    <main className="mt-[10vh] flex flex-col items-center px-4">
      <div
        ref={containerRef}
        className="relative flex w-full max-w-sm flex-col items-center rounded-lg border bg-popover p-8"
      >
        <h1
          ref={titleRef}
          style={{
            transform: `translateY(${isPending ? `${translateY}px` : "0px"}) scale(${isPending ? "0.6" : "1"})`,
            transition: "all 300ms ease-in-out",
          }}
          className={`mb-8 text-center text-2xl font-semibold`}
        >
          {isPending ? "Logging In" : "Login"}
        </h1>
        <div
          className={`absolute left-1/2 top-1/2 size-6 -translate-x-1/2 -translate-y-1/2 ${isPending ? "z-50 opacity-100" : "-z-50 opacity-0"}`}
        >
          <Loader2 className="size-full animate-spin" />
        </div>

        <form
          className={`flex w-full flex-col gap-4 transition-opacity duration-300 ease-in-out ${isPending && "-z-10 opacity-0"}`}
          action={handleClickLoginButton}
        >
          <Input
            type="email"
            name="email"
            placeholder="Email"
            required
            disabled={isPending}
          />
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              className="pr-10"
              required
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground transition-colors duration-200 ease-out hover:text-primary"
              onClick={() => setShowPassword(!showPassword)}
            >
              {!showPassword ? (
                <EyeIcon className="size-5" />
              ) : (
                <EyeOffIcon className="size-5" />
              )}
            </button>
          </div>
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
