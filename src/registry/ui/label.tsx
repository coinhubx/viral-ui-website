import { cn } from "@/lib/utils";
import { forwardRef, LabelHTMLAttributes } from "react";

const Label = forwardRef<
  HTMLLabelElement,
  LabelHTMLAttributes<HTMLLabelElement>
>(({ className, ...props }, ref) => (
  <label
    {...props}
    ref={ref}
    className={cn(
      "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
      className,
    )}
  />
));
Label.displayName = "Label";

export { Label };
