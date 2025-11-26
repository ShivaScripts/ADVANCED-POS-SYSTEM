import React from 'react';
import { Github, Linkedin, Mail, Code2, MapPin, Download, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-card border-t border-border/50 relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-20"></div>
      
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8">
          
          {/* --- Column 1: Developer Profile (For Recruiter) --- */}
          <div className="lg:col-span-5 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                <Code2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground">Shivam Deore</h3>
                <p className="text-xs font-medium text-primary uppercase tracking-wider">Full Stack & AI Engineer</p>
              </div>
            </div>
            
            <p className="text-muted-foreground leading-relaxed max-w-md">
              A comprehensive <strong>Point of Sale (POS)</strong> system engineered with <strong>Spring Boot</strong>, <strong>React</strong>, and <strong>Cloud Architecture</strong>. 
              <br /><br />
              I specialize in building scalable, secure, and intelligent applications. Currently open to <strong>SDE / Full Stack</strong> opportunities.
            </p>

            <div className="flex items-center gap-4">
               <a 
                 href="https://www.linkedin.com/in/shivamdeore" 
                 target="_blank" 
                 rel="noreferrer"
                 className="flex items-center gap-2 px-4 py-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors font-medium text-sm group"
               >
                 <Linkedin className="w-4 h-4" /> 
                 Connect on LinkedIn
                 <ExternalLink className="w-3 h-3 opacity-70 group-hover:translate-x-0.5 transition-transform" />
               </a>
               <a 
                 href="https://github.com/ShivaScripts" 
                 target="_blank" 
                 rel="noreferrer"
                 className="p-2 rounded-full bg-muted hover:bg-foreground hover:text-background transition-colors"
                 title="View GitHub Profile"
               >
                 <Github className="w-5 h-5" />
               </a>
               <a 
                 href="mailto:shivamdeore@example.com" // Replace with your real email if desired
                 className="p-2 rounded-full bg-muted hover:bg-foreground hover:text-background transition-colors"
                 title="Send Email"
               >
                 <Mail className="w-5 h-5" />
               </a>
            </div>
          </div>

          {/* --- Column 2: Project Links --- */}
          <div className="lg:col-span-3 space-y-6">
            <h4 className="text-sm font-bold text-foreground uppercase tracking-wider">Project Resources</h4>
            <ul className="space-y-3">
              <li>
                <a href="#features" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2">
                  Core Features
                </a>
              </li>
              <li>
                <a href="#infrastructure" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2">
                  Tech Stack & Architecture
                </a>
              </li>
              <li>
                <a href="#roadmap" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2">
                  AI Future Roadmap
                </a>
              </li>
              <li>
                <a href="https://github.com/ShivaScripts" target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2">
                  Source Code Repository
                </a>
              </li>
            </ul>
          </div>

          {/* --- Column 3: Quick Contact / Status --- */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-muted/30 rounded-2xl p-6 border border-border/50">
              <h4 className="font-bold text-foreground mb-2">Looking for a Developer?</h4>
              <p className="text-sm text-muted-foreground mb-4">
                I am currently available for roles involving <strong>Java, React, AWS,</strong> or <strong>AI/ML</strong> integration.
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4 text-primary" />
                  <span>Open to Relocation / Remote</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                  <span className="text-green-600 font-medium">Available to join immediately</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-border/50 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground text-center md:text-left">
            © {currentYear} Z-POS Project. Designed & Developed by <span className="text-foreground font-medium">Shivam Deore</span>.
          </p>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <span>Built with ❤️ using React & Spring Boot</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;