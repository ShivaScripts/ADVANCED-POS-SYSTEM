import React from 'react';
import { Github, Linkedin, Code2, ExternalLink, User, GraduationCap } from 'lucide-react';

const TestimonialCarousel = () => {
  return (
    <section className="py-24 bg-muted/30 relative overflow-hidden">
        {/* Background Decorative Blobs */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse-slow"></div>
            <div className="absolute bottom-[-10%] left-[-5%] w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
        </div>

        {/* UPDATED CONTAINER: w-full with wider padding instead of max-w-7xl */}
        <div className="w-full px-6 md:px-12 lg:px-24 relative z-10">
            
            {/* Header */}
            <div className="text-center mb-20">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                   <User className="w-4 h-4" /> Project Creator
                </div>
                
                <h2 className="text-4xl md:text-7xl font-extrabold text-foreground mb-6 tracking-tight">
                    Shivam <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">Deore</span>
                </h2>
                
                <div className="flex items-center justify-center gap-3 mb-8 text-muted-foreground">
                    <GraduationCap className="w-6 h-6 text-primary" />
                    <span className="text-xl font-medium">B.E. in Artificial Intelligence & Machine Learning</span>
                </div>

                <p className="text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed border-t border-border/40 pt-8">
                    Z-POS is an open-source project built with passion. Connect with me or explore the codebase to see how we're transforming retail tech.
                </p>
            </div>

            {/* Cards Grid - Spans Full Width */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
                
                {/* GitHub Profile Card */}
                <a
                    href="https://github.com/ShivaScripts"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative bg-card p-10 rounded-[2rem] border shadow-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 flex flex-col items-center text-center overflow-hidden"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-900/5 to-gray-900/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300 z-10 shadow-inner">
                        <Github className="w-12 h-12 text-gray-900 dark:text-white" />
                    </div>
                    <h3 className="text-3xl font-bold mb-3 z-10">GitHub Profile</h3>
                    <p className="text-lg text-muted-foreground mb-8 z-10 leading-relaxed">
                        Check out my repositories, contributions, and other open-source projects.
                    </p>
                    <span className="flex items-center gap-2 text-base font-bold text-primary z-10 group-hover:underline">
                        @ShivaScripts <ExternalLink className="w-5 h-5" />
                    </span>
                </a>

                {/* Project Repo Card */}
                <a
                    href="https://github.com/ShivaScripts"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative bg-card p-10 rounded-[2rem] border shadow-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 flex flex-col items-center text-center overflow-hidden"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300 z-10 shadow-inner">
                        <Code2 className="w-12 h-12 text-primary" />
                    </div>
                    <h3 className="text-3xl font-bold mb-3 z-10">Project Code</h3>
                    <p className="text-lg text-muted-foreground mb-8 z-10 leading-relaxed">
                        Dive into the Z-POS source code. Star the repo if you find it useful!
                    </p>
                    <span className="flex items-center gap-2 text-base font-bold text-primary z-10 group-hover:underline">
                        View Repository <ExternalLink className="w-5 h-5" />
                    </span>
                </a>

                {/* LinkedIn Card */}
                <a
                    href="https://www.linkedin.com/in/shivamdeore"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative bg-card p-10 rounded-[2rem] border shadow-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 flex flex-col items-center text-center overflow-hidden"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-blue-600/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="w-24 h-24 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300 z-10 shadow-inner">
                        <Linkedin className="w-12 h-12 text-blue-600" />
                    </div>
                    <h3 className="text-3xl font-bold mb-3 z-10">LinkedIn</h3>
                    <p className="text-lg text-muted-foreground mb-8 z-10 leading-relaxed">
                        Connect with me professionally. Let's discuss tech, projects, and opportunities.
                    </p>
                    <span className="flex items-center gap-2 text-base font-bold text-primary z-10 group-hover:underline">
                        Shivam Deore <ExternalLink className="w-5 h-5" />
                    </span>
                </a>

            </div>
        </div>
        
        <style jsx>{`
           @keyframes pulse-slow {
            0%, 100% { opacity: 0.5; transform: scale(1); }
            50% { opacity: 0.8; transform: scale(1.1); }
          }
          .animate-pulse-slow { animation: pulse-slow 6s infinite ease-in-out; } 
        `}</style>
    </section>
  );
};

export default TestimonialCarousel;