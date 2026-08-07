"use client";

import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import Reveal from "@/components/ui/reveal";

const projects = [
  {
    title: "Luxe Beauty Lounge",
    category: "Beauty Salon",
    image: "/assets/work3.png",
  },
  {
    title: "Nail Art Studio",
    category: "Nail Studio",
    image: "/assets/work1.png",
  },
  {
    title: "Hair Masters Studio",
    category: "Hair Salon",
    image: "/assets/work4.png",
  },
  {
    title: "Lash & Co. Studio",
    category: "Lash & Brow Studio",
    image: "/assets/work2.png",
  },
];

export default function WorkSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const carouselProjects = [...projects, ...projects.slice(0, 3)];

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % projects.length);
    }, 3200);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <section id="our-work" className=" py-6 md:py-8">
      <div className="container">
        <div className="rounded-[12px] border border-[var(--color-bordercol)] bg-white px-5 py-7 shadow-[0_10px_28px_rgba(17,17,17,0.035)] md:px-8">
          <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
            <Reveal>
              <p className="label-l1 text-[var(--color-primary-1)]">Our Work</p>
              <h2 className="heading-h2 mt-3">
                Websites That Bring <span className="text-[var(--color-primary-1)]">Real Clients</span>
              </h2>
              <p className="para-p2 mt-4 max-w-[470px]">
                Custom-designed websites for salons and beauty businesses that look beautiful and drive results.
              </p>
            </Reveal>

            <a
              href="#contact"
              className="inline-flex h-10 w-fit items-center justify-center gap-2 rounded-[5px] border border-[var(--color-primary-1)] px-5 text-[12px] font-extrabold text-[var(--color-primary-1)] transition-colors hover:bg-[var(--color-primary-3)]"
            >
              Get your Free Quote
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>

          <div className="mt-7 overflow-hidden">
            <div
              className="flex transition-transform duration-700 ease-out"
              style={{ transform: `translateX(calc(${activeIndex} * (-100% / 3)))` }}
            >
              {carouselProjects.map((project, index) => (
                <div key={`${project.title}-${index}`} className="w-full shrink-0 px-0 md:w-1/3 md:px-3">
                  <article className="hover-lift overflow-hidden rounded-[10px] border border-[var(--color-bordercol)] bg-white shadow-[0_10px_26px_rgba(17,17,17,0.045)]">
                    <div className="relative aspect-[1.62] overflow-hidden bg-[var(--color-panel)]">
                      <Image
                        src={project.image}
                        alt={`${project.title} website mockup`}
                        fill
                        sizes="(min-width: 1024px) 360px, (min-width: 768px) 30vw, 100vw"
                        className="object-cover object-center"
                      />
                    </div>
                    <div className="px-5 py-4">
                      <h3 className="heading-h5 font-bold">{project.title}</h3>
                      <p className="para-p3 mt-1">{project.category}</p>
                    </div>
                  </article>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 flex justify-center gap-2">
            {projects.map((project, index) => (
              <button
                key={project.title}
                type="button"
                aria-label={`Show ${project.title}`}
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
