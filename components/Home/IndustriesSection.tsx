import { GiEyelashes, GiHairStrands, GiFingernail, GiPaintBrush  } from "react-icons/gi";
import { RxScissors } from "react-icons/rx";
import { MdFace4 } from "react-icons/md";
import Reveal from "@/components/ui/reveal";




type IconProps = {
  className?: string;
};

type Industry = {
  icon: (props: IconProps) => React.ReactNode;
  title: string;
  text: string;
};

const industries: Industry[] = [
  {
    icon: MdFace4,
    title: "Beauty Salons",
    text: "Complete salon websites that showcase your services, team, and transformation.",
  },
  {
    icon: GiHairStrands,
    title: "Hair Salons",
    text: "Modern websites for hair specialists, color experts, and styling professionals.",
  },
  {
    icon: GiFingernail,
    title: "Nail Studios",
    text: "Elegant, feminine designs for nail salons & spas that drive bookings.",
  },
  {
    icon: GiPaintBrush,
    title: "Beauty & Skin Care",
    text: "Build trust and attract more clients with clean, calming, and professional designs.",
  },
  {
    icon: RxScissors,
    title: "Barbershops",
    text: "Bold, clean websites for barbershops that stand out and bring in more clients.",
  },
  {
    icon: GiEyelashes,
    title: "Lash & Brow Studios",
    text: "Highlight your detail-oriented services with stunning, conversion-focused websites.",
  },
];

export default function IndustriesSection() {
  return (
    <section id="industries" className="relative overflow-hidden  to-white py-8 md:py-10 lg:py-10">
      <div className="container">
        <Reveal className="mx-auto max-w-[760px] text-center">
          <p className="label-l1 text-[var(--color-primary-1)]">Industries We Serve</p>
          <h2 className="heading-h2 mt-3">
            Web Design for <span className="text-[var(--color-primary-1)]">Every Beauty Niche</span>
          </h2>
          <p className="para-p2 mx-auto mt-3 max-w-[560px]">
            We understand the beauty industry and create websites that match your niche, attract your ideal clients, and grow your business.
          </p>
        </Reveal>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {industries.map(({ icon: Icon, title, text }) => (
            <article
              key={title}
              className="hover-lift flex min-h-[170px] flex-col items-center rounded-[8px] border border-[var(--color-bordercol)] bg-white/92 px-5 py-6 text-center shadow-[0_10px_26px_rgba(17,17,17,0.045)]"
            >
              <Icon className="h-11 w-11 bg-transparent text-[var(--color-primary-1)]" />
              <h3 className="heading-h5 mt-4 font-bold">{title}</h3>
              <p className="para-p3 mt-2 max-w-[165px]">{text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
