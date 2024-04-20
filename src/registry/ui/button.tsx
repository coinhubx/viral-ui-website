import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { AnchorHTMLAttributes, ButtonHTMLAttributes, forwardRef } from "react";

const buttonVariants = cva(
  "trans inline-flex h-10 items-center justify-center rounded-md px-4 text-sm font-medium disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:opacity-[85%]",
        destructive:
          "bg-destructive text-destructive-foreground hover:opacity-[85%]",
        outline:
          "border border-foreground bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:opacity-[85%]",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants>;

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, ...props }, ref) => {
    return (
      <button
        {...props}
        ref={ref}
        className={cn(buttonVariants({ variant, className }))}
      />
    );
  },
);
Button.displayName = "Button";

type LinkButtonProps = AnchorHTMLAttributes<HTMLAnchorElement> &
  VariantProps<typeof buttonVariants> & { href: string };

const LinkButton = forwardRef<HTMLAnchorElement, LinkButtonProps>(
  ({ className, variant, href, ...props }, ref) => {
    return (
      <Link
        {...props}
        ref={ref}
        href={href}
        className={cn(buttonVariants({ variant, className }))}
      />
    );
  },
);
LinkButton.displayName = "LinkButton";

export { Button, LinkButton, buttonVariants };
