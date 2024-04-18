import "@/styles/globals.css"
import { Metadata } from "next"

import { fontSans } from "@/lib/fonts"
import { cn } from "@/lib/utils"

export const metadata: Metadata = {
  title: "YazziUI",
  description: "UI Components for Next.js ",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      <html lang="en">
        <body className={cn("min-h-screen font-sans", fontSans.variable)}>
          {children}
        </body>
      </html>
    </>
  )
}
