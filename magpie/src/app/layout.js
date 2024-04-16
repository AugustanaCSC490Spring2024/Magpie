"use client";

import { Inter } from "next/font/google";
import ResponsiveAppBar from "./components/Newnavbar";
import { usePathname } from "next/navigation";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
 return (
    <html lang="en">
      <body>
        
        {usePathname() !== '/' ? <ResponsiveAppBar></ResponsiveAppBar>:false}
        {children}</body>
    </html>
  )
}
