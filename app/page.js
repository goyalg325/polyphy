import Hero from "@/components/Hero";
import News from "@/components/News";
import Image from "next/image";

export default function Home() {
  return (
   <>
   <div className="Home">
   <Hero/>
   <News/>
   </div>
   </>
  );
}
