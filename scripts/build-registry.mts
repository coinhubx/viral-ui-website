// @sts-nocheck
import { existsSync, promises as fs, readFileSync } from "fs";
import path, { basename } from "path";
import template from "lodash.template";
import { rimraf } from "rimraf";
import { colorMapping, colors } from "../src/registry/colors";
import { registry } from "../src/registry/registry";
import { Registry, registrySchema } from "../src/registry/schema";

const REGISTRY_PATH = path.join(process.cwd(), "public/registry");

// ----------------------------------------------------------------------------
// Build src/registry/ui/[name].json.
// ----------------------------------------------------------------------------
async function buildUI(registry: Registry) {
  const targetPath = path.join(REGISTRY_PATH, "ui");

  // Create directory if it doesn't exist.
  if (!existsSync(targetPath)) {
    await fs.mkdir(targetPath, { recursive: true });
  }

  for (const item of registry) {
    const files = item.files?.map((file) => {
      const content = readFileSync(
        path.join(process.cwd(), "src/registry", file),
        "utf8",
      );

      return {
        name: basename(file),
        content,
      };
    });

    const payload = {
      ...item,
      files,
    };

    await fs.writeFile(
      path.join(targetPath, `${item.name}.json`),
      JSON.stringify(payload, null, 2),
      "utf8",
    );
  }
}

// ----------------------------------------------------------------------------
// Build src/registry/colors/index.json.
// ----------------------------------------------------------------------------
async function buildColors() {
  const colorsTargetPath = path.join(REGISTRY_PATH, "colors");
  rimraf.sync(colorsTargetPath);
  if (!existsSync(colorsTargetPath)) {
    await fs.mkdir(colorsTargetPath, { recursive: true });
  }

  const colorsData: Record<string, any> = {};
  for (const [color, value] of Object.entries(colors)) {
    if (typeof value === "string") {
      colorsData[color] = value;
      continue;
    }

    if (Array.isArray(value)) {
      colorsData[color] = value.map((item) => ({
        ...item,
        rgbChannel: item.rgb.replace(/^rgb\((\d+),(\d+),(\d+)\)$/, "$1 $2 $3"),
        hslChannel: item.hsl.replace(
          /^hsl\(([\d.]+),([\d.]+%),([\d.]+%)\)$/,
          "$1 $2 $3",
        ),
      }));
      continue;
    }

    if (typeof value === "object") {
      colorsData[color] = {
        ...value,
        rgbChannel: value.rgb.replace(/^rgb\((\d+),(\d+),(\d+)\)$/, "$1 $2 $3"),
        hslChannel: value.hsl.replace(
          /^hsl\(([\d.]+),([\d.]+%),([\d.]+%)\)$/,
          "$1 $2 $3",
        ),
      };
      continue;
    }
  }

  await fs.writeFile(
    path.join(colorsTargetPath, "index.json"),
    JSON.stringify(colorsData, null, 2),
    "utf8",
  );

  // ----------------------------------------------------------------------------
  // Build src/registry/colors/[base].json.
  // ----------------------------------------------------------------------------
  const BASE_STYLES = `@tailwind base;
  @tailwind components;
  @tailwind utilities;
  `;

  const BASE_STYLES_WITH_VARIABLES = `@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: <%- colors.light["background"] %>;
    --foreground: <%- colors.light["foreground"] %>;

    --card: <%- colors.light["card"] %>;
    --card-foreground: <%- colors.light["card-foreground"] %>;

    --popover: <%- colors.light["popover"] %>;
    --popover-foreground: <%- colors.light["popover-foreground"] %>;

    --primary: <%- colors.light["primary"] %>;
    --primary-foreground: <%- colors.light["primary-foreground"] %>;

    --secondary: <%- colors.light["secondary"] %>;
    --secondary-foreground: <%- colors.light["secondary-foreground"] %>;

    --muted: <%- colors.light["muted"] %>;
    --muted-foreground: <%- colors.light["muted-foreground"] %>;

    --accent: <%- colors.light["accent"] %>;
    --accent-foreground: <%- colors.light["accent-foreground"] %>;

    --destructive: <%- colors.light["destructive"] %>;
    --destructive-foreground: <%- colors.light["destructive-foreground"] %>;

    --border: <%- colors.light["border"] %>;
    --input: <%- colors.light["input"] %>;
    --ring: <%- colors.light["ring"] %>;

    --radius: 0.5rem;
  }

  .dark {
    --background: <%- colors.dark["background"] %>;
    --foreground: <%- colors.dark["foreground"] %>;

    --card: <%- colors.dark["card"] %>;
    --card-foreground: <%- colors.dark["card-foreground"] %>;

    --popover: <%- colors.dark["popover"] %>;
    --popover-foreground: <%- colors.dark["popover-foreground"] %>;

    --primary: <%- colors.dark["primary"] %>;
    --primary-foreground: <%- colors.dark["primary-foreground"] %>;

    --secondary: <%- colors.dark["secondary"] %>;
    --secondary-foreground: <%- colors.dark["secondary-foreground"] %>;

    --muted: <%- colors.dark["muted"] %>;
    --muted-foreground: <%- colors.dark["muted-foreground"] %>;

    --accent: <%- colors.dark["accent"] %>;
    --accent-foreground: <%- colors.dark["accent-foreground"] %>;

    --destructive: <%- colors.dark["destructive"] %>;
    --destructive-foreground: <%- colors.dark["destructive-foreground"] %>;

    --border: <%- colors.dark["border"] %>;
    --input: <%- colors.dark["input"] %>;
    --ring: <%- colors.dark["ring"] %>;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}

.trans {
  @apply transition-all duration-200 ease-in-out;
}`;

  for (const baseColor of ["zinc"]) {
    const base: Record<string, any> = {
      inlineColors: {},
      cssVars: {},
    };
    for (const [mode, values] of Object.entries(colorMapping)) {
      base["inlineColors"][mode] = {};
      base["cssVars"][mode] = {};
      for (const [key, value] of Object.entries(values)) {
        if (typeof value === "string") {
          const resolvedColor = value.replace(/{{base}}-/g, `${baseColor}-`);
          base["inlineColors"][mode][key] = resolvedColor;

          const [resolvedBase, scale] = resolvedColor.split("-");
          const color = scale
            ? colorsData[resolvedBase].find(
                (item) => item.scale === parseInt(scale),
              )
            : colorsData[resolvedBase];
          if (color) {
            base["cssVars"][mode][key] = color.hex;
          }
        }
      }
    }

    // Build css vars.
    base["inlineColorsTemplate"] = template(BASE_STYLES)({});
    base["cssVarsTemplate"] = template(BASE_STYLES_WITH_VARIABLES)({
      colors: base["cssVars"],
    });

    await fs.writeFile(
      path.join(REGISTRY_PATH, `colors/${baseColor}.json`),
      JSON.stringify(base, null, 2),
      "utf8",
    );
  }
}

try {
  const result = registrySchema.safeParse(registry);

  if (!result.success) {
    console.error(result.error);
    process.exit(1);
  }

  await buildUI(result.data);
  await buildColors();

  console.log("✅ Done!");
} catch (error) {
  console.error(error);
  process.exit(1);
}
