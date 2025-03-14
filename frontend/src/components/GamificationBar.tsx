
import React from "react";
import { Bell, MessageSquare, ShoppingBag } from "lucide-react";
import { useAppContext } from "@/context/AppContext";
import { useNavigate } from "react-router-dom";

export const GamificationBar: React.FC = () => {
  const { userMode } = useAppContext();
  const navigate = useNavigate();
  const isSeller = userMode === "seller";
  
  // In a real app, these would come from your notification context/API
  const unreadNotifications = 2;
  const unreadMessages = 3;
  
  return (
    <div className="flex items-center space-x-4">
      <button className="relative p-2 hover:bg-gantry-gray-light rounded-full transition-all duration-200">
        <Bell className="w-5 h-5 text-gray-600" />
        {unreadNotifications > 0 && (
          <span className="absolute top-0 right-0 w-4 h-4 bg-gantry-purple text-white text-xs rounded-full flex items-center justify-center">
            {unreadNotifications}
          </span>
        )}
      </button>
      
      <button 
        className="relative p-2 hover:bg-gantry-gray-light rounded-full transition-all duration-200"
        onClick={() => navigate("/messages")}
      >
        <MessageSquare className="w-5 h-5 text-gray-600" />
        {unreadMessages > 0 && (
          <span className="absolute top-0 right-0 w-4 h-4 bg-gantry-purple text-white text-xs rounded-full flex items-center justify-center">
            {unreadMessages}
          </span>
        )}
      </button>
      
      {isSeller ? (
        <div className="hidden sm:block border-l border-gantry-gray/30 pl-4">
          <p className="text-xs text-gray-600">Today's Orders</p>
          <p className="font-medium text-sm">12</p>
        </div>
      ) : (
        <button 
          className="hidden sm:flex items-center space-x-1 p-2 hover:bg-gantry-gray-light rounded-full transition-all duration-200"
          onClick={() => navigate("/cart")}
        >
          <ShoppingBag className="w-5 h-5 text-gray-600" />
          <span className="text-sm text-gray-600">Cart</span>
        </button>
      )}
    </div>
  );
};
