import Reveal from "@/components/ui/reveal";

type IconProps = {
  className?: string;
};

function TargetGrowthIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 64 64" className={className} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8">
      <path d="M32 52c11 0 20-9 20-20S43 12 32 12 12 21 12 32s9 20 20 20Z" />
      <path d="M32 44c6.6 0 12-5.4 12-12S38.6 20 32 20 20 25.4 20 32s5.4 12 12 12Z" />
      <path d="M32 36a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />
      <path d="M36 28 50 14" />
      <path d="M47 13h7v7" />
      <path d="M18 49c4-2.4 8.7-3.7 14-3.7S42 46.6 46 49" />
    </svg>
  );
}

function ConversionIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 64 64" className={className} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8">
      <path d="M17 16h25.5c2.2 0 4 1.8 4 4v20.5c0 2.2-1.8 4-4 4H17c-2.2 0-4-1.8-4-4V20c0-2.2 1.8-4 4-4Z" />
      <path d="M18 24h23" />
      <path d="M20 32h11" />
      <path d="M20 38h8" />
      <path d="M36 31l15 15" />
      <path d="m44 45 7.8 2.6-2.6-7.8" />
      <path d="M39 12l1.3 2.6 2.7 1.1-2.7 1.1L39 20.5l-1.3-2.7-2.7-1.1 2.7-1.1L39 12Z" />
    </svg>
  );
}

function MobileSparkIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 64 64" className={className} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8">
      <path d="M24 10h16c2.5 0 4.5 2 4.5 4.5v35c0 2.5-2 4.5-4.5 4.5H24c-2.5 0-4.5-2-4.5-4.5v-35C19.5 12 21.5 10 24 10Z" />
      <path d="M29 15h6" />
      <path d="M28 49h8" />
      <path d="M24.5 22h15" />
      <path d="M24.5 28h10" />
      <path d="M47 39l2.2 1.2.8 2.4.8-2.4L53 39l-2.2-1.2-.8-2.4-.8 2.4L47 39Z" />
      <path d="M12 24l2 1.1.8 2.1.8-2.1 2-1.1-2-1-.8-2.2-.8 2.2-2 1Z" />
      <path d="M40 54l1.8 1 .7 1.9.7-1.9 1.8-1-1.8-1-.7-1.9-.7 1.9-1.8 1Z" />
    </svg>
  );
}

function SpeedSecureIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 64 64" className={className} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8">
      <path d="M17 39a18 18 0 0 1 30-19.8A18 18 0 0 1 52 39" />
      <path d="M21 39h22" />
      <path d="M32 39l9-15" />
      <path d="M18 45h14" />
      <path d="M13 51h16" />
      <path d="M41 41c1.7 4.9 5.1 8.5 10 10.6 4.9-2.1 8.3-5.7 10-10.6V32l-10-4-10 4v9Z" />
      <path d="m47 40 3 3 5-6" />
    </svg>
  );
}

function SupportIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 64 64" className={className} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8">
      <path d="M14 34v-5c0-10 8-18 18-18s18 8 18 18v5" />
      <path d="M18 31h4c1.6 0 3 1.4 3 3v8c0 1.6-1.4 3-3 3h-4c-2.2 0-4-1.8-4-4v-6c0-2.2 1.8-4 4-4Z" />
      <path d="M46 31h-4c-1.6 0-3 1.4-3 3v8c0 1.6 1.4 3 3 3h4c2.2 0 4-1.8 4-4v-6c0-2.2-1.8-4-4-4Z" />
      <path d="M39 49c-1.9 2.3-4.2 3.5-7 3.5h-5" />
      <path d="M25 52.5h-4" />
      <path d="M31 20l1.6 3.2 3.4 1.4-3.4 1.4L31 29.2 29.4 26 26 24.6l3.4-1.4L31 20Z" />
    </svg>
  );
}

const reasons = [
  {
    icon: TargetGrowthIcon,
    title: "Industry Focused",
    text: "We specialize in salons and beauty businesses only.",
  },
  {
    icon: ConversionIcon,
    title: "Conversion Optimized",
    text: "Every section is designed to get more bookings.",
  },
  {
    icon: MobileSparkIcon,
    title: "Mobile First Design",
    text: "Flawless experience on all devices. Always.",
  },
  {
    icon: SpeedSecureIcon,
    title: "Fast & Secure",
    text: "Speed-optimized, secure, and built for performance.",
  },
  {
    icon: SupportIcon,
    title: "Ongoing Support",
    text: "We're with you for the long run. Always here when you need us.",
  },
];

export default function WhyUsSection() {
  return (
    <section id="why-us" className=" py-6 md:py-8">
      <div className="container">
        <div className="rounded-[12px] border border-[var(--color-bordercol)] bg-white px-5 py-7 shadow-[0_10px_28px_rgba(17,17,17,0.035)] md:px-8">
          <div className="grid gap-5 md:grid-cols-[1fr_1.15fr] md:items-end">
            <Reveal>
              <p className="label-l1 text-[var(--color-primary-1)]">Why SalonVault?</p>
              <h2 className="heading-h2 mt-3 max-w-[500px]">
                More Than Just a Website We Build Your <span className="text-[var(--color-primary-1)]">Growth Engine</span>
              </h2>
            </Reveal>
            <p className="para-p2 max-w-[520px] md:pb-2">
              We understand the beauty industry and create websites that convert visitors into loyal, repeat clients.
            </p>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-1 sm:grid-cols-2 md:gap-5 lg:grid-cols-5">
            {reasons.map(({ icon: Icon, title, text }, index) => (
              <article
                key={title}
                className={`hover-lift flex min-h-[190px] flex-col items-center justify-center rounded-[8px] border border-[var(--color-bordercol)] bg-white px-2 py-6 text-center shadow-[0_10px_26px_rgba(17,17,17,0.045)] md:px-5 ${
                  index === reasons.length - 1 ? "col-span-2 mx-auto w-[48%] lg:col-span-1 lg:w-auto" : ""
                }`}
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-primary-3)]">
                  <Icon className="h-12 w-12 text-[var(--color-primary-1)]"  />
                </div>
                <h3 className="heading-h5 mt-6 max-w-[140px] font-bold">{title}</h3>
                <p className="para-p3 mt-3 max-w-[150px]">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
