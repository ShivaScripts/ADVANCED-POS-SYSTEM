// pos-frontend-vite/src/pages/common/Landing/WhyChooseUsSection.jsx

import { CheckCircle, BarChart3, TrendingUp, Users, DollarSign } from 'lucide-react'
import React from 'react'

const WhyChooseUsSection = () => {
  return (
    <section className="py-20 bg-background overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <div className="relative z-10">
              <div className="inline-block px-4 py-1.5 mb-6 text-sm font-semibold tracking-wider text-primary uppercase bg-primary/10 rounded-full">
                Why Z-POS?
              </div>
              <h2 className="text-3xl md:text-5xl font-extrabold text-foreground mb-6 leading-tight">
                Built for Growth, <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">
                  Designed for Speed.
                </span>
              </h2>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                We've obsessed over every pixel to create a POS system that doesn't just process payments, but actually helps you run a smarter, more profitable business.
              </p>
              
              <div className="space-y-5">
                {[
                  { text: "Zero training required - Intuitive Interface", color: "text-emerald-500" },
                  { text: "Works Offline - Never lose a sale", color: "text-blue-500" },
                  { text: "GST-Ready Instant Invoicing", color: "text-purple-500" },
                  { text: "Mobile-First Design for Managers", color: "text-orange-500" },
                  { text: "24x7 Dedicated Support Team", color: "text-pink-500" }
                ].map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-4 group">
                    <div className={`p-1 rounded-full bg-card border shadow-sm group-hover:scale-110 transition-transform duration-200`}>
                       <CheckCircle className={`w-5 h-5 ${benefit.color}`} />
                    </div>
                    <span className="text-foreground font-medium text-lg">{benefit.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Content - Dynamic Visual */}
            <div className="relative perspective-1000 mt-10 lg:mt-0 p-4">
              
              {/* Decorative Background Blobs */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-primary/20 to-blue-500/20 rounded-full blur-3xl opacity-50 animate-pulse-slow -z-10"></div>

              {/* Main Card */}
              <div className="bg-card border rounded-2xl shadow-2xl p-6 md:p-8 transform rotate-y-12 hover:rotate-0 transition-all duration-700 ease-out-back relative z-10">
                
                {/* Card Header */}
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h3 className="font-bold text-xl">Store Performance</h3>
                    <p className="text-sm text-muted-foreground">Last 7 Days</p>
                  </div>
                  <div className="p-3 bg-primary/10 rounded-xl text-primary">
                    <BarChart3 className="w-6 h-6" />
                  </div>
                </div>

                {/* Dynamic Chart */}
                <div className="flex items-end justify-between h-48 gap-3 mb-8 px-2">
                  {[40, 65, 45, 80, 55, 90, 75].map((height, i) => (
                    <div key={i} className="w-full bg-muted rounded-t-lg relative group overflow-hidden h-full flex items-end">
                      <div 
                        className="w-full bg-gradient-to-t from-primary to-blue-500 rounded-t-lg transition-all duration-1000 ease-out group-hover:opacity-80 relative"
                        style={{ height: `${height}%` }}
                      >
                        {/* Tooltip on hover */}
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-foreground text-background text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                          ₹{height}k
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-muted/50 rounded-xl border hover:bg-muted transition-colors">
                    <div className="flex items-center gap-2 mb-1 text-muted-foreground">
                      <DollarSign className="w-4 h-4" />
                      <span className="text-xs font-medium uppercase">Revenue</span>
                    </div>
                    <p className="text-2xl font-bold">₹4.2L</p>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-xl border hover:bg-muted transition-colors">
                    <div className="flex items-center gap-2 mb-1 text-muted-foreground">
                      <Users className="w-4 h-4" />
                      <span className="text-xs font-medium uppercase">Walk-ins</span>
                    </div>
                    <p className="text-2xl font-bold">1,240</p>
                  </div>
                </div>

              </div>

              {/* Floating Badge 1 (Growth) - Top Right Corner */}
              <div className="absolute -top-2 -right-0 md:-top-6 md:-right-6 bg-card p-4 rounded-xl shadow-xl border animate-bounce-subtle z-20">
                <div className="flex items-center gap-3">
                  <div className="bg-green-100 text-green-600 p-2 rounded-lg">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">Growth</p>
                    <p className="text-sm font-bold text-green-600">+24.5%</p>
                  </div>
                </div>
              </div>

              {/* Floating Badge 2 (New Orders) - FIXED POSITION (Bottom Left Corner) */}
              <div className="absolute -bottom-4 -left-2 md:-bottom-6 md:-left-6 bg-card p-4 rounded-xl shadow-xl border animate-pulse-slow z-20 hidden sm:block">
                 <div className="flex items-center gap-3">
                    <div className="bg-orange-100 text-orange-600 p-2 rounded-lg">
                       <CheckCircle className="w-5 h-5" />
                    </div>
                    <div>
                       <p className="text-xs text-muted-foreground font-medium">New Orders</p>
                       <p className="text-sm font-bold text-foreground">12 Pending</p>
                    </div>
                 </div>
              </div>

            </div>
          </div>
        </div>

        <style jsx>{`
          .perspective-1000 { perspective: 1000px; }
          .rotate-y-12 { transform: rotateY(-12deg) rotateX(5deg); }
          .ease-out-back { transition-timing-function: cubic-bezier(0.175, 0.885, 0.32, 1.275); }
          
          @keyframes bounce-subtle {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-8px); }
          }
          .animate-bounce-subtle { animation: bounce-subtle 3s infinite ease-in-out; }
          
          @keyframes pulse-slow {
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.9; transform: scale(0.98); }
          }
          .animate-pulse-slow { animation: pulse-slow 4s infinite ease-in-out; }
        `}</style>
      </section>
  )
}

export default WhyChooseUsSection