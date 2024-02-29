import Image from "next/image";
import styles from "./page.module.css";
import capture from "../../public/capture.jpg";

export default function Home() {
  return (
      <div className={styles.imageContainer}>
        <Image src={capture} alt="Image" layout="fill" objectFit="cover" />
      </div>
      
    );
  }
