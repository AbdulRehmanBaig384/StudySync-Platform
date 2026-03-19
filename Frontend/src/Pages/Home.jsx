import React from 'react'
import Navbar from '../components/Navbar'
import HeroSection from '../components/HeroSection'
import FeaturesSection from '../components/FeaturesSection'
import StudyRoomsSection from '../components/StudyRoomsSection'
import TeacherSection from '../components/TeacherSection'
import BenefitsSection from '../components/BenefitsSection'
import HowItWorksSection from '../components/HowItWorksSection'
import TestimonialsSection from '../components/TestimonialsSection'
import PoetSection from '../components/PoetSection'
import CTASection from '../components/CTASection'
import Footer from '../components/Footer'

const Home = () => {
  return (
    <div className="min-h-screen bg-[#0a0f1e]">
      {/* Sticky Navigation */}
      <Navbar />

      {/* 1. Hero Section */}
      <HeroSection />

      {/* 2. Feature Cards */}
      <FeaturesSection />

      {/* 3. Study Rooms */}
      <StudyRoomsSection />

      {/* 4. Teacher & Mentor Facilities */}
      <TeacherSection />

      {/* 5. Platform Benefits */}
      <BenefitsSection />

      {/* 6. How StudySync Works */}
      <HowItWorksSection />

      {/* 7. Testimonials */}
      <TestimonialsSection />

      {/* 8. Poet & Education Inspiration */}
      <PoetSection />

      {/* 9. Call To Action */}
      <CTASection />

      {/* 9. Footer */}
      <Footer />
    </div>
  )
}

export default Home
