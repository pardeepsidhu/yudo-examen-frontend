// import Image from "next/image";

import { Footer } from "@/components/footer";
import { HomeFirstSection } from "@/components/HomeFirstSection";
import HomeForthSection from "@/components/HomeForthSection";
import HomeSecondSection from "@/components/HomeSecondSection";
import HomeThirdSection from "@/components/HomeThirdSection";

export default function Home() {
  return (
   <>
   <HomeFirstSection />
   <HomeSecondSection />
   <HomeThirdSection />
   <HomeForthSection />
   <Footer />
   </>
  );
}
