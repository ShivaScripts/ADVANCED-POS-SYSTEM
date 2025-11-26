// pos-frontend-vite/src/pages/common/Landing/TrustedLogos.jsx

import { Building2, Carrot, ShoppingBag, Coffee, Zap, Store, Briefcase, ShoppingCart } from 'lucide-react'
import React from 'react'

const TrustedLogos = () => {
  return (
    <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
              Trusted by leading retailers across India
            </h2>
            <p className="text-muted-foreground">Join thousands of successful businesses using our POS system</p>
          </div>
          
          {/* Logos Grid - Restored to 8 items */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 items-center">
            {[
              { 
                name: 'SuperMart', 
                icon: <Building2 className="w-6 h-6" />,
                bgColor: 'bg-gradient-to-br from-emerald-500 to-emerald-600',
                textColor: 'text-emerald-600'
              },
              { 
                name: 'Fresh Grocery', 
                icon: <Carrot className="w-6 h-6" />,
                bgColor: 'bg-gradient-to-br from-orange-500 to-orange-600',
                textColor: 'text-orange-600'
              },
              { 
                name: 'Fashion Hub', 
                icon: <ShoppingBag className="w-6 h-6" />,
                bgColor: 'bg-gradient-to-br from-blue-500 to-blue-600',
                textColor: 'text-blue-600'
              },
              { 
                name: 'Tech Zone', 
                icon: <Zap className="w-6 h-6" />,
                bgColor: 'bg-gradient-to-br from-purple-500 to-purple-600',
                textColor: 'text-purple-600'
              },
              { 
                name: 'Cafe Delight', 
                icon: <Coffee className="w-6 h-6" />,
                bgColor: 'bg-gradient-to-br from-amber-700 to-amber-800',
                textColor: 'text-amber-700'
              },
              { 
                name: 'Daily Needs', 
                icon: <Store className="w-6 h-6" />,
                bgColor: 'bg-gradient-to-br from-rose-500 to-rose-600',
                textColor: 'text-rose-600'
              },
              { 
                name: 'Urban Trends', 
                icon: <Briefcase className="w-6 h-6" />,
                bgColor: 'bg-gradient-to-br from-indigo-500 to-indigo-600',
                textColor: 'text-indigo-600'
              },
              { 
                name: 'Quick Mart', 
                icon: <ShoppingCart className="w-6 h-6" />,
                bgColor: 'bg-gradient-to-br from-teal-500 to-teal-600',
                textColor: 'text-teal-600'
              }
            ].map((brand, index) => (
              <div key={index} className="group relative">
                <div className={`absolute inset-0 ${brand.bgColor} blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-500 rounded-xl`}></div>
                <div className={`bg-card relative border hover:border-${brand.textColor.split('-')[1]}-200 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-3 p-4`}>
                  <div className={`w-10 h-10 ${brand.bgColor} rounded-lg flex items-center justify-center shadow-md`}>
                    <div className="text-white">
                      {brand.icon}
                    </div>
                  </div>
                  <span className={`font-bold text-sm ${brand.textColor} group-hover:scale-105 transition-transform duration-200`}>
                    {brand.name}
                  </span>
                </div>
              </div>
            ))}
          </div>
          
          {/* Stats Section Removed as requested */}
        </div>
    </section>
  )
}

export default TrustedLogos