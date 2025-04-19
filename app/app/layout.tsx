"use client";
import "../globals.css";
import { Manrope } from "next/font/google";
import QueryClientWrapper from "../(providers)/queryProvider";
import Navbar from "../(nav)/nav";
import ReduxWrapper from "../(providers)/reduxProvider";
import AuthProvider from "../(providers)/OnLoadProvider";
import { Analytics } from "@vercel/analytics/react";
import { useState, useEffect } from "react";

const manrope = Manrope({
  subsets: [],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [navbarWidth, setNavbarWidth] = useState(() => {
    if (typeof window !== "undefined") {
      const savedWidth = localStorage.getItem("navbarWidth");
      return savedWidth ? parseInt(savedWidth) : 224;
    }
    return 224;
  });

  useEffect(() => {
    localStorage.setItem("navbarWidth", navbarWidth.toString());
  }, [navbarWidth]);

  return (
    <div style={{ margin: 0 }}>
      <ReduxWrapper>
        <QueryClientWrapper>
          <AuthProvider>
            <div>
              <div className="fixed z-10 h-full">
                <Navbar
                  initialWidth={navbarWidth}
                  onWidthChange={setNavbarWidth}
                />
              </div>
              <div style={{ marginLeft: `${navbarWidth}px` }}>{children}</div>
              <Analytics />
            </div>
          </AuthProvider>
        </QueryClientWrapper>
      </ReduxWrapper>
    </div>
  );
}
