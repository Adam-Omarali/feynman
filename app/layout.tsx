import "./globals.css";
import { Manrope } from "next/font/google";
import ContextProvider from "./(providers)/contextProvider";
import QueryClientWrapper from "./(providers)/queryProvider";
import Navbar from "./(nav)/nav";

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
      <body style={{ margin: 0 }}>
        <ContextProvider>
          <QueryClientWrapper>
            <div style={{ display: "flex", gap: "5px" }}>
              <Navbar />
              {children}
            </div>
          </QueryClientWrapper>
        </ContextProvider>
      </body>
    </html>
  );
}
