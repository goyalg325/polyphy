import About from "@/components/About";
import Hero from "@/components/Hero";
import Image from "next/image";

export default function Home() {
  return (
   <>
   <div className="Home">
   <Hero  />
   <About />
   </div>
   </>
  );
}
