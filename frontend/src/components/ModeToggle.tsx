import React from "react";
import { Switch } from "@/components/ui/switch";
import { useAppContext } from "@/context/AppContext";
import { ShoppingBag, Store } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";

export const ModeToggle: React.FC = () => {
  const { userMode, toggleUserMode } = useAppContext();
  const { user } = useAuth();
  const isSeller = userMode === "seller";

  // If user is a vendor, they should only see seller mode
  if (user?.role === 'vendor') {
    return (
      <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/50 backdrop-blur-sm border border-gantry-gray/30">
        <Store className="w-4 h-4 text-gantry-purple" />
        <span className="text-xs font-medium hidden sm:inline-block ml-1">
          Seller Mode
        </span>
      </div>
    );
  }

  // For students or unauthenticated users, show the toggle
  return (
    <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/50 backdrop-blur-sm border border-gantry-gray/30">
      <ShoppingBag className={cn("w-4 h-4", !isSeller ? "text-gantry-purple" : "text-gray-500")} />
      
      <Switch 
        checked={isSeller}
        onCheckedChange={toggleUserMode}
        className="data-[state=checked]:bg-gantry-purple"
      />
      
      <Store className={cn("w-4 h-4", isSeller ? "text-gantry-purple" : "text-gray-500")} />
      
      <span className="text-xs font-medium hidden sm:inline-block ml-1">
        {isSeller ? "Seller Mode" : "Buyer Mode"}
      </span>
    </div>
  );
};
