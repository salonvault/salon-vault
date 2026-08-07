"use client";

import Image from "next/image";
import { ArrowLeft, ArrowRight, Star } from "lucide-react";
import { useEffect, useState } from "react";
import Reveal from "@/components/ui/reveal";

const testimonials = [
  {
    quote: "SalonVault completely changed our online presence. We started getting 3x more bookings within the first month!",
    name: "Sofia Rossi",
    business: "Luxe Beauty Lounge",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    quote: "Professional, responsive, and truly understands the beauty industry. Best investment we made for our business.",
    name: "Camille Dubois",
    business: "Nail Art Studio",
    image: "https://randomuser.me/api/portraits/women/68.jpg",
  },
  {
    quote: "Our new website not only looks amazing but also brings in consistent bookings every day. Highly recommended!",
    name: "Luca Moretti",
    business: "Hair Masters Studio",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    quote: "The whole experience felt premium from start to launch. Our clients now book faster and trust us before they visit.",
    name: "Amelie Laurent",
    business: "Maison Belle Spa",
    image: "https://randomuser.me/api/portraits/women/12.jpg",
  },
  {
    quote: "They understood our brand immediately. The mobile site is beautiful and our appointment calendar is finally full.",
    name: "Mei Tanaka",
    business: "Tokyo Lash Atelier",
    image: "https://randomuser.me/api/portraits/women/79.jpg",
  },
  {
    quote: "Elegant design, clear strategy, and real results. We saw more bridal inquiries within two weeks of going live.",
    name: "Elena Petrova",
    business: "Glow Bridal Beauty",
    image: "https://randomuser.me/api/portraits/women/22.jpg",
  },
];

export default function TestimonialSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const carouselItems = [...testimonials, ...testimonials.slice(0, 3)];

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % testimonials.length);
    }, 3800);

    return () => window.clearInterval(timer);
  }, []);

  const goPrevious = () => {
    setActiveIndex((current) => (current - 1 + testimonials.length) % testimonials.length);
  };

  const goNext = () => {
    setActiveIndex((current) => (current + 1) % testimonials.length);
  };

  return (
    <section id="testimonials" className=" py-6 md:py-8">
      <div className="container">
        <div className="rounded-[12px] border border-[var(--color-bordercol)] bg-white px-5 py-7 shadow-[0_10px_28px_rgba(17,17,17,0.035)] md:px-8">
          <div className="flex items-start justify-between gap-5">
            <Reveal>
              <p className="label-l1 text-[var(--color-primary-1)]">Our Clients Love Us</p>
              <h2 className="heading-h2 mt-3">
                Real Stories from <span className="text-[var(--color-primary-1)]">Salon Owners</span>
              </h2>
            </Reveal>

            <div className="hidden gap-3 md:flex">
              <button
                type="button"
                aria-label="Previous testimonials"
                onClick={goPrevious}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-[var(--color-primary-1)] text-[var(--color-primary-1)] transition-colors hover:bg-[var(--color-primary-3)]"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                aria-label="Next testimonials"
                onClick={goNext}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-[var(--color-primary-1)] text-[var(--color-primary-1)] transition-colors hover:bg-[var(--color-primary-3)]"
              >
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="mt-7 overflow-hidden">
            <div
              className="flex transition-transform duration-700 ease-out"
              style={{ transform: `translateX(calc(${activeIndex} * (-100% / 3)))` }}
            >
              {carouselItems.map((testimonial, index) => (
                <div key={`${testimonial.name}-${index}`} className="w-full shrink-0 px-0 md:w-1/3 md:px-4">
                  <article className="hover-lift min-h-[180px] rounded-[9px] border border-[var(--color-bordercol)] bg-white px-6 py-5 shadow-[0_10px_26px_rgba(17,17,17,0.045)]">
                    <div className="flex gap-1 text-[#f5b43b]">
                      {Array.from({ length: 5 }).map((_, starIndex) => (
                        <Star key={starIndex} className="h-4 w-4 fill-current" strokeWidth={1.5} />
                      ))}
                    </div>
                    <p className="para-p2 mt-4 text-[13px] font-medium">&quot;{testimonial.quote}&quot;</p>
                    <div className="mt-5 flex items-center gap-3">
                      <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full bg-[var(--color-primary-3)]">
                        <Image
                          src={testimonial.image}
                          alt={`${testimonial.name} portrait`}
                          fill
                          sizes="44px"
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="text-[13px] font-extrabold text-[var(--color-foreground)]">{testimonial.name}</h3>
                        <p className="text-[12px] text-[var(--color-ink-2)]">{testimonial.business}</p>
                      </div>
                    </div>
                  </article>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 flex justify-center gap-2">
            {testimonials.map((testimonial, index) => (
              <button
                key={testimonial.name}
                type="button"
                aria-label={`Show testimonial from ${testimonial.name}`}
                onClick={() => setActiveIndex(index)}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  activeIndex === index ? "w-7 bg-[var(--color-primary-1)]" : "w-2.5 bg-[var(--color-primary-3)]"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
