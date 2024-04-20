"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import {
  ReactElement,
  Children,
  isValidElement,
  forwardRef,
  ImgHTMLAttributes,
  HTMLAttributes,
} from "react";

const Avatar = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    let imageSrc = "";

    const childrenArray = Children.toArray(props.children) as ReactElement[];
    const imageChild = childrenArray.find(
      (child) => isValidElement(child) && child.type === AvatarImage,
    );

    if (imageChild && imageChild.props.src) {
      imageSrc = imageChild.props.src;
    }

    return (
      <div
        {...props}
        ref={ref}
        className={cn("size-16 overflow-hidden rounded-full", className)}
      >
        {imageSrc
          ? imageChild
          : childrenArray.find(
              (child) => isValidElement(child) && child.type === AvatarFallback,
            )}
      </div>
    );
  },
);

type AvatarImageProps = ImgHTMLAttributes<HTMLImageElement> & {
  src: string;
  width?: number | `${number}`;
  height?: number | `${number}`;
  alt: string;
};

const AvatarImage = forwardRef<HTMLImageElement, AvatarImageProps>(
  ({ className, ...props }, ref) => (
    <Image
      {...props}
      ref={ref}
      className={cn("aspect-square h-full w-full", className)}
    />
  ),
);

const AvatarFallback = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    {...props}
    ref={ref}
    className={cn(
      "flex h-full w-full items-center justify-center rounded-full bg-muted",
      className,
    )}
  >
    {props.children}
  </div>
));

export { Avatar, AvatarImage, AvatarFallback };
