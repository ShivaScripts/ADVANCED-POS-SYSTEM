import React from 'react';
import { TrendingUp, Users, Search, Sparkles, CheckCircle2 } from 'lucide-react';

const RoadmapSection = () => {
  const roadmapItems = [
    {
      phase: "Phase 1",
      title: "Core Architecture",
      description: "Robust Spring Boot backend with React frontend, securing payments & inventory.",
      icon: <CheckCircle2 className="w-6 h-6 text-green-600" />,
      status: "live",
      color: "border-green-500 bg-green-500",
      badgeBg: "bg-green-100 text-green-700"
    },
    {
      phase: "Phase 2",
      title: "AI Forecasting",
      description: "ML models to predict stock shortages and recommend reorders automatically.",
      icon: <TrendingUp className="w-6 h-6 text-blue-600" />,
      status: "dev",
      color: "border-blue-500 bg-blue-500",
      badgeBg: "bg-blue-100 text-blue-700"
    },
    {
      phase: "Phase 3",
      title: "Smart Segments",
      description: "Clustering algorithms to identify VIP customers and churn risks.",
      icon: <Users className="w-6 h-6 text-purple-600" />,
      status: "planned",
      color: "border-purple-500 bg-purple-500",
      badgeBg: "bg-purple-100 text-purple-700"
    },
    {
      phase: "Phase 4",
      title: "Visual Search",
      description: "Computer Vision integration allowing product scanning via camera.",
      icon: <Search className="w-6 h-6 text-orange-600" />,
      status: "planned",
      color: "border-orange-500 bg-orange-500",
      badgeBg: "bg-orange-100 text-orange-700"
    }
  ];

  return (
    <section className="py-24 bg-background border-t border-border/50 overflow-hidden relative">
       {/* Background Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-[90vw] pointer-events-none">
         <div className="absolute top-1/4 left-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
         <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
      </div>

      {/* UPDATED: w-full for edge-to-edge layout */}
      <div className="w-full px-6 md:px-12 lg:px-20 relative z-10">
        
        <div className="text-center mb-24">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 text-sm font-bold tracking-wider text-primary uppercase bg-primary/10 rounded-full">
            <Sparkles className="w-4 h-4" /> Future Vision
          </div>
          <h2 className="text-4xl md:text-6xl font-extrabold text-foreground mb-6">
            The Evolution to <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-600">AI-Powered Retail</span>
          </h2>
          <p className="text-2xl text-muted-foreground max-w-3xl mx-auto">
            Z-POS isn't stopping here. We are actively integrating Artificial Intelligence to turn raw data into actionable business insights.
          </p>
        </div>

        <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          
          {/* Connecting Line (Desktop Only) */}
          <div className="hidden lg:block absolute top-[36px] left-[12.5%] right-[12.5%] h-1 bg-gradient-to-r from-green-200 via-blue-200 to-orange-200 -z-10"></div>

          {roadmapItems.map((item, index) => (
            <div key={index} className="relative group flex flex-col items-center text-center">
              
              {/* Status Dot */}
              <div className={`w-20 h-20 rounded-full bg-background border-[6px] ${item.color.split(' ')[0]} flex items-center justify-center z-10 shadow-xl mb-8 group-hover:scale-110 transition-transform duration-300`}>
                 <div className="bg-muted/50 p-3 rounded-full">
                    {item.icon}
                 </div>
              </div>

              {/* Card Content */}
              <div className="w-full bg-card border rounded-[2rem] p-8 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group-hover:border-primary/20 h-full flex flex-col">
                <div className="mb-6">
                   <span className={`text-xs font-bold uppercase px-4 py-1.5 rounded-full ${item.badgeBg}`}>
                      {item.status === 'live' ? 'Completed' : item.status === 'dev' ? 'In Progress' : 'Planned'}
                   </span>
                </div>
                
                <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RoadmapSection;