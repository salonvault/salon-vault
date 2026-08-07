import { Bot, CalendarCheck, Check, Gauge, Globe2, MessagesSquare, PanelsTopLeft, Search, Settings2, ShieldCheck, Sparkles, UsersRound, Wrench } from "lucide-react";
import Reveal from "@/components/ui/reveal";

const plans = [
  {
    name: "Website Launch",
    price: "$300",
    label: "Essential Website",
    description: "A polished salon website built to show your services, earn trust, and turn visitors into bookings.",
    features: [
      { icon: Globe2, text: "Custom responsive website design" },
      { icon: CalendarCheck, text: "Booking-focused layout and CTAs" },
      { icon: Search, text: "Basic SEO setup for local discovery" },
      { icon: Gauge, text: "Fast loading, mobile-first pages" },
      { icon: ShieldCheck, text: "Contact forms and trust sections" },
    ],
    featured: false,
  },
  {
    name: "Growth System",
    price: "$500",
    label: "Website + Chatbot",
    description: "Everything in the website package, plus a custom chatbot and extra conversion features for more bookings.",
    features: [
      { icon: Bot, text: "Custom salon chatbot for inquiries" },
      { icon: MessagesSquare, text: "Lead capture and appointment prompts" },
      { icon: Sparkles, text: "Premium conversion sections" },
      { icon: Wrench, text: "Advanced integrations support" },
      { icon: ShieldCheck, text: "Priority launch polish and support" },
    ],
    featured: true,
  },
  {
    name: "Salon Suite",
    price: "Contact Support",
    label: "Custom Software",
    description: "A tailored management platform for salons that need booking, staff, client, inventory, or workflow software.",
    features: [
      { icon: PanelsTopLeft, text: "Custom salon management dashboard" },
      { icon: UsersRound, text: "Staff, client, and appointment tools" },
      { icon: Settings2, text: "Workflow built around your operations" },
      { icon: MessagesSquare, text: "Chatbot and communication add-ons" },
      { icon: Wrench, text: "Custom integrations and ongoing support" },
    ],
    featured: false,
  },
];

export default function PricingSection() {
  return (
    <section id="pricing" className=" py-6 md:py-8">
      <div className="container">
        <div className="rounded-[12px] border border-[var(--color-bordercol)] bg-[linear-gradient(135deg,#ffffff_0%,#fff8fa_48%,#ffffff_100%)] px-5 py-7 shadow-[0_10px_28px_rgba(17,17,17,0.035)] md:px-8">
          <Reveal className="mx-auto max-w-[780px] text-center">
            <p className="label-l1 text-[var(--color-primary-1)]">Pricing</p>
            <h2 className="heading-h2 mt-3">
              Simple Packages for <span className="text-[var(--color-primary-1)]">Salon Growth</span>
            </h2>
            <p className="para-p2 mx-auto mt-3 max-w-[520px]">
              Choose a focused website, add a chatbot for more bookings, or build custom software around your salon operations.
            </p>
          </Reveal>

          <div className="mt-7 grid gap-5 lg:grid-cols-3 lg:items-center">
            {plans.map((plan) => (
              <article
                key={plan.name}
                className={`hover-lift relative overflow-hidden rounded-[12px] border px-5 py-6 shadow-[0_16px_40px_rgba(17,17,17,0.055)] md:px-7 ${
                  plan.featured
                    ? "border-2 border-[var(--color-primary-1)] bg-white lg:scale-[1.045] lg:px-8 lg:py-8 shadow-[0_24px_58px_rgba(232,93,117,0.18)]"
                    : "border-[var(--color-bordercol)] bg-white/80 backdrop-blur"
                }`}
              >
                {plan.featured && (
                  <div className="absolute right-2 top-1 rounded-full bg-[var(--color-primary-3)] px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.06em] text-[var(--color-primary-1)]">
                    Best Value
                  </div>
                )}

                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="label-l1 text-[var(--color-primary-1)]">{plan.label}</p>
                    <h3 className="heading-h3 mt-2">{plan.name}</h3>
                    <p className="para-p3 mt-3 max-w-[390px]">{plan.description}</p>
                  </div>
                  <div className="shrink-0">
                    <div className={`${plan.price.length > 6 ? "max-w-[140px] font-heading! text-[clamp(22px,2.1vw,30px)]" : "text-[clamp(34px,3.2vw,48px)]"} font-bold font-heading! leading-none text-[var(--color-foreground)]`}>
                      {plan.price}
                    </div>
                    <p className="mt-1 text-[11px] font-semibold font-heading! text-[var(--color-ink-3)]">
                      {plan.price.startsWith("$") ? "One-time build" : "Custom quote"}
                    </p>
                  </div>
                </div>

                <div className="my-6 h-px bg-[var(--color-bordercol)]" />

                <ul className="grid gap-1">
                  {plan.features.map(({ icon: Icon, text }) => (
                    <li key={text} className="flex items-center gap-3">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary-3)] text-[var(--color-primary-1)]">
                        <Icon className="h-4 w-4" strokeWidth={1.9} />
                      </span>
                      <span className="para-p2 font-semibold text-[var(--color-ink-2)]">{text}</span>
                    </li>
                  ))}
                </ul>

                <a
                  href="#contact"
                  className={`mt-7 inline-flex h-11 w-full items-center justify-center gap-2 rounded-[6px] text-[13px] font-extrabold transition-all ${
                    plan.featured
                      ? "bg-[var(--color-primary-1)] text-white shadow-[0_14px_30px_rgba(232,93,117,0.24)] hover:bg-[var(--color-primary-2)]"
                      : "border border-[var(--color-primary-1)] text-[var(--color-primary-1)] hover:bg-[var(--color-primary-3)]"
                  }`}
                >
                  <Check className="h-4 w-4" />
                  Book This Package
                </a>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
