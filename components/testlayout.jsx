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
<head>
        <link
          rel="stylesheet"
          href="https://cdn.quilljs.com/1.3.6/quill.snow.css" 
        />
      </head>
     <body className={inter.className}>
     <ThemeProvider theme={theme}> 
     <div className="App flex flex-col min-h-screen"> {/* min-h-screen: Ensures the element takes at least the full height of the viewport.
flex and flex-col: Makes the parent container a flexbox and arranges children in a column. */}
       <Navbar/>
       <div className="flex-1"> {/* flex-1: Makes the main content area grow to fill the available space. */}
    {children}
    </div>
     <Footer/>
     </div>
     </ThemeProvider>
     </body>
    </html>
    
  );
}
