import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Store, 
  ShoppingCart, 
  CheckCircle2, 
  ArrowRight,
  Lock,
  TrendingUp,
  CreditCard,
  Activity
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Define Roles Data
const ROLES = {
  admin: {
    id: 'admin',
    label: 'Super Admin',
    icon: <ShieldCheck className="w-4 h-4" />,
    title: "Complete Control from HQ",
    description: "Monitor your entire retail empire from a single dashboard. Track profit, manage multiple stores, and control user access globally.",
    features: [
      "Visual Dashboard (Profit, Sales, Expenses)",
      "Multi-Store Management & Creation",
      "Global Inventory & Product Master",
      "User Role Management (Invite/Ban)"
    ],
    color: "text-blue-600",
    bg: "bg-blue-50",
    accent: "from-blue-600 to-indigo-600",
    // Reliable Office/Dashboard Image
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1000",
    badgeIcon: <Lock className="w-5 h-5 text-white" />,
    badgeText: "Admin Access"
  },
  branch: {
    id: 'branch',
    label: 'Branch Manager',
    icon: <Store className="w-4 h-4" />,
    title: "Manage Operations Locally",
    description: "Empower your branch managers to handle day-to-day operations, stock adjustments, and staff without needing HQ intervention.",
    features: [
      "Real-time Branch Analytics",
      "Stock Adjustments & Damage Control",
      "Daily Expense Tracking (Utility, Rent)",
      "Local Staff Management"
    ],
    color: "text-orange-600",
    bg: "bg-orange-50",
    accent: "from-orange-500 to-red-500",
    // Reliable Store Interior Image
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=1000",
    badgeIcon: <TrendingUp className="w-5 h-5 text-white" />,
    badgeText: "Branch Metrics"
  },
  cashier: {
    id: 'cashier',
    label: 'Smart Cashier',
    icon: <ShoppingCart className="w-4 h-4" />,
    title: "Lightning Fast Billing",
    description: "Designed for speed. Process transactions in seconds with integrated payments and loyalty rewards to keep customers happy.",
    features: [
      "High-Speed POS Interface",
      "Integrated UPI & Razorpay",
      "Customer Loyalty & Reward Points",
      "Instant Invoice Generation"
    ],
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    accent: "from-emerald-500 to-green-600",
    // Reliable Payment Terminal Image (New URL)
    image: "https://images.unsplash.com/photo-1556742044-3c52d6e88c62?auto=format&fit=crop&q=80&w=1000",
    badgeIcon: <CreditCard className="w-5 h-5 text-white" />,
    badgeText: "POS Terminal"
  }
};

const LiveDemoSection = () => {
  const [activeTab, setActiveTab] = useState('admin');
  const navigate = useNavigate();
  const activeRole = ROLES[activeTab];

  const handleExploreClick = () => {
    navigate('/auth/onboarding');
  };

  return (
    <section className="py-24 bg-gradient-to-b from-background to-muted/30 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-extrabold text-foreground mb-6 tracking-tight">
            Built for Every <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-600">Team Member</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Z-POS provides dedicated, powerful interfaces tailored to the specific needs of your staff.
          </p>
        </div>

        {/* Tabs Navigation */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {Object.values(ROLES).map((role) => (
            <button
              key={role.id}
              onClick={() => setActiveTab(role.id)}
              className={`
                flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold transition-all duration-300 border shadow-sm
                ${activeTab === role.id 
                  ? `bg-foreground text-background scale-105 ring-2 ring-offset-2 ring-offset-background ring-foreground` 
                  : 'bg-card hover:bg-muted text-muted-foreground hover:text-foreground border-border'
                }
              `}
            >
              {role.icon}
              {role.label}
            </button>
          ))}
        </div>

        {/* Main Content Card */}
        <div className="bg-card rounded-3xl shadow-2xl border overflow-hidden relative transition-all duration-500 group hover:shadow-3xl">
          
          {/* Active Background Gradient Line */}
          <div className={`absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r ${activeRole.accent}`}></div>

          <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[500px]">
            
            {/* Left: Text Content */}
            <div className="p-8 md:p-12 flex flex-col justify-center relative z-10 order-2 lg:order-1">
              
              {/* Role Label */}
              <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full w-fit text-xs font-bold uppercase tracking-wider mb-6 ${activeRole.bg} ${activeRole.color}`}>
                {activeRole.icon} {activeRole.label} View
              </div>
              
              {/* Title with Animation */}
              <h3 
                key={activeTab + 'title'}
                className="text-3xl md:text-4xl font-bold mb-6 text-foreground animate-in fade-in slide-in-from-left-4 duration-500"
              >
                {activeRole.title}
              </h3>
              
              {/* Description */}
              <p 
                key={activeTab + 'desc'}
                className="text-lg text-muted-foreground mb-8 leading-relaxed animate-in fade-in slide-in-from-left-4 duration-500 delay-75"
              >
                {activeRole.description}
              </p>
              
              {/* Features List */}
              <ul className="space-y-4 mb-10">
                {activeRole.features.map((feature, idx) => (
                  <li 
                    key={`${activeTab}-${idx}`}
                    className="flex items-center gap-3 animate-in fade-in slide-in-from-left-8 duration-500"
                    style={{ animationDelay: `${100 + (idx * 50)}ms` }}
                  >
                    <div className={`mt-1 p-0.5 rounded-full ${activeRole.bg}`}>
                      <CheckCircle2 className={`w-5 h-5 ${activeRole.color}`} />
                    </div>
                    <span className="font-medium text-foreground">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* Action Button */}
              <button 
                onClick={handleExploreClick}
                className={`
                  flex items-center gap-2 font-bold text-lg group-hover:translate-x-2 transition-all duration-300
                  text-transparent bg-clip-text bg-gradient-to-r ${activeRole.accent} w-fit
                `}
              >
                Start as {activeRole.label} <ArrowRight className={`w-5 h-5 text-foreground`} />
              </button>
            </div>

            {/* Right: Dynamic Image Area */}
            <div className="relative h-[300px] lg:h-auto bg-muted overflow-hidden order-1 lg:order-2">
               
               {/* Main Image with Zoom Effect */}
               <img 
                 key={activeRole.image} 
                 src={activeRole.image} 
                 alt={activeRole.title}
                 className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 hover:scale-105 animate-in fade-in zoom-in-95 duration-700"
               />
               
               {/* Overlay Gradient */}
               <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent lg:bg-gradient-to-l lg:from-transparent lg:to-black/10"></div>

               {/* Floating DYNAMIC Badge (Fixed Position & Added Pulse) */}
               <div className="absolute bottom-4 right-4 lg:bottom-6 lg:right-6 bg-background/90 backdrop-blur-md p-4 rounded-2xl shadow-2xl border border-white/20 animate-in slide-in-from-bottom-8 duration-700 delay-200 min-w-[200px]">
                 
                 {/* Live Status Indicator */}
                 <div className="flex items-center justify-between mb-3 pb-3 border-b border-border/50">
                    <div className="flex items-center gap-2">
                        <span className="relative flex h-2.5 w-2.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                        </span>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">System Active</span>
                    </div>
                    <Activity className="w-3 h-3 text-muted-foreground" />
                 </div>

                 <div className="flex items-center gap-3">
                   <div className={`p-3 rounded-xl bg-gradient-to-br ${activeRole.accent} shadow-lg text-white`}>
                     {activeRole.badgeIcon}
                   </div>
                   <div>
                     <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Current View</p>
                     <p className="font-bold text-foreground text-sm">{activeRole.badgeText}</p>
                   </div>
                 </div>
               </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default LiveDemoSection;