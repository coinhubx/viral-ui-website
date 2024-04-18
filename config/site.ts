import { BASE_URL } from "@/lib/constants"

export const siteConfig = {
  name: "YazziUI",
  url: BASE_URL,
  ogImage: "https://ui.shadcn.com/og.jpg",
  description:
    "Beautifully designed components that you can copy and paste into your apps. Accessible. Customizable. Open Source.",
  links: {
    twitter: "https://twitter.com/ColeBlender",
    github: "https://github.com/ColeBlender/yazzi-ui",
  },
}

export type SiteConfig = typeof siteConfig
