"use client";
import { Manrope } from "@next/font/google";
import MantineWrapper from "./(providers)/mantineProvider";
import ContextProvider from "./(providers)/contextProvider";
import { NavbarSimple } from "./(nav)/header";

const manrope = Manrope({
  subsets: [],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html className={manrope.className}>
      <head />
      <MantineWrapper>
        <body style={{ margin: 0 }}>
          <ContextProvider>
            <div style={{ display: "flex", gap: "20px" }}>
              <NavbarSimple />
              {children}
            </div>
          </ContextProvider>
        </body>
      </MantineWrapper>
    </html>
  );
}
