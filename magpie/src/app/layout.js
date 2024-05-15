"use client";

import { Inter } from "next/font/google";
import ResponsiveAppBar from "./components/Newnavbar";
import { usePathname } from "next/navigation";
import { AuthContextProvider } from "./context/AuthContext";
import { ThemeProvider } from '@mui/material/styles';
import theme from "./theme";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {

  const noBar = ['/', '/AdminPage', '/adminProfile', '/userlist', '/hsAgree', '/questionaire', '/matchedUsers', '/viewReports', '/emailPortal'];
  return (

    <html lang="en">
      <body>
        <AuthContextProvider>
          {!noBar.includes(usePathname()) ? <ResponsiveAppBar></ResponsiveAppBar> : false}
         <ThemeProvider theme={theme}> 
            {children}
           </ThemeProvider> 
        </AuthContextProvider>

      </body>
    </html>

  )
}
