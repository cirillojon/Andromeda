"use client";
import ContactPage from "@/components/Onboarding/ContactPage/ContactPage";
import FAQPage from "@/components/Onboarding/FAQPage/FAQPage";
import Footer from "@/components/Onboarding/Footer/Footer";
import LandingPage from "@/components/Onboarding/LandingPage/LandingPage";
import MissionPage from "@/components/Onboarding/MissionPage/MissionPage";
import Navbar from "@/components/Onboarding/Navbar/Navbar";
import WaitlistPage from "@/components/Onboarding/WaitlistPage/WaitlistPage";
import { useEffect, useState } from "react";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";

const Page = () => {
  const [activeSection, setActiveSection] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { isAuthenticated } = useKindeBrowserClient();
  useEffect(() => {
    if (isAuthenticated) {
      setIsLoggedIn(isAuthenticated);
    }
  }, [isAuthenticated]);
  useEffect(() => {
    setTimeout(() => {
      document
        .getElementById(activeSection)
        ?.scrollIntoView({ behavior: "smooth" });
    }, 500);
  }, [activeSection, setActiveSection]);
  return (
    <div>
      <Navbar
        setActiveSection={setActiveSection}
        isLoggedIn={isLoggedIn}
      />
      <div className="pt-16 md:pt-0">
        <section id="landing">
          <LandingPage setActiveSection={setActiveSection}/>
        </section>
        <section id="mission">
          <MissionPage setActiveSection={setActiveSection}/>
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
