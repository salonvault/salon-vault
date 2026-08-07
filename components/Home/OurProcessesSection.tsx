import { CalendarCheck, MessageSquareText, MousePointerClick, UsersRound } from "lucide-react";
import Reveal from "@/components/ui/reveal";



const steps = [
  {
    number: "01",
    icon: MousePointerClick,
    title: "Attract",
    subtitle: "High-Converting Design",
    text: "We design beautiful, SEO-friendly websites that attract the right local clients.",
  },
  {
    number: "02",
    icon: MessageSquareText,
    title: "Engage",
    subtitle: "Build Trust & Connection",
    text: "We showcase your services, reviews, and results to build instant trust and credibility.",
  },
  {
    number: "03",
    icon: CalendarCheck,
    title: "Convert",
    subtitle: "Booking-Focused Experience",
    text: "Easy online booking, clear CTAs, and seamless UX that turn visitors into confirmed clients.",
  },
  {
    number: "04",
    icon: UsersRound,
    title: "Retain",
    subtitle: "Encourage Repeat Visits",
    text: "We help you keep clients coming back with smart features and loyalty-driving strategies.",
  },
];

function ProcessArrow() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 72 24"
      className="pointer-events-none absolute left-[calc(100%-11px)] top-[47%] hidden h-6 w-[58px] -translate-y-1/2 text-[var(--color-primary-1)] xl:block"
      fill="none"
    >
      <path
        d="M2 18C21 3 47 3 68 18"
        stroke="currentColor"
        strokeDasharray="3 4"
        strokeLinecap="round"
        strokeWidth="1.4"
        opacity="0.55"
      />
      <path d="M63 13.5 68 18l-6.5 1.8" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.4" opacity="0.55" />
    </svg>
  );
}

export default function OurProcessesSection() {
  return (
    <section id="our-processes" className=" py-6 md:py-8">
      <div className="container">
        <div className="rounded-[14px] border border-[var(--color-bordercol)] bg-white px-5 py-7 shadow-[0_12px_36px_rgba(17,17,17,0.035)] md:px-8 lg:px-9 lg:py-9">
          <Reveal className="max-w-[720px]">
            <p className="label-l1 font-heading! text-[var(--color-primary-1)]">Our Process</p>
            <h2 className="heading-h2 mt-4 ">
              How We Turn Clicks Into <span className="text-[var(--color-primary-1)]">Booked Clients</span>
            </h2>
            <p className="para-p3 mt-4 max-w-[300px]">
              A proven system that transforms your website into a 24/7 client-generating machine.
            </p>
          </Reveal>

          <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4 xl:gap-12">
            {steps.map(({ number, icon: Icon, title, subtitle, text }, index) => (
              <article
                key={title}
                className="hover-lift relative rounded-[8px] border border-[var(--color-bordercol)] bg-white px-7 pb-7 pt-5 text-center shadow-[0_10px_28px_rgba(17,17,17,0.045)]"
              >
                <div className="absolute left-4 top-4 text-[20px] font-extrabold text-[var(--color-primary-1)]">{number}</div>
                <div className="mx-auto mt-2 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-primary-3)]">
                  <Icon className="h-8 w-8 text-[var(--color-primary-1)]" strokeWidth={1.2} />
                </div>
                <h3 className="heading-h5 mt-5 font-bold">{title}</h3>
                <p className="mt-2 text-[12px] font-normal leading-snug text-[var(--color-foreground)]">{subtitle}</p>
                <p className="para-p3 mx-auto mt-4 max-w-[190px]">{text}</p>
                {index < steps.length - 1 && <ProcessArrow />}
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
