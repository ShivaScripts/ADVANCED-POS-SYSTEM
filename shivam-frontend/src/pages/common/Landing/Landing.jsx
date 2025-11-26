import React, { useEffect, useRef, useState } from 'react';
import Header from "./Header";
import HeroSection from "./HeroSection";
import TrustedLogos from "./TrustedLogos";
import KeyFeaturesSection from "./KeyFeaturesSection";
import WhyChooseUsSection from "./WhyChooseUsSection";
import LiveDemoSection from "./LiveDemoSection";
import TestimonialCarousel from "./TestimonialCarousel"; 
import TechStackSection from "./TechStackSection"; 
import RoadmapSection from "./RoadmapSection"; 
import Footer from "./Footer";

// --- UPDATED: Scroll Reveal Component accepts 'id' ---
const RevealSection = ({ children, id }) => { // Added 'id' prop here
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target); 
        }
      },
      { threshold: 0.15 } 
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, []);

  return (
    <div
      id={id} // Apply the ID here so the Header can find it
      ref={ref}
      className={`transition-all duration-1000 ease-out transform ${
        isVisible 
          ? 'opacity-100 translate-y-0 blur-0' 
          : 'opacity-0 translate-y-16 blur-sm'
      }`}
    >
      {children}
    </div>
  );
};

function Landing() {
  return (
    <div className="min-h-screen bg-background overflow-hidden">
      <Header />
      <HeroSection />

      <RevealSection>
        <TrustedLogos />
      </RevealSection>

      {/* Added ID="features" for Features Button */}
      <RevealSection id="features">
        <KeyFeaturesSection />
      </RevealSection>

      <RevealSection>
        <WhyChooseUsSection />
      </RevealSection>

      <RevealSection>
        <LiveDemoSection />
      </RevealSection>

      <RevealSection>
        <TestimonialCarousel />
      </RevealSection>
      
      {/* Added ID="infrastructure" for Resources Button */}
      <RevealSection id="infrastructure">
        <TechStackSection /> 
      </RevealSection>
      
      <RevealSection>
        <RoadmapSection />
      </RevealSection>

      {/* Added ID="creator" for Contact Button */}
      <div id="creator">
        <Footer />
      </div>
    </div>
  );
}

export default Landing;