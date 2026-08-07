"use client";

import Image from "next/image";
import {
  AlertCircle,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Globe2,
  Lock,
  Mail,
  PencilLine,
  Phone,
  Sparkles,
  Store,
  TrendingUp,
  User,
  type LucideIcon,
} from "lucide-react";
import { FormEvent, useState } from "react";
import Reveal from "@/components/ui/reveal";
import CountUp from "@/components/ui/count-up";

// const contactScriptUrl = process.env.NEXT_PUBLIC_GOOGLE_APPS_SCRIPT_URL || "";
const contactScriptUrl = "https://script.google.com/macros/s/AKfycbzvZKIfgw0IhM0NeOO7RkoNywb_Ai7kkrAcTjp7rIsK5qOZhxWkatO5VgC8nKe9eYTl/exec";

const benefits = [
  { icon: CalendarDays, title: "More Bookings", text: "Get more appointments and repeat clients." },
  { icon: TrendingUp, title: "Grow Your Brand", text: "Stand out with a premium online presence." },
  { icon: Clock3, title: "Save Time", text: "Automate and simplify your business." },
];

const avatarUrls = [
  "https://randomuser.me/api/portraits/women/44.jpg",
  "https://randomuser.me/api/portraits/women/65.jpg",
];

type FormValues = {
  fullName: string;
  email: string;
  businessName: string;
  phone: string;
  industry: string;
  currentWebsite: string;
  goals: string;
};

type FormErrors = Partial<Record<keyof FormValues, string>>;

function getFieldValue(formData: FormData, key: keyof FormValues) {
  return String(formData.get(key) || "").trim();
}

function validate(values: FormValues) {
  const errors: FormErrors = {};
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phonePattern = /^[+()\d\s.-]{7,}$/;

  if (values.fullName.length < 2) errors.fullName = "Enter your full name.";
  if (!emailPattern.test(values.email)) errors.email = "Enter a valid email address.";
  if (values.businessName.length < 2) errors.businessName = "Enter your business name.";
  if (!phonePattern.test(values.phone)) errors.phone = "Enter a valid phone number.";
  if (!values.industry) errors.industry = "Select your industry.";
  if (values.currentWebsite && !/^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\/.*)?$/i.test(values.currentWebsite)) {
    errors.currentWebsite = "Enter a valid website or leave it empty.";
  }
  if (values.goals.length < 10) errors.goals = "Tell us a little more about your goals.";

  return errors;
}

function ErrorText({ message }: { message?: string }) {
  if (!message) return null;

  return (
    <p className="mt-1 flex items-center gap-1 text-[11px] font-medium text-[var(--color-primary-1)]">
      <AlertCircle className="h-3.5 w-3.5" />
      {message}
    </p>
  );
}

function InputShell({
  icon: Icon,
  name,
  placeholder,
  error,
  as = "input",
}: {
  icon: LucideIcon;
  name: keyof FormValues;
  placeholder: string;
  error?: string;
  as?: "input" | "select" | "textarea";
}) {
  const fieldClass = `para-p3 w-full rounded-[7px] border bg-white text-[var(--color-foreground)] outline-none transition-colors placeholder:text-[var(--color-ink-3)] ${
    error ? "border-[var(--color-primary-1)]" : "border-[var(--color-bordercol)] focus:border-[var(--color-primary-1)]"
  }`;

  if (as === "textarea") {
    return (
      <>
        <div className="relative">
          <textarea name={name} rows={2} placeholder={placeholder} className={`${fieldClass} min-h-[64px] resize-none px-4 py-3 pr-10`} />
          <PencilLine className="absolute bottom-4 right-4 h-4 w-4 text-[var(--color-ink-3)]" />
        </div>
        <ErrorText message={error} />
      </>
    );
  }

  if (as === "select") {
    return (
      <>
        <div className="relative">
          <select name={name} defaultValue="" className={`${fieldClass} h-11 appearance-none pl-11 pr-10 text-[var(--color-ink-2)]`}>
            <option value="" disabled>{placeholder}</option>
            <option>Beauty Salon</option>
            <option>Hair Salon</option>
            <option>Nail Studio</option>
            <option>Skin Care Clinic</option>
            <option>Barbershop</option>
            <option>Lash & Brow Studio</option>
            <option>Spa & Wellness</option>
          </select>
          <Icon className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-ink-3)]" />
          <ChevronDown className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-ink-3)]" />
        </div>
        <ErrorText message={error} />
      </>
    );
  }

  return (
    <>
      <div className="relative">
        <input name={name} placeholder={placeholder} className={`${fieldClass} h-11 pl-11 pr-4`} />
        <Icon className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-ink-3)]" />
      </div>
      <ErrorText message={error} />
    </>
  );
}

