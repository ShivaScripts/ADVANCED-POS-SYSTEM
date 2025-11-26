// pos-frontend-vite/src/pages/store/Dashboard/StoreTopbar.jsx

import React, { useEffect } from "react";
import {
  Bell,
  UserCircle,
  LogOut,
  Archive,
  UserX,
  TrendingDown,
  RefreshCw,
} from "lucide-react";
import { ThemeToggle } from "../../../components/theme-toggle";
import TrendingTicker from "./TrendingTicker"; // <--- ADDED
// removed unused Input import
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
// --- START: Notification Components ---
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  selectTotalAlertsCount,
  selectIsAlertsViewed,
  markAlertsAsViewed,
  selectStoreAlertsData,
} from "@/Redux Toolkit/features/storeAnalytics/storeAnalyticsSlice";
import { getStoreAlerts } from "@/Redux Toolkit/features/storeAnalytics/storeAnalyticsThunks";
// --- END: ---
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "@/Redux Toolkit/features/user/userThunks";

export default function StoreTopbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // --- Notification & user state ---
  const currentUser = useSelector((state) => state.user.userProfile);
  const { store } = useSelector((state) => state.store);
  
  const totalAlerts = useSelector(selectTotalAlertsCount);
  const isAlertsViewed = useSelector(selectIsAlertsViewed);
  const alertsData = useSelector(selectStoreAlertsData);
  
  const showBadge = totalAlerts > 0 && !isAlertsViewed;

  useEffect(() => {
    if (currentUser?.id) {
      dispatch(getStoreAlerts(currentUser.id));
    }
  }, [dispatch, currentUser, store]);

  const handleLogout = () => {
    dispatch(logout())
      .unwrap()
      .then(() => {
        navigate("/");
      })
      .catch((err) => {
        console.error("Failed to logout: ", err);
      });
  };

  const handleViewAlerts = () => {
    dispatch(markAlertsAsViewed());
    navigate("/store/alerts");
  };

  return (
    <header className="w-full h-16 bg-background border-b flex items-center px-6 justify-between shadow-sm">
      {/* Branding (left) and Trending Ticker (center) */}
      <div className="flex items-center gap-4 w-full">
        <div
          className="flex items-center gap-2 font-bold text-xl text-primary md:text-2xl cursor-pointer"
          onClick={() => navigate("/store/dashboard")}
        >
          <span className="bg-primary text-primary-foreground px-2 py-1 rounded-lg shadow-sm">Z</span>
          <span className="hidden md:inline">POS Admin</span>
        </div>

        {/* --- REPLACED SEARCH BAR WITH TICKER HERE --- */}
        <div className="flex-1 flex justify-center px-4">
          <TrendingTicker />
        </div>
        {/* --------------------------------------------- */}
      </div>

      {/* Right side: Icons */}
      <div className="flex items-center gap-6">
        <ThemeToggle />

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="text-muted-foreground w-6 h-6" />
              {showBadge && (
                <span className="absolute -top-0 -right-0 h-2.5 w-2.5 rounded-full bg-red-500 border-2 border-background animate-pulse" />
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-80">
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-medium text-popover-foreground">Notifications</h4>
              {showBadge && (
                <span className="text-xs bg-primary text-primary-foreground font-medium rounded-full px-2 py-0.5">
                  {totalAlerts} New
                </span>
              )}
            </div>
            <div className="space-y-2">
              {!showBadge ? (
                <p className="text-sm text-muted-foreground text-center py-4">No new notifications</p>
              ) : (
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">You have new alerts in your store.</p>
                  <ul className="space-y-1.5 text-sm">
                    {alertsData?.lowStockAlerts?.length > 0 && (
                      <li className="flex items-center gap-2">
                        <Archive className="w-4 h-4 text-yellow-500" />
                        <span>{alertsData.lowStockAlerts.length} Low Stock Item(s)</span>
                      </li>
                    )}
                    {alertsData?.inactiveCashiers?.length > 0 && (
                      <li className="flex items-center gap-2">
                        <UserX className="w-4 h-4 text-orange-500" />
                        <span>{alertsData.inactiveCashiers.length} Inactive Cashier(s)</span>
                      </li>
                    )}
                    {alertsData?.noSalesToday?.length > 0 && (
                      <li className="flex items-center gap-2">
                        <TrendingDown className="w-4 h-4 text-red-500" />
                        <span>{alertsData.noSalesToday.length} Branch(es) with no sales</span>
                      </li>
                    )}
                    {alertsData?.refundSpikeAlerts?.length > 0 && (
                      <li className="flex items-center gap-2">
                        <RefreshCw className="w-4 h-4 text-blue-500" />
                        <span>{alertsData.refundSpikeAlerts.length} Refund Spike(s)</span>
                      </li>
                    )}
                  </ul>
                  <Button size="sm" className="w-full mt-2" onClick={handleViewAlerts}>
                    View All Alerts
                  </Button>
                </div>
              )}
            </div>
          </PopoverContent>
        </Popover>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 cursor-pointer p-0 h-auto focus-visible:ring-0">
              <span className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center font-bold text-primary">
                <UserCircle className="w-6 h-6" />
              </span>
              <span className="font-medium text-foreground hidden md:block">
                {currentUser?.fullName || "Store Admin"}
              </span>
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
