"use client";
import Image from "next/image";
// import styles from "./page.module.css";
import capture from "../../public/capture.jpg";
import Homepage from "./components/Homepage";
import { AuthContextProvider } from "./context/AuthContext";

export default function Home() {
  return (
    <AuthContextProvider>
          <Homepage></Homepage>

    </AuthContextProvider>
  );
}


