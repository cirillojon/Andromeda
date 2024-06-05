"use client";
import React from "react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

const FAQPage = () => {
  const faqs = [
    {
      question: "How do I get started with Andromeda Software?",
      answer:
        "Getting started with Andromeda Software is easy! Simply press 'get started,' select your desired service, customize your home to your needs and lock in your rate! Our platform will guide you through selecting financing options and provide a personalized client portal to track the progress of your project from start to finish.",
    },
    {
      question: "What is Andromeda Software?",
      answer:
        "Our platform offers transparent financing options, allowing you to compare leasing, loans, and cash solutions. We also provide bundling options, to allow you to have more control over what you need.",
    },
    {
      question: "How does Andromeda Software help me with financing options?",
      answer:
        "Getting started with Andromeda Software is easy! Simply press 'get started,' select your desired service, customize your home to your needs and lock in your rate! Our platform will guide you through selecting financing options and provide a personalized client portal to track the progress of your project from start to finish.",
    },
    {
      question:
        "What types of home improvement projects can I manage through Andromeda Software?",
      answer:
        "You can customize and order a variety of projects through our platform: such as Solar Panels, Batteries, Roofs, and HVAC units.",
    },
    {
      question: "How do I track the progress of my home improvement project?",
      answer:
        "After signing up, you will have access to a dedicated client portal where you can track the progress of your project. The portal provides your full project details, regular updates, and a custom chat bot.",
    },
  ];

  return (
    <div
      className="mb-48 max-w-4xl mx-auto p-8 mt-36 bg-white shadow-lg rounded-lg"
      style={{ height: "550px", overflowY: "auto" }}
    >
      <h1 className="text-4xl font-bold text-center mb-12">
        Frequently Asked Questions
      </h1>
      <Accordion type="single" collapsible className="w-full">
        {faqs.map((faq, index) => (
          <AccordionItem key={index} value={`item-${index}`}>
            <AccordionTrigger>{faq.question}</AccordionTrigger>
            <AccordionContent>{faq.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default FAQPage;
