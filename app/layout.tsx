"use client";
import { Manrope } from "@next/font/google";
import MantineWrapper from "./(providers)/mantineProvider";
import ContextProvider from "./(providers)/contextProvider";
import { NavbarSimple } from "./(nav)/header";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const manrope = Manrope({
  subsets: [],
});

const queryClient = new QueryClient();

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
            <QueryClientProvider client={queryClient}>
              <div style={{ display: "flex", gap: "20px" }}>
                <NavbarSimple />
                {children}
              </div>
            </QueryClientProvider>
          </ContextProvider>
        </body>
      </MantineWrapper>
    </html>
  );
}
