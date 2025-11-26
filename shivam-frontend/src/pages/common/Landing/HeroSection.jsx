// pos-frontend-vite/src/pages/common/Landing/HeroSection.jsx

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button"; 
import { ArrowRight, Github, Server, Database, Layout, Cloud, Code2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const navigate = useNavigate();
  const [text, setText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(150);

  const phrases = ["POS System", "Retail Solution", "Business Engine"];

  useEffect(() => {
    const handleTyping = () => {
      const i = loopNum % phrases.length;
      const fullText = phrases[i];

      setText(isDeleting 
        ? fullText.substring(0, text.length - 1) 
        : fullText.substring(0, text.length + 1)
      );

      setTypingSpeed(isDeleting ? 50 : 150);

      if (!isDeleting && text === fullText) {
        setTimeout(() => setIsDeleting(true), 2000); // Pause at full text
      } else if (isDeleting && text === "") {
        setIsDeleting(false);
        setLoopNum(loopNum + 1);
      }
    };

    const timer = setTimeout(handleTyping, typingSpeed);
    return () => clearTimeout(timer);
  }, [text, isDeleting, loopNum, typingSpeed]);

  const handleExploreClick = () => {
    navigate('/auth/login');
  }

  const handleGithubClick = () => {
    window.open("https://github.com/ShivaScripts", "_blank");
  }

  return (
    <section className="min-h-screen relative flex items-center overflow-hidden bg-background pt-20 lg:pt-0">
      
      {/* --- 1. DYNAMIC BACKGROUND --- */}
      <div className="absolute inset-0 w-full h-full z-0">
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        {/* Radial Gradient Fade */}
        <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-background/50"></div>
        
        {/* Animated Blobs */}
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-primary/20 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-500/20 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      </div>

      {/* --- 2. MAIN CONTENT CONTAINER (Split Layout) --- */}
      <div className="w-full max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        
        {/* --- LEFT COLUMN: TEXT & CTAS --- */}
        <div className="flex flex-col justify-center text-center lg:text-left pt-10 lg:pt-0">
            
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-bold mb-6 w-fit mx-auto lg:mx-0 animate-fade-in">
              <Code2 className="w-4 h-4" />
              Full Stack Project Showcase
            </div>
            
            {/* Headline with Typing Effect */}
            <h1 className="text-5xl md:text-7xl font-extrabold text-foreground tracking-tight mb-6 leading-[1.1] min-h-[160px] md:min-h-[auto]">
              Enterprise Grade <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-600 to-primary animate-gradient-x">
                {text}
              </span>
              <span className="animate-pulse text-primary ml-1">|</span>
            </h1>
            
            {/* Subheadline */}
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed max-w-2xl mx-auto lg:mx-0">
              A comprehensive retail management solution built with <strong>Spring Boot</strong> and <strong>React</strong>. Features real-time inventory, role-based security, and cloud-native architecture.
            </p>
            
            {/* Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start mb-10">
              <Button 
                size="lg" 
                className="w-full sm:w-auto h-14 px-8 text-lg gap-2 rounded-full shadow-xl shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-1 transition-all duration-300"
                onClick={handleExploreClick}
              >
                Explore Live App <ArrowRight className="w-5 h-5" />
              </Button>
              <Button 
                variant="outline"
                size="lg" 
                className="w-full sm:w-auto h-14 px-8 text-lg gap-2 rounded-full border-2 hover:bg-muted/50"
                onClick={handleGithubClick}
              >
                <Github className="w-5 h-5" /> View Source Code
              </Button>
            </div>
            
            {/* Tech Stack Indicators */}
            <div className="flex flex-col items-center lg:items-start gap-4 pt-8 border-t border-border/50">
              <span className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Built With Modern Tech</span>
              <div className="flex items-center gap-6 text-muted-foreground">
                 <div className="flex items-center gap-2 hover:text-green-600 transition-colors" title="Spring Boot">
                    <Server className="w-6 h-6" />
                    <span className="font-semibold">Spring Boot</span>
                 </div>
                 <div className="flex items-center gap-2 hover:text-blue-500 transition-colors" title="React">
                    <Layout className="w-6 h-6" />
                    <span className="font-semibold">React</span>
                 </div>
                 <div className="flex items-center gap-2 hover:text-orange-500 transition-colors" title="AWS">
                    <Cloud className="w-6 h-6" />
                    <span className="font-semibold">AWS</span>
                 </div>
                 <div className="flex items-center gap-2 hover:text-indigo-500 transition-colors" title="MySQL">
                    <Database className="w-6 h-6" />
                    <span className="font-semibold">MySQL</span>
                 </div>
              </div>
            </div>
        </div>

        {/* --- RIGHT COLUMN: 3D DASHBOARD VISUAL --- */}
        <div className="relative hidden lg:block h-[600px] perspective-1000">
           
           {/* The Floating Card Container */}
           <div className="relative w-full h-full transform rotate-y-12 rotate-x-6 transition-transform duration-700 hover:rotate-0 hover:scale-105">
              
              {/* Main Dashboard Card */}
              <div className="absolute inset-4 bg-card/90 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
                 
                 {/* Mockup Header */}
                 <div className="h-12 bg-muted/50 border-b flex items-center px-4 gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                    <div className="ml-auto bg-background/50 px-3 py-1 rounded-md text-xs font-mono text-muted-foreground">admin.zpos.app</div>
                 </div>

                 {/* Mockup Content */}
                 <div className="flex-1 p-6 grid grid-cols-3 gap-6">
                    {/* Sidebar */}
                    <div className="col-span-1 bg-muted/30 rounded-xl p-4 space-y-3">
                       <div className="h-8 bg-primary/20 rounded-lg w-3/4 mb-6"></div>
                       <div className="h-4 bg-muted-foreground/10 rounded w-full"></div>
                       <div className="h-4 bg-muted-foreground/10 rounded w-5/6"></div>
                       <div className="h-4 bg-muted-foreground/10 rounded w-4/6"></div>
                       <div className="h-4 bg-muted-foreground/10 rounded w-5/6"></div>
                    </div>
                    
                    {/* Main Chart Area */}
                    <div className="col-span-2 space-y-6">
                       <div className="flex gap-4">
                          <div className="flex-1 bg-primary/5 p-4 rounded-xl border border-primary/10">
                             <div className="text-xs text-muted-foreground mb-1">Total Revenue</div>
                             <div className="text-2xl font-bold text-primary">₹12.5L</div>
                          </div>
                          <div className="flex-1 bg-orange-500/5 p-4 rounded-xl border border-orange-500/10">
                             <div className="text-xs text-muted-foreground mb-1">Active Orders</div>
                             <div className="text-2xl font-bold text-orange-600">1,240</div>
                          </div>
                       </div>
                       
                       {/* Fake Chart Bars */}
                       <div className="h-48 bg-muted/30 rounded-xl p-4 flex items-end justify-between gap-2">
                          {[40, 70, 45, 90, 60, 80, 50, 95, 65, 85].map((h, i) => (
                             <div key={i} style={{height: `${h}%`}} className="w-full bg-gradient-to-t from-primary/40 to-primary rounded-t-sm hover:opacity-80 transition-opacity"></div>
                          ))}
                       </div>
                    </div>
                 </div>
              </div>

           </div>
        </div>

      </div>

      <style jsx>{`
        .perspective-1000 { perspective: 1000px; }
        .rotate-y-12 { transform: rotateY(-12deg) rotateX(5deg); }
        .rotate-x-6 { transform: rotateX(6deg); }
      `}</style>
    </section>
  );
};

export default HeroSection;