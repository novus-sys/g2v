import React from "react";
import { Link } from "react-router-dom";
import { Bell, MessageSquare, ShoppingBag, Store } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useAppContext } from "@/context/AppContext";

export const Header: React.FC = () => {
  const { userMode, toggleUserMode } = useAppContext();
  const isSeller = userMode === "seller";

  return (
    <header className="fixed top-0 left-0 right-0 bg-white glass border-b border-gantry-gray/30 px-6 py-2 z-50">
      <div className="max-w-screen-xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center">
          <span className="text-xl font-bold text-gantry-purple">Gantries</span>
        </Link>
        
        <div className="flex items-center gap-3">
          {/* Mode Toggle */}
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/50 backdrop-blur-sm border border-gantry-gray/30">
            <ShoppingBag className={`w-4 h-4 ${!isSeller ? "text-gantry-purple" : "text-gray-500"}`} />
            <Switch 
              checked={isSeller}
              onCheckedChange={toggleUserMode}
              className="data-[state=checked]:bg-gantry-purple"
            />
            <Store className={`w-4 h-4 ${isSeller ? "text-gantry-purple" : "text-gray-500"}`} />
            <span className="text-xs font-medium hidden sm:inline-block ml-1">
              {isSeller ? "Seller Mode" : "Buyer Mode"}
            </span>
          </div>

          {/* Notifications and Messages */}
          <div className="flex items-center space-x-4">
            <button className="relative p-2 hover:bg-gantry-gray-light rounded-full transition-all duration-200">
              <Bell className="w-5 h-5 text-gray-600" />
              <span className="absolute top-0 right-0 w-4 h-4 bg-gantry-purple text-white text-xs rounded-full flex items-center justify-center">
                2
              </span>
            </button>
            
            <Link 
              to="/messages"
              className="relative p-2 hover:bg-gantry-gray-light rounded-full transition-all duration-200"
            >
              <MessageSquare className="w-5 h-5 text-gray-600" />
              <span className="absolute top-0 right-0 w-4 h-4 bg-gantry-purple text-white text-xs rounded-full flex items-center justify-center">
                3
              </span>
            </Link>

            {/* Cart */}
            <Link 
              to="/cart" 
              className="hidden sm:flex items-center space-x-1 p-2 hover:bg-gantry-gray-light rounded-full transition-all duration-200"
            >
              <ShoppingBag className="w-5 h-5 text-gray-600" />
              <span className="text-sm text-gray-600">Cart</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}; 