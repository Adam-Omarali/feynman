import "./globals.css";
import { Manrope } from "next/font/google";
import QueryClientWrapper from "./(providers)/queryProvider";
import Navbar from "./(nav)/nav";
import ReduxWrapper from "./(providers)/reduxProvider";
import AuthProvider from "./(providers)/OnLoadProvider";
import { getAnalytics } from "firebase/analytics";
import { app } from "@/firebase/clientConfig";

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
        <ReduxWrapper>
          <QueryClientWrapper>
            <AuthProvider>
              <div style={{ display: "flex", gap: "5px" }}>
                <Navbar />
                {children}
              </div>
            </AuthProvider>
          </QueryClientWrapper>
        </ReduxWrapper>
      </body>
    </html>
  );
}
