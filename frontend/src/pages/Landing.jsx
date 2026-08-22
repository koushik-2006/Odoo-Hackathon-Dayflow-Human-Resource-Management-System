import React from 'react';
import LandingNavbar from '../components/landing/LandingNavbar';
import Hero from '../components/landing/Hero';
import Stats from '../components/landing/Stats';
import Features from '../components/landing/Features';
import EmployeeSection from '../components/landing/EmployeeSection';
import AdminSection from '../components/landing/AdminSection';
import HowItWorks from '../components/landing/HowItWorks';
import DashboardPreview from '../components/landing/DashboardPreview';
import SecuritySection from '../components/landing/SecuritySection';
import CTA from '../components/landing/CTA';
import Footer from '../components/landing/Footer';
import KineticGrid from '../components/ui/KineticGrid';

export default function Landing() {
  return (
    <KineticGrid globalColor="default">
      <div className="min-h-screen text-[#111827] font-sans antialiased selection:bg-indigo-500 selection:text-white overflow-x-hidden">
        <LandingNavbar />
        <main>
          <Hero />
          <Stats />
          <Features />
          <EmployeeSection />
          <AdminSection />
          <HowItWorks />
          <DashboardPreview />
          <SecuritySection />
          <CTA />
        </main>
        <Footer />
      </div>
    </KineticGrid>
  );
}
