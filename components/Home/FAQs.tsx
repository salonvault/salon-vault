"use client";

import { Minus, Plus } from "lucide-react";
import { useState } from "react";
import Reveal from "@/components/ui/reveal";

const faqs = [
  {
    question: "What is included in the $300 website package?",
    answer: "It includes a custom responsive salon website, service sections, booking-focused calls to action, contact forms, basic local SEO, and mobile optimization.",
  },
  {
    question: "What makes the $500 chatbot package different?",
    answer: "The $500 package includes the full website build plus a custom chatbot designed to answer common questions, capture leads, and guide clients toward booking.",
  },
  {
    question: "Can you connect my booking system?",
    answer: "Yes. We can connect common booking tools, calendar links, contact forms, WhatsApp, and other appointment flows based on how your salon already works.",
  },
  {
    question: "Do you only work with beauty salons?",
    answer: "SalonVault is focused on beauty businesses, including hair salons, nail studios, skin care clinics, barbershops, lash studios, and similar service brands.",
  },
  {
    question: "How long does a website take?",
    answer: "Most standard salon websites can be designed and launched quickly once the content, brand direction, and required booking details are ready.",
  },
  {
    question: "Can you write the website copy too?",
    answer: "Yes. We can shape the messaging, service copy, calls to action, and trust sections so the site feels premium and sales-focused.",
  },
  {
    question: "Will the website work on mobile?",
    answer: "Yes. Every SalonVault website is designed mobile-first so clients can browse services, trust the business, and book easily from their phone.",
  },
  {
    question: "What is the custom software option?",
    answer: "It is a custom salon management solution for businesses that need dashboards, staff tools, client records, booking workflows, or other operational software.",
  },
  {
    question: "Do you provide support after launch?",
    answer: "Yes. We can help with updates, improvements, chatbot adjustments, technical fixes, and growth-focused changes after the website goes live.",
  },
  {
    question: "How do we get started?",
    answer: "Book a free call, share your salon goals, and we will recommend the right package based on your services, booking process, and growth needs.",
  },
];

function FAQItem({
  question,
  answer,
  isOpen,
  onToggle,
}: {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <article className="hover-lift overflow-hidden rounded-[10px] border border-[var(--color-bordercol)] bg-white shadow-[0_10px_26px_rgba(17,17,17,0.04)]">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left transition-colors hover:bg-primary-1/5"
        aria-expanded={isOpen}
      >
        <span className="heading-h5 font-bold">{question}</span>
        <span
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-colors ${
            isOpen
              ? "border-[var(--color-primary-1)] bg-[var(--color-primary-1)] text-white"
              : "border-[var(--color-blush-2)] bg-[var(--color-primary-3)] text-[var(--color-primary-1)]"
          }`}
        >
          {isOpen ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
        </span>
      </button>

      <div className={`grid transition-[grid-template-rows] duration-300 ease-out ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
        <div className="overflow-hidden">
          <div className="mx-4 h-px bg-[var(--color-bordercol)]" />
          <p className="para-p3 px-4 pb-4 pt-3">{answer}</p>
        </div>
      </div>
    </article>
  );
}

export default function FAQs() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section id="faq" className=" py-6 md:py-8">
      <div className="container">
        <div className="rounded-[12px] border border-[var(--color-bordercol)] bg-[linear-gradient(135deg,#ffffff_0%,#fff8fa_50%,#ffffff_100%)] px-5 py-7 shadow-[0_10px_28px_rgba(17,17,17,0.035)] md:px-8">
          <Reveal className="mx-auto max-w-[780px] text-center">
            <p className="label-l1 text-[var(--color-primary-1)]">FAQ</p>
            <h2 className="heading-h2 mt-3">
              Questions Salon Owners <span className="text-[var(--color-primary-1)]">Ask Before Booking</span>
            </h2>
            <p className="para-p2 mx-auto mt-3 max-w-[540px]">
              Clear answers about websites, chatbots, booking systems, and custom salon software.
            </p>
          </Reveal>

          <div className="mt-7 grid gap-3 lg:grid-cols-2">
            <div className="grid content-start gap-3">
              {faqs.slice(0, 5).map((faq, index) => (
                <FAQItem
                  key={faq.question}
                  question={faq.question}
                  answer={faq.answer}
                  isOpen={openIndex === index}
                  onToggle={() => setOpenIndex(openIndex === index ? -1 : index)}
                />
              ))}
            </div>

            <div className="grid content-start gap-3">
              {faqs.slice(5).map((faq, index) => {
                const actualIndex = index + 5;

                return (
                  <FAQItem
                    key={faq.question}
                    question={faq.question}
                    answer={faq.answer}
                    isOpen={openIndex === actualIndex}
                    onToggle={() => setOpenIndex(openIndex === actualIndex ? -1 : actualIndex)}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
