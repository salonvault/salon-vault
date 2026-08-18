
import Hero from "@/components/Home/Hero"
import CTASection from "@/components/Home/CTASection"
import FAQs from "@/components/Home/FAQs"
import IndustriesSection from "@/components/Home/IndustriesSection"
import OurProcessesSection from "@/components/Home/OurProcessesSection"
import PricingSection from "@/components/Home/PricingSection"
import ProvenResultsSection from "@/components/Home/ProvenResultsSection"
import RealResultsSection from "@/components/Home/RealResultsSection"
import TestimonialSection from "@/components/Home/TestimonialSection"
import WhyUsSection from "@/components/Home/WhyUsSection"
import WorkSection from "@/components/Home/WorkSection"
import Footer from "@/components/Layout/Footer"
import Header from "@/components/Layout/Header"
import WhatsAppFloat from "@/components/Layout/WhatsAppFloat"
import ChatbotWidget from "@/components/chatbot/ChatbotWidget"


function page() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        <Hero />
        <IndustriesSection />
        <OurProcessesSection />
        <RealResultsSection />
        <ProvenResultsSection />
        <WorkSection />
        <WhyUsSection />
        <PricingSection />
        <TestimonialSection />
        <CTASection />
        <FAQs />
      </main>
      <Footer />
      <ChatbotWidget />
      <WhatsAppFloat />
    </div>
  )
}

export default page
