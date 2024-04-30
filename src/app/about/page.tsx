function AboutPage() {
  return (
    <main className="mt-10 flex flex-col items-center px-4 pb-24">
      <h1 className="text-2xl">About</h1>

      <section className="mt-8 flex max-w-2xl flex-col gap-8">
        <article>
          <h2 className="text-xl font-medium text-muted-foreground">
            ViralUI is for Next.js components
          </h2>
          <p className="mt-2">
            All components should be made specifically for Next.js
          </p>
        </article>

        <article>
          <h2 className="text-xl font-medium text-muted-foreground">
            Open Source
          </h2>
          <p className="mt-2">
            This project is still very raw. If you want a new feature then
            please feel encouraged to contribute on{" "}
            <a
              href="https://github.com/ColeBlender/viral-ui-website"
              className="underline transition-colors duration-200 ease-in-out hover:text-primary"
            >
              GitHub
            </a>
            . Let's make this thing dope!
          </p>
        </article>

        <article>
          <h2 className="text-xl font-medium text-muted-foreground">
            shadcn/ui focus
          </h2>
          <p className="mt-2">
            ViralUI is meant to build on top of shadcn/ui. When using components
            from ViralUI it is advised to initialize shadcn/ui in your Next.js
            app first. Also, when designing components make sure to use the same
            CSS variables that come default with shadcn/ui.
          </p>
          <p>Here they are (I also added --success):</p>
          <ul className="mt-1">
            <li>--background</li>
            <li>--foreground</li>
            <li>--card</li>
            <li>--card-foreground</li>
            <li>--popover</li>
            <li>--popover-foreground</li>
            <li>--primary</li>
            <li>--primary-foreground</li>
            <li>--secondary</li>
            <li>--secondary-foreground</li>
            <li>--muted</li>
            <li>--muted-foreground</li>
            <li>--accent</li>
            <li>--accent-foreground</li>
            <li>--destructive</li>
            <li>--destructive-foreground</li>
            <li>--success</li>
            <li>--border</li>
            <li>--input</li>
            <li>--ring</li>
          </ul>
        </article>

        <article>
          <h2 className="text-xl font-medium text-muted-foreground">Naming</h2>
          <p className="mt-2">
            Use kebab-case and named export since this is what shadcn/ui already
            uses. Feel free to name your components whatever you want but as a
            user I would like it if your custom input was not called input.tsx
            because shadcn/ui already has that and I might want to use both in
            my project. I would call it something like cool-input.tsx or
            cole-input.tsx.
          </p>
        </article>

        <article>
          <h2 className="text-xl font-medium text-muted-foreground">
            components/ui folder
          </h2>
          <p className="mt-2">
            When using the CLI to add components to your project it will add the
            component to the components/ui folder. The CLI will automatically
            know if you're using the src folder or not.
          </p>
        </article>

        <article>
          <h2 className="text-xl font-medium text-muted-foreground">
            tsx &gt; jsx
          </h2>
          <p className="mt-2">
            Although both tsx and jsx files are allowed it is strongly
            encouraged to use tsx files. TypeScript is the way.
          </p>
        </article>
      </section>
    </main>
  );
}

export default AboutPage;
