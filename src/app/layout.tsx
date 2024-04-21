import { Toaster } from "react-hot-toast";
import "./globals.css";
import { Metadata } from "next";

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
          {children}

          <Toaster
            toastOptions={{
              style: {
                textAlign: "center",
              },
            }}
          />
        </body>
      </html>
    </>
  );
}
