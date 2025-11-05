import { AuthButton } from "@/components/auth-button";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { hasEnvVars } from "@/lib/utils";
import Link from "next/link";
import { HeroSection } from "@/components/landing/hero-section";
import { AboutSection } from "@/components/landing/about-section";
import { FeaturesSection } from "@/components/landing/features-section";
import { PricingSection } from "@/components/membership/pricing-section";
import { CTASection } from "@/components/landing/cta-section";
import { FAQSection } from "@/components/landing/faq-section";
import { FooterSection } from "@/components/landing/footer-section";

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Navigation */}
      <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16 sticky top-0 bg-background/80 backdrop-blur-sm z-50">
        <div className="w-full max-w-7xl flex justify-between items-center p-3 px-5 text-sm">
          <div className="flex gap-5 items-center font-semibold">
            <Link href={"/"} className="text-xl font-bold text-primary">
              Chinese<span className="text-orange-500">101</span>
            </Link>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm">
            <Link href="#features" className="hover:text-primary transition-colors">Features</Link>
            <Link href="#pricing" className="hover:text-primary transition-colors">Pricing</Link>
            <Link href="#faq" className="hover:text-primary transition-colors">FAQ</Link>
          </div>
          <div className="flex items-center gap-4">
            <ThemeSwitcher />
            {hasEnvVars && <AuthButton />}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex flex-col">
        <HeroSection />
        <AboutSection />
        <FeaturesSection />
        <PricingSection />
        <CTASection />
        <FAQSection />
        <FooterSection />
      </div>
    </main>
  );
}
