// pos-frontend-vite/src/pages/Branch Manager/Dashboard/BranchManagerTopbar.jsx

import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Bell, User, LogOut, Archive } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  selectLowStockItemCount,
  selectIsBranchAlertsViewed,
  markBranchAlertsAsViewed,
} from "@/Redux Toolkit/features/branchAnalytics/branchAnalyticsSlice";
// import { selectCurrentUser } from "@/Redux Toolkit/features/auth/authSlice"; // <-- No longer needed
import { logout } from "@/Redux Toolkit/features/user/userThunks";
import { toast } from "sonner";

export default function BranchManagerTopbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Get User & Branch Info
  // const { userProfile } = useSelector((state) => state.user); // <-- This is the one we should use
  const { branch } = useSelector((state) => state.branch);
  
  // --- START: THE FIX ---
  // Get the user info from state.user.userProfile, which is populated by getUserProfile thunk
  const currentUser = useSelector((state) => state.user.userProfile);
  // --- END: THE FIX ---

  // Get Notification Info
  const lowStockItemCount = useSelector(selectLowStockItemCount);
  const isAlertsViewed = useSelector(selectIsBranchAlertsViewed);
  const showNotificationBadge = lowStockItemCount > 0 && !isAlertsViewed;

  const handleLogout = () => {
    dispatch(logout())
      .unwrap()
      .then(() => {
        navigate("/");
      })
      .catch((err) => {
        console.error("Failed to logout: ", err);
        toast.error("Logout Failed", { description: err.message });
      });
  };
  
  const handleViewAlerts = () => {
    dispatch(markBranchAlertsAsViewed());
    navigate("/branch/inventory"); 
  };

  return (
    <header className="bg-background border-b px-6 py-4 flex items-center justify-between">
      <div>
        <h1 className="text-xl font-semibold text-foreground">
          {branch ? branch.name : "Branch Dashboard"}
        </h1>
        <p className="text-sm text-muted-foreground">
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>

      <div className="flex items-center gap-4">
        <ThemeToggle />
        
        {/* Notification Bell */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {showNotificationBadge && (
                <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-red-500 border-2 border-background animate-pulse" />
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-72">
             <div className="flex justify-between items-center mb-2">
              <h4 className="font-medium text-popover-foreground">Notifications</h4>
              {showNotificationBadge && (
                <span className="text-xs bg-primary text-primary-foreground font-medium rounded-full px-2 py-0.5">
                  {lowStockItemCount} New
                </span>
              )}
            </div>
            <div className="space-y-2">
              {!showNotificationBadge ? (
                <p className="text-sm text-muted-foreground text-center py-4">No new notifications</p>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-start gap-3 p-2 rounded-lg hover:bg-accent">
                    <Archive className="w-5 h-5 text-yellow-500 mt-1" />
                    <div>
                      <p className="text-sm font-medium">Low Stock Alert</p>
                      <p className="text-sm text-muted-foreground">
                        You have {lowStockItemCount} item(s) running low in your inventory.
                      </p>
                    </div>
                  </div>
                  <Button 
                    size="sm" 
                    className="w-full mt-2" 
                    onClick={handleViewAlerts}
                  >
                    View Inventory
                  </Button>
                </div>
              )}
            </div>
          </PopoverContent>
        </Popover>

        {/* --- User Profile Dropdown (Now works on refresh) --- */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 cursor-pointer p-0 h-auto focus-visible:ring-0">
              <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-5 w-5 text-primary" />
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-foreground">{currentUser?.fullName || "Branch Manager"}</p>
                <p className="text-xs text-muted-foreground">{currentUser?.email || "..."}</p>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="px-2 py-1.5 text-sm">
              <p className="font-medium">{currentUser?.fullName || "User"}</p>
              <p className="text-xs text-muted-foreground">
                {currentUser?.email || "No email"}
              </p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
      </div>
    </header>
  );
}