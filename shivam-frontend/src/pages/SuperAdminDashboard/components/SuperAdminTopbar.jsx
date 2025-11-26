import React from "react";
import { useSelector } from "react-redux";
import { User } from "lucide-react"; // Removed Bell, Search
import { Button } from "../../../components/ui/button";
// Removed: Input

export default function SuperAdminTopbar() {
  const { userProfile } = useSelector((state) => state.user);

  return (
    <header className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-foreground">Super Admin Panel</h1>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Search Removed */}
          
          {/* Notifications Removed */}
          
          {/* User Profile */}
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-foreground">
                {userProfile?.fullName || "Super Admin"}
              </p>
              <p className="text-xs text-muted-foreground">
                {userProfile?.email || "superadmin@pos.com"}
              </p>
            </div>
            <Button variant="ghost" size="icon" className="rounded-full">
              <User className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}