"use client";
import Footer from "@/components/ui/main-ui/footer";
import Hero from "@/components/ui/main-ui/hero";
import Navbar from "@/components/ui/main-ui/navbar";
import ProgressCard from "@/components/ui/main-ui/scroll-progress";
import { ScrollBasedVelocityTextDemo } from "@/components/ui/main-ui/Scroll-Velocity-text";
import About from "../components/ui/main-ui/about";
import Statistics from "@/components/ui/main-ui/Statistics";
import Asks from "@/components/ui/main-ui/AskAccordion";

export default function Home() {
  return (
    <div className=" items-center justify-center  bg-[#f7f7f7] dark:bg-black">
      <ProgressCard />
      <header className="sticky top-0 z-[998]  ">
        <Navbar />
      </header>
      <section className="w-full">
        <Hero />
      </section>
      <section className=" -translate-y-2 bg-transparent shadow-[inset_0_12px_12px_-8px_rgba(0,0,0,0.1),inset_0_-12px_12px_-8px_rgba(0,0,0,0.1)] dark:bg-neutral-950 dark:shadow-[inset_0_12px_12px_-8px_rgba(255,255,255,0.1),inset_0_-12px_12px_-8px_rgba(255,255,255,0.1)]">
        <div className="py-10 text-center text-2xl font-bold ">
          <ScrollBasedVelocityTextDemo />
        </div>
      </section>
      <section>
        <About />
      </section>
      <section>
        <Statistics />
      </section>
      <section className="" dir="rtl">
        <Asks />
      </section>
      <section>
        <Footer />
      </section>
    </div>
  );
}
