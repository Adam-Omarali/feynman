import "./globals.css";
import { Manrope } from "next/font/google";
import QueryClientWrapper from "./(providers)/queryProvider";
import Navbar from "./(nav)/nav";
import ReduxWrapper from "./(providers)/reduxProvider";
import AuthProvider from "./(providers)/OnLoadProvider";
import { Toaster } from "@/components/ui/toaster";

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
        <ReduxWrapper>
          <QueryClientWrapper>
            <AuthProvider>
              <div>
                <div className="fixed z-10 h-full">
                  <Navbar />
                </div>
                <div className="ml-56">{children}</div>
                <Toaster />
              </div>
            </AuthProvider>
          </QueryClientWrapper>
        </ReduxWrapper>
      </body>
    </html>
  );
}
