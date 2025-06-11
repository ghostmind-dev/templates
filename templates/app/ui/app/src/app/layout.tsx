import type { Metadata } from "next";
import { NextAuthProvider } from "./providers";

import "./globals.css";

export const metadata: Metadata = {
  title: "Templates UI",
  description: "Templates UI",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <NextAuthProvider>
          <div>{children}</div>
        </NextAuthProvider>
      </body>
    </html>
  );
}
