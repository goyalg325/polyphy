import { Inter } from "next/font/google";
import "./globals.css";
import '@/styles/index.scss';
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "@/utils/theme";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useEffect, useState } from "react";
import axios from 'axios';

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "PolyPhy",
  description: "PolyPhy reconstructs continuous networks from sparse 2D or 3D data using GPU-accelerated simulation and visualization.",
};

export default function RootLayout({ children }) {
  const [categories, setCategories] = useState([]);
  const [pagesByCategory, setPagesByCategory] = useState({});

  // Fetch categories and pages by category
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("/api/categories");
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    const fetchPagesByCategory = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/pagesByCategory`, {
          headers: {
            'Content-Type': 'application/json',
          },
        });;
        setPagesByCategory(response.data);
      } catch (error) {
        console.error("Error fetching pages by category:", error);
      }
    };

    fetchCategories();
    fetchPagesByCategory();
  }, []);

  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://cdn.quilljs.com/1.3.6/quill.snow.css" />
      </head>
      <body className={inter.className}>
        <ThemeProvider theme={theme}>
          <div className="App flex flex-col min-h-screen">
            <Navbar categories={categories} pagesByCategory={pagesByCategory} />
            <div className="flex-1">{children}</div>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
