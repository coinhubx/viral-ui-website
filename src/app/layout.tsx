import "./globals.css";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "YazziUI",
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
        <body>{children}</body>
      </html>
    </>
  );
}
