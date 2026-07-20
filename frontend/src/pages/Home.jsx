import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Hero from "../components/Hero";
import PopularUniversities from "../components/PopularUniversities";
import FilterSection from "../components/FilterSection";
import WhyChooseUs from "../components/WhyChooseUs";
import MajorsSection from "../components/MajorsSection";
import TestimonialsSection from "../components/TestimonialsSection";
import StatsSection from "../components/StatsSection";
import FaqSection from "../components/FaqSection";
import CtaBanner from "../components/CtaBanner";

export default function Home() {
  const location = useLocation();

  useEffect(() => {
    let timerId;
    if (location.hash) {
      const el = document.querySelector(location.hash);
      if (el) {
        timerId = setTimeout(
          () => el.scrollIntoView({ behavior: "smooth" }),
          50,
        );
      }
    }

    return () => {
      if (timerId) clearTimeout(timerId);
    };
  }, [location]);

  return (
    <>
      <Hero />
      <PopularUniversities />
      <FilterSection />
      <WhyChooseUs />
      <MajorsSection />
      <TestimonialsSection />
      <StatsSection />
      <FaqSection />
      <CtaBanner />
    </>
  );
}
