"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/registry/ui/avatar";
import { Button, LinkButton } from "@/registry/ui/button";
import { Input } from "@/registry/ui/input";
import { Label } from "@/registry/ui/label";
import { Textarea } from "@/registry/ui/textarea";
import Image from "next/image";
import { useRef } from "react";

function HomePage() {
  const ref = useRef<HTMLButtonElement>(null);
  const aRef = useRef<HTMLAnchorElement>(null);

  return (
    <main className="flex flex-col items-center px-4">
      <h1 className="mb-10 mt-24 text-5xl">Welcome to YazziUI</h1>

      <div className="flex flex-col gap-4">
        <Button ref={ref} type="button">
          Bitch
        </Button>

        <Input type="file" placeholder="Ass..." />

        <Label>Cock</Label>
        <Input placeholder="Ass..." />

        <LinkButton ref={aRef} href="/" variant={"outline"}>
          Dank <p>Ass</p>
        </LinkButton>

        <Button ref={ref}>Bitch Aass motherfucker you</Button>

        <Textarea />

        <Avatar>
          <AvatarImage
            // src="https://github.com/ColeBlender.png"
            src=""
            width={100}
            height={100}
            alt="dank"
          />
          <AvatarFallback>Ass</AvatarFallback>
        </Avatar>
      </div>
    </main>
  );
}

export default HomePage;
