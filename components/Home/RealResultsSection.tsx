import Image from "next/image";
import { HiCheckBadge, HiMiniArrowTrendingUp, HiXCircle } from "react-icons/hi2";
import CountUp from "@/components/ui/count-up";
import Reveal from "@/components/ui/reveal";

const beforeItems = ["Outdated Design", "Hard to Navigate", "No Online Booking", "Low Visibility", "Low Bookings"];
const afterItems = ["Modern, Premium Design", "Seamless User Experience", "Online Booking System", "SEO Optimized", "More Bookings & Revenue"];

function StatusPill({ variant }: { variant: "before" | "after" }) {
  const isAfter = variant === "after";

  return (
    <div
      className={` flex h-6 items-center justify-center rounded-[7px] px-2 text-[11px] font-bold uppercase tracking-[0.02em] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.38),0_8px_14px_rgba(17,17,17,0.1)] ${
        isAfter
          ? "bg-[linear-gradient(180deg,#f46d86_0%,#e74f6d_100%)]"
          : "bg-[linear-gradient(180deg,#8b8c8c_0%,#656767_100%)]"
      }`}
    >
      {variant}
    </div>
  );
}

function LaptopMockup({ variant }: { variant: "before" | "after" }) {
  return (
    <div className={`mx-auto flex w-full items-center justify-center ${variant === "after" ? "max-w-[360px]" : "max-w-[260px]"}`}>
      <Image
        src={variant === "before" ? "/assets/mockup-1.png" : "/assets/mockup-2.png"}
        alt={variant === "before" ? "Before website laptop mockup" : "After website laptop mockup"}
        width={variant === "after" ? 620 : 430}
        height={variant === "after" ? 380 : 260}
        sizes={variant === "after" ? "(min-width: 1024px) 360px, 80vw" : "(min-width: 1024px) 260px, 80vw"}
        className="h-auto w-full object-contain"
      />
    </div>
  );
}

function MobileMockup() {
  return (
    <div className="absolute right-7 top-3 hidden w-[76px] drop-shadow-[0_14px_18px_rgba(17,17,17,0.2)] md:block lg:right-8 lg:top-3 lg:w-[84px]">
      <Image
        src="/assets/mobile-mockup.png"
        alt="Mobile booking website mockup"
        width={180}
        height={300}
        sizes="120px"
        className="h-auto w-full object-contain"
      />
    </div>
  );
}

function CurvedArrow() {
  return (
    <svg aria-hidden="true" viewBox="0 0 196 88" className="h-16 w-36 text-[var(--color-primary-1)]" fill="none">
      <path
        d="M14 16C56 60 111 72 174 40"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="4"
      />
      <path
        d="M146 27C160 29 171 34 181 41C170 45 160 51 151 59"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="4"
      />
    </svg>
  );
}

function DecorativeDots({ className }: { className: string }) {
  return (
    <div className={`pointer-events-none absolute grid grid-cols-6 gap-3 opacity-35 ${className}`}>
      {Array.from({ length: 30 }).map((_, index) => (
        <span key={index} className="h-1.5 w-1.5 rounded-full bg-[var(--color-primary-1)]" />
      ))}
    </div>
  );
}

export default function RealResultsSection() {
  return (
    <section id="real-results" className=" py-6 md:py-8 lg:py-8">
      <div className="container">
        <div className="relative overflow-hidden rounded-[18px] border border-[var(--color-blush-2)] bg-white px-5 py-6 shadow-[0_16px_42px_rgba(232,93,117,0.07)] backdrop-blur-xl md:px-7 lg:min-h-0 lg:px-7 lg:py-7">
          <div className="pointer-events-none absolute -left-24 bottom-0 h-56 w-56 rounded-full border border-[var(--color-primary-1)]/10" />
          <div className="pointer-events-none absolute left-[23%] top-[53%] h-28 w-28 rounded-full bg-[var(--color-primary-1)]/10 blur-xl" />
          <DecorativeDots className="bottom-6 left-6" />
          <DecorativeDots className="right-10 top-[45%] hidden scale-75 lg:grid" />

          <div className="relative z-10 grid gap-5 md:grid-cols-[35fr_30fr_35fr] md:items-center">
            <div className="flex flex-col justify-center md:min-h-[380px] lg:min-h-[400px]">
              <Reveal>
                <p className="label-l1 text-[var(--color-primary-1)]">Real Results</p>
                <div className="mt-3 h-px w-18 bg-[var(--color-primary-1)]" />
                <h2 className="heading-h2 mt-6 max-w-[360px]">
                  From Empty Slots to <span className="text-[var(--color-primary-1)]">Fully Booked Calendars</span>
                </h2>
                <p className="para-p2 mt-5 max-w-[280px]">
                  We don&apos;t just design websites. We design growth engines.
                </p>
              </Reveal>
              <div className="hidden md:flex mt-10 items-center gap-4 text-[13px] font-extrabold text-[var(--color-primary-1)]">
                See the transformation
               
              </div>
              <div className="ml-[115px] mt-2 hidden lg:block">
                <CurvedArrow />
              </div>
            </div>

            <article className="hover-lift rounded-[14px] border border-white/80 bg-white/64 px-4 pb-4 pt-4 shadow-[0_14px_32px_rgba(17,17,17,0.06)] backdrop-blur-xl md:mt-8">
              <StatusPill variant="before" />
              <div className="">
                <LaptopMockup variant="before" />
              </div>
              <div className="mt-4">
                {beforeItems.map((item, index) => (
                  <div key={item} className={`flex min-h-7 items-center gap-2 text-[12px] font-medium text-[var(--color-ink-2)] ${index < beforeItems.length - 1 ? "border-b border-[var(--color-bordercol)]/70" : ""}`}>
                    <HiXCircle className="h-4 w-4 shrink-0 text-[#adb0b0] drop-shadow-[0_3px_5px_rgba(17,17,17,0.1)]" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </article>

            <article className="hover-lift rounded-[16px] border border-white/85 bg-white/82 px-4 pb-4 pt-4 shadow-[0_18px_44px_rgba(232,93,117,0.1)] backdrop-blur-xl lg:px-5">
              <StatusPill variant="after" />
              <div className="relative">
                <LaptopMockup variant="after" />
                <MobileMockup />
              </div>
              <div className="mt-2 grid gap-1.5 lg:pl-3">
                {afterItems.map((item) => (
                  <div key={item} className="flex items-center gap-2 text-[12px] font-medium text-[var(--color-ink-2)]">
                    <HiCheckBadge className="h-4.5 w-4.5 shrink-0 text-[var(--color-primary-1)] drop-shadow-[0_4px_8px_rgba(232,93,117,0.2)]" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex items-center gap-3 rounded-[10px] bg-[linear-gradient(90deg,rgba(232,93,117,0.14),rgba(255,240,244,0.94))] px-4 py-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary-1)] text-white shadow-[0_10px_20px_rgba(232,93,117,0.22)]">
                  <HiMiniArrowTrendingUp className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-[16px] font-extrabold text-[var(--color-primary-1)] md:text-[19px]">
                    <CountUp end={183} prefix="+" suffix="%" /> <span className="text-[13px] text-[var(--color-ink-2)] md:text-[15px]">More Bookings</span>
                  </div>
                  <p className="para-p3 mt-0.5">Increased appointments in just 60 days</p>
                </div>
              </div>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}
