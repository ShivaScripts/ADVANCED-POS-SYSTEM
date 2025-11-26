import React from "react";
import { Store, CreditCard, HelpCircle } from "lucide-react";

// --- START FIX: Accept 'setActiveSection' as a prop ---
const SettingsNavigation = ({ activeSection, setActiveSection }) => {
// --- END FIX ---

  const navItems = [
    {
      id: "store-settings",
      label: "Store Settings",
      icon: Store,
      href: "#store-settings" // We can keep href for accessibility
    },
    {
      id: "payment-settings",
      label: "Payment Settings",
      icon: CreditCard,
      href: "#payment-settings"
    },
    {
      id: "help",
      label: "Help & Support",
      icon: HelpCircle,
      href: "#help"
    }
  ];

  // --- START FIX: Handle click logic ---
  const handleClick = (e, id) => {
    e.preventDefault(); // Stop the 'a' tag from jumping the page
    setActiveSection(id); // Set the active section in the parent state
  };
  // --- END FIX ---

  return (
    <nav className="space-y-1">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeSection === item.id;
        
        return (
          <a
            key={item.id}
            href={item.href}
            // --- START FIX: Add onClick handler ---
            onClick={(e) => handleClick(e, item.id)}
            // --- END FIX ---
            className={`flex items-center px-3 py-2 text-sm font-medium rounded-md cursor-pointer ${ // Added cursor-pointer
              isActive
                ? "bg-primary text-primary-foreground" // Use primary color for active
                : "text-muted-foreground hover:bg-muted" // Use muted for inactive
            }`}
          >
            <Icon className={`mr-3 h-5 w-5 ${
              isActive ? "text-primary-foreground" : "text-muted-foreground" // Match text color
            }`} />
            {item.label}
          </a>
        );
      })}
    </nav>
  );
};

export default SettingsNavigation;