import "./globals.css";
import { Metadata } from "next";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/providers/ThemeProvider";

export const metadata: Metadata = {
  title: "ViralUI",
  description: "UI Components for Next.js ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <html lang="en">
        <body>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}

            <Toaster />
          </ThemeProvider>
        </body>
      </html>
    </>
  );
}
