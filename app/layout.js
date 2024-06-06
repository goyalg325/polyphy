import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import styles from '@/styles/index.scss'
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "PolyPhy",
  description: "PolyPhy reconstructs continuous networks from sparse 2D or 3D data using GPU-accelerated simulation and visualization.",

};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
     <body className={inter.className}>
     <Navbar/>
     {children}
     </body>
    </html>
  );
}
