import "./globals.css";
import { Manrope } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { Toaster } from "sonner";

const manrope = Manrope({
  subsets: [],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html className={manrope.className} lang="en">
      <head />
      <body style={{ margin: 0 }}>
        {children}
        <Analytics />
        <Toaster />
      </body>
    </html>
  );
}
