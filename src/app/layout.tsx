import "./globals.css";
import { Metadata } from "next";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/providers/ThemeProvider";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "ViralUI",
  description: "UI Components for Next.js",
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
          <ThemeProvider>
            <Header />

            {children}

            <Toaster />
          </ThemeProvider>
        </body>
      </html>
    </>
  );
}
