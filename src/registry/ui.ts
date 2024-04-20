import { Registry } from "@/registry/schema";

export const ui: Registry = [
  {
    name: "alert",
    type: "components:ui",
    files: ["ui/alert.tsx"],
  },
  {
    name: "alert-dialog",
    type: "components:ui",
    registryDependencies: ["button"],
    files: ["ui/alert-dialog.tsx"],
  },
  {
    name: "avatar",
    type: "components:ui",
    files: ["ui/avatar.tsx"],
  },
  {
    name: "button",
    type: "components:ui",
    files: ["ui/button.tsx"],
  },
  {
    name: "dialog",
    type: "components:ui",
    files: ["ui/dialog.tsx"],
  },
  {
    name: "dropdown-menu",
    type: "components:ui",
    files: ["ui/dropdown-menu.tsx"],
  },
  {
    name: "input",
    type: "components:ui",
    files: ["ui/input.tsx"],
  },
  {
    name: "label",
    type: "components:ui",
    files: ["ui/label.tsx"],
  },
  {
    name: "navigation-menu",
    type: "components:ui",
    files: ["ui/navigation-menu.tsx"],
  },
  {
    name: "popover",
    type: "components:ui",
    files: ["ui/popover.tsx"],
  },
  {
    name: "textarea",
    type: "components:ui",
    files: ["ui/textarea.tsx"],
  },
];
