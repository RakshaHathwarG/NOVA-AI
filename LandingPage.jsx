import MainLayout from '../layouts/MainLayout'
import Hero from '../components/landing/Hero'
import Features from '../components/landing/Features'
import HowItWorks from '../components/landing/HowItWorks'
import TechStack from '../components/landing/TechStack'
import CTA from '../components/landing/CTA'
import PageTransition from '../components/effects/PageTransition'


export default function LandingPage() {
  return (
    <div className="relative min-h-screen bg-[#020511]">
      <MainLayout showAmbientBg={false}>
        <PageTransition>
          <Hero />
          <Features />
          <HowItWorks />
          <TechStack />
          <CTA />
        </PageTransition>
      </MainLayout>

    </div>
  )
}
