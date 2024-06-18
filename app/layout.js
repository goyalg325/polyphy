import { Inter } from "next/font/google";
import "./globals.css";
import '@/styles/index.scss'
import {  ThemeProvider } from "@mui/material/styles";
import {theme} from "@/utils/theme"
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "PolyPhy",
  description: "PolyPhy reconstructs continuous networks from sparse 2D or 3D data using GPU-accelerated simulation and visualization.",

};
export default function RootLayout({ children }) {
  return (
<html lang="en">
     <body className={inter.className}>
     <ThemeProvider theme={theme}> 
     <div className="App">
       <Navbar/>
    {children}
     <Footer/>
     </div>
     </ThemeProvider>
     </body>
    </html>
    
  );
}
