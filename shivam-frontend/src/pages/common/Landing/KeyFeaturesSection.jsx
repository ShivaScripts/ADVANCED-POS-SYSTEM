// pos-frontend-vite/src/pages/common/Landing/KeyFeaturesSection.jsx

import React from 'react'
import { 
  LayoutDashboard, 
  Store, 
  ShoppingCart, 
  CreditCard, 
  Gift, 
  BellRing, 
  Users, 
  BarChart4, 
  PackageCheck 
} from 'lucide-react'

const keyFeatures = [
  // --- CASHIER & CUSTOMER FEATURES ---
  {
    icon: <Gift className="w-8 h-8" />,
    title: "Smart Loyalty System",
    description: "Turn one-time buyers into regulars. Customers auto-earn reward points on purchases and redeem them on their next visit."
  },
  {
    icon: <CreditCard className="w-8 h-8" />,
    title: "Integrated Digital Payments",
    description: "Modernize your checkout. Accept payments via UPI, Razorpay, and Credit/Debit cards directly within the POS interface."
  },
  {
    icon: <ShoppingCart className="w-8 h-8" />,
    title: "Lightning-Fast Billing",
    description: "Process transactions in seconds with our optimized Point of Sale interface, barcode scanning, and instant invoice generation."
  },

  // --- BRANCH & INVENTORY FEATURES ---
  {
    icon: <PackageCheck className="w-8 h-8" />,
    title: "Stock & Inventory Control",
    description: "Never run out of best-sellers. Manage stock levels, handle adjustments for damages, and track inventory movement in real-time."
  },
  {
    icon: <BellRing className="w-8 h-8" />,
    title: "Smart Low-Stock Alerts",
    description: "Get notified immediately when products run low or if a branch has zero sales activity, so you can take action instantly."
  },
  {
    icon: <BarChart4 className="w-8 h-8" />,
    title: "Expense & Purchase Tracking",
    description: "Know your true profit. Log daily operational expenses (rent, utilities) and track supplier purchase orders seamlessly."
  },

  // --- ADMIN & MANAGEMENT FEATURES ---
  {
    icon: <Store className="w-8 h-8" />,
    title: "Multi-Store Management",
    description: "Scale your business without the chaos. Control multiple branches, staff, and pricing from one centralized Super Admin dashboard."
  },
  {
    icon: <LayoutDashboard className="w-8 h-8" />,
    title: "Visual Analytics Dashboard",
    description: "Make data-driven decisions. View clear graphs for Total Net Profit, Sales Trends, and Expense breakdowns across all stores."
  },
  {
    icon: <Users className="w-8 h-8" />,
    title: "Role-Based Access Control",
    description: "Secure your data. Assign specific roles (Store Admin, Branch Manager, Cashier) with distinct permissions for every employee."
  }
]

const KeyFeaturesSection = () => {
  return (
    <section id="features" className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-1.5 mb-4 text-sm font-semibold tracking-wider text-primary uppercase bg-primary/10 rounded-full">
              Features
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Complete Control. <span className="text-primary">Zero Chaos.</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              From the cashier's counter to the admin's desk, Z-POS provides the tools you need to run a smarter retail business.
            </p>
          </div>
          
          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {keyFeatures.map((feature, index) => (
              <div key={index} className="bg-card rounded-xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border hover:-translate-y-1 group">
                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6 text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
    </section>
  )
}

export default KeyFeaturesSection