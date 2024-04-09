"use client";

import Homepage from "./components/Homepage";
import { AuthContextProvider } from "./context/AuthContext";

export default function Home() {
  return (
    <AuthContextProvider>
          <Homepage></Homepage>

    </AuthContextProvider>
  );
}