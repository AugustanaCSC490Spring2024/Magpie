"use client";

import { Inter } from "next/font/google";
import ResponsiveAppBar from "./components/Newnavbar";
import { usePathname } from "next/navigation";
import { AuthContextProvider } from "./context/AuthContext";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  return (

      <html lang="en">
        <body>
          <AuthContextProvider>
          {usePathname() !== '/' ? <ResponsiveAppBar></ResponsiveAppBar> : false}
          </AuthContextProvider>
          {children}</body>
      </html>

  )
}
