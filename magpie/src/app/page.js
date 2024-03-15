import Image from "next/image";
// import styles from "./page.module.css";
import capture from "../../public/capture.jpg";

export default function Home() {
  return (
    <div className="page-container">
      <div className="background-image"></div>
      <div className="content">
        <div className="title">Find your Perfect Roommate</div>
        <h2>Include your prefernces and filter your searches to find the right person to room with</h2>
      </div>
    </div>
  );
}


