// pos-frontend-vite/src/pages/cashier/components/POSHeader.jsx

import React, { useState, useEffect } from "react";
import { Button } from "../../../components/ui/button";
import { useSidebar } from "../../../context/hooks/useSidebar";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../../Redux Toolkit/features/auth/authSlice";
import { Separator } from "@/components/ui/separator";
import { Clock, Store, User } from "lucide-react";

// A new component to show the live clock
const LiveClock = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    // Update the time every second
    const timerId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Clean up the interval on component unmount
    return () => clearInterval(timerId);
  }, []);

  const formattedTime = currentTime.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
  const formattedDate = currentTime.toLocaleDateString([], {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <Clock className="w-4 h-4" />
      <div className="text-right">
        <p className="font-medium text-foreground">{formattedTime}</p>
        <p className="text-xs">{formattedDate}</p>
      </div>
    </div>
  );
};

const POSHeader = () => {
  const { setSidebarOpen } = useSidebar();
  
  // Get data from Redux state
  const currentUser = useSelector(selectCurrentUser);
  const branch = useSelector((state) => state.branch.branch);

  return (
    <div className="bg-card border-b px-6 py-3"> {/* Adjusted padding */}
      <div className="flex items-center justify-between">
        
        {/* Left Side: Sidebar Toggle & Title */}
        <div className="flex items-center gap-4">
          <Button
            className="z-10 p-2 rounded shadow-sm border border-border"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open sidebar"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </Button>
          <h1 className="text-xl font-bold text-foreground">POS Terminal</h1>
        </div>

        {/* Right Side: Info Cluster */}
        <div className="flex items-center gap-4">
          
          {/* Live Clock */}
          <LiveClock />
          
          <Separator orientation="vertical" className="h-10" />

          {/* Branch Info */}
          {branch && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Store className="w-4 h-4" />
              <div>
                <p className="text-xs">Branch</p>
                <p className="font-medium text-foreground">{branch.name}</p>
              </div>
            </div>
          )}

          {/* Cashier Info */}
          {currentUser && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <User className="w-4 h-4" />
              <div>
                <p className="text-xs">Cashier</p>
                <p className="font-medium text-foreground">{currentUser.fullName}</p>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default POSHeader;