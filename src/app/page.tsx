"use client";

import { Button } from "@/registry/ui/button";
import { Textarea } from "@/registry/ui/textarea";

function HomePage() {
  return (
    <main className="flex flex-col items-center px-4">
      <h1 className="mb-10 mt-24 text-5xl">CloutUI</h1>

      <div className="flex flex-col gap-4">
        <Button>Add Component</Button>

        <Textarea />
      </div>
    </main>
  );
}

export default HomePage;