export default function CTASection() {
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [statusMessage, setStatusMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("idle");
    setStatusMessage("");

    const form = event.currentTarget;
    const formData = new FormData(form);
    const values: FormValues = {
      fullName: getFieldValue(formData, "fullName"),
      email: getFieldValue(formData, "email"),
      businessName: getFieldValue(formData, "businessName"),
      phone: getFieldValue(formData, "phone"),
      industry: getFieldValue(formData, "industry"),
      currentWebsite: getFieldValue(formData, "currentWebsite"),
      goals: getFieldValue(formData, "goals"),
    };

    console.log("SalonVault form submit values:", values);

    const nextErrors = validate(values);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) return;

    setStatus("loading");

    try {
      if (!contactScriptUrl) {
        throw new Error("Form is not connected yet.");
      }

      await fetch(contactScriptUrl, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({
          ...values,
          submittedAt: new Date().toISOString(),
          source: "SalonVault Website",
        }),
      });

      form.reset();
      setStatus("success");
      setStatusMessage("Your request has been sent. We will contact you soon.");
    } catch (error) {
      setStatus("error");
      setStatusMessage(error instanceof Error ? error.message : "Unable to send your request right now.");
    }
  }

  return (
    <section id="contact" className=" py-6 md:py-8">
      <div className="container">
        <div className="relative isolate overflow-hidden rounded-[16px] border border-[var(--color-bordercol)] bg-[linear-gradient(120deg,#fff_0%,#fff5f7_48%,#fff_100%)] px-5 py-6 shadow-[0_12px_36px_rgba(17,17,17,0.045)] lg:min-h-[calc(100vh-132px)] lg:px-10 lg:py-8">
          <div className="pointer-events-none absolute -bottom-20 left-[-70px] h-64 w-64 rounded-full border border-[var(--color-blush-2)]" />
          <div className="pointer-events-none absolute left-[33%] top-[46%] hidden h-48 w-48 rounded-full bg-[var(--color-primary-3)] blur-2xl lg:block" />

          <div className="relative z-10 grid min-h-full gap-4 lg:grid-cols-[31%_48%_21%] lg:items-center">
            <div className="py-2">
              <p className="label-l1 flex items-center gap-2 text-[var(--color-primary-1)]">
                <Sparkles className="h-3.5 w-3.5 fill-[var(--color-primary-1)]" />
                Lets Work Together
              </p>
              <Reveal>
                <h2 className="heading-h1 mt-5 max-w-[430px] !leading-[1.08]">
                  Ready to Fill Your Calendar with <span className="text-[var(--color-primary-1)]">More Bookings?</span>
                </h2>
              </Reveal>
              <p className="para-p1 mt-5 max-w-[360px]">
                Tell us about your business and goals. We will create a custom plan to help you attract more clients and grow faster.
              </p>

              <div className="mt-7 grid gap-4">
                {benefits.map(({ icon: Icon, title, text }) => (
                  <div key={title} className="hover-lift flex items-center gap-4 rounded-[8px] p-2">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white text-[var(--color-primary-1)] shadow-[0_10px_24px_rgba(17,17,17,0.06)]">
                      <Icon className="h-5 w-5" strokeWidth={1.9} />
                    </div>
                    <div>
                      <h3 className="heading-h5 font-bold">{title}</h3>
                      <p className="para-p3 mt-1">{text}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-7 flex max-w-[330px] items-center gap-4 rounded-[8px] bg-[var(--color-primary-3)] px-4 py-4">
                <div className="flex -space-x-3">
                  {avatarUrls.map((url, index) => (
                    <Image key={url} src={url} alt={`Salon client ${index + 1}`} width={38} height={38} className="h-9 w-9 rounded-full border-2 border-white object-cover" />
                  ))}
                </div>
                <p className="para-p3">
                  Join <span className="font-extrabold text-[var(--color-primary-1)]"><CountUp end={500} suffix="+" /></span> beauty businesses growing with our solutions.
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} noValidate className="hover-lift rounded-[14px] border border-white/80 bg-white/88 p-5 shadow-[0_24px_70px_rgba(17,17,17,0.10)] backdrop-blur md:p-7">
              <div className="flex items-center gap-2">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary-1)] text-white shadow-[0_12px_28px_rgba(232,93,117,0.25)]">
                  <CalendarDays className="h-6 w-6" strokeWidth={1.9} />
                </div>
                <div>
                  <h3 className="heading-h3">Book Your Free Strategy Call</h3>
                  <p className="para-p3 mt-1">30-min personalized consultation</p>
                  <div className="mt-2 h-1 w-24 rounded-full bg-[var(--color-blush-2)]" />
                </div>
              </div>

              <div className="mt-4 grid gap-2 md:grid-cols-2">
                <label>
                  <span className="mb-2 block text-[12px] font-bold text-[var(--color-foreground)]">Full Name</span>
                  <InputShell icon={User} name="fullName" placeholder="Enter your full name" error={errors.fullName} />
                </label>
                <label>
                  <span className="mb-2 block text-[12px] font-bold text-[var(--color-foreground)]">Email Address</span>
                  <InputShell icon={Mail} name="email" placeholder="Enter your email" error={errors.email} />
                </label>
                <label>
                  <span className="mb-2 block text-[12px] font-bold text-[var(--color-foreground)]">Business Name</span>
                  <InputShell icon={Store} name="businessName" placeholder="Enter your business name" error={errors.businessName} />
                </label>
                <label>
                  <span className="mb-2 block text-[12px] font-bold text-[var(--color-foreground)]">Phone Number</span>
                  <InputShell icon={Phone} name="phone" placeholder="Enter your phone number" error={errors.phone} />
                </label>
                <label>
                  <span className="mb-2 block text-[12px] font-bold text-[var(--color-foreground)]">Industry</span>
                  <InputShell icon={Store} name="industry" placeholder="Select your industry" as="select" error={errors.industry} />
                </label>
                <label>
                  <span className="mb-2 block text-[12px] font-bold text-[var(--color-foreground)]">Current Website (if any)</span>
                  <InputShell icon={Globe2} name="currentWebsite" placeholder="yourwebsite.com" error={errors.currentWebsite} />
                </label>
                <label className="md:col-span-2">
                  <span className="mb-2 block text-[12px] font-bold text-[var(--color-foreground)]">What are your main goals?</span>
                  <InputShell icon={PencilLine} name="goals" placeholder="e.g., More bookings, brand redesign, website, etc." as="textarea" error={errors.goals} />
                </label>
              </div>

              <button
                type="submit"
                disabled={status === "loading"}
                className="mt-3 flex h-12 w-full items-center justify-center gap-3 rounded-[7px] bg-[var(--color-primary-1)] text-[13px] font-extrabold uppercase tracking-[0.02em] text-white shadow-[0_16px_34px_rgba(232,93,117,0.25)] transition-colors hover:bg-[var(--color-primary-2)] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {status === "loading" ? "Sending..." : "Schedule My Free Call"}
                <ArrowRight className="h-4 w-4" />
              </button>

              {statusMessage && (
                <p className={`para-p3 mt-3 flex items-center justify-center gap-2 rounded-[7px] px-3 py-2 text-center ${status === "success" ? "bg-[var(--color-primary-3)] text-[var(--color-primary-1)]" : "bg-red-50 text-red-600"}`}>
                  {status === "success" ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                  {statusMessage}
                </p>
              )}

              <p className="para-p3 mt-4 flex items-center justify-center gap-2 text-center">
                <Lock className="h-3.5 w-3.5" />
                Your information is safe with us. No spam, ever.
              </p>
            </form>

            <div className="relative hidden h-full min-h-[320px] overflow-hidden rounded-[12px] lg:block">
              <Image src="/assets/cta-1.png" alt="Salon owner in a pink blazer" fill sizes="320px" className="object-cover object-right" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
