"use client";
import ContactPage from "@/components/Onboarding/ContactPage/ContactPage";
import FAQPage from "@/components/Onboarding/FAQPage/FAQPage";
import Footer from "@/components/Onboarding/Footer/Footer";
import LandingPage from "@/components/Onboarding/LandingPage/LandingPage";
import MissionPage from "@/components/Onboarding/MissionPage/MissionPage";
import Navbar from "@/components/Onboarding/Navbar/Navbar";
import WaitlistPage from "@/components/Onboarding/WaitlistPage/WaitlistPage";
import { useEffect, useState } from "react";

const Page = () => {
  const [activeSection, setActiveSection] = useState("");
  useEffect(() => {
    setTimeout(() => {
      document.getElementById(activeSection)?.scrollIntoView({ behavior: "smooth" });
    }, 500);
  }, [activeSection, setActiveSection])
  return (
    <div>
      <Navbar setActiveSection={setActiveSection}/>
      <div className="pt-16 md:pt-0">
        <section id="landing">
          <LandingPage />
        </section>
        <section id="mission">
          <MissionPage />
        </section>
        <section id="faq">
          <FAQPage />
        </section>
        <section id="contact">
          <ContactPage />
        </section>
        <section id="waitlist">
          <WaitlistPage />
        </section>
        <Footer />
      </div>
    </div>
  );
};

export default Page;