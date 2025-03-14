
import React from "react";
import { User, Gift, Star, ShoppingBag, CreditCard, Settings, LogOut, ChevronRight, MessageSquare, Store, BarChart, Award } from "lucide-react";
import { UserProfile } from "../types";
import { useAppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";

// Mock user data
const USER_PROFILE: UserProfile = {
  id: "user1",
  name: "Vivek Kumar",
  avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
  level: 3,
  points: 750,
  badges: ["Early Adopter", "Social Butterfly", "Group Buy Expert"],
  rank: "Campus Explorer"
};

// Mock seller data
const SELLER_METRICS = {
  totalSales: 267,
  totalRevenue: "$12,450",
  averageRating: 4.8,
  completionRate: "98%",
  badges: ["Top Seller", "Fast Shipper", "Quality Service"]
};

interface AccountMenuItemProps {
  icon: React.ReactNode;
  label: string;
  to: string;
  badge?: string;
  className?: string;
}

const AccountMenuItem: React.FC<AccountMenuItemProps> = ({ icon, label, to, badge, className }) => {
  const navigate = useNavigate();
  
  return (
    <button 
      className={`w-full flex items-center justify-between p-4 hover:bg-gantry-gray-light transition-all-300 ${className || ""}`}
      onClick={() => navigate(to)}
    >
      <div className="flex items-center">
        <div className="mr-3">{icon}</div>
        <span>{label}</span>
      </div>
      
      <div className="flex items-center">
        {badge && (
          <span className="bg-gantry-purple text-white text-xs rounded-full w-5 h-5 flex items-center justify-center mr-2">
            {badge}
          </span>
        )}
        <ChevronRight className="w-5 h-5 text-gray-400" />
      </div>
    </button>
  );
};

const Account: React.FC = () => {
  const { userMode } = useAppContext();
  const isSeller = userMode === "seller";
  const navigate = useNavigate();

  return (
    <div className="max-w-screen-xl mx-auto pb-24 section-padding">
      <div className="animate-fade-in">
        <div className="flex items-center mb-6">
          <div className="w-20 h-20 rounded-full overflow-hidden mr-4 border-2 border-gantry-purple">
            <img
              src={USER_PROFILE.avatarUrl}
              alt={USER_PROFILE.name}
              className="w-full h-full object-cover"
            />
          </div>
          
          <div>
            <h1 className="text-2xl font-bold">{USER_PROFILE.name}</h1>
            <div className="flex items-center mt-1">
              {isSeller ? (
                <span className="text-sm bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                  Seller Account
                </span>
              ) : (
                <span className="text-sm text-gray-600">{USER_PROFILE.rank}</span>
              )}
            </div>
          </div>
        </div>
        
        {isSeller ? (
          // Seller mode metrics
          <div className="bg-white rounded-2xl shadow-sm p-4 mb-6 border border-gantry-gray/20">
            <h2 className="font-semibold mb-3">Business Metrics</h2>
            
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center mr-3">
                  <ShoppingBag className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Sales</p>
                  <p className="font-semibold">{SELLER_METRICS.totalSales}</p>
                </div>
              </div>
              
              <button className="text-gantry-purple hover:text-gantry-purple-dark transition-all-300">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center mr-3">
                  <BarChart className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Revenue</p>
                  <p className="font-semibold">{SELLER_METRICS.totalRevenue}</p>
                </div>
              </div>
              
              <button className="text-gantry-purple hover:text-gantry-purple-dark transition-all-300">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        ) : (
          // Enhanced Points and Rewards section - updated based on user feedback
          <div 
            className="bg-white rounded-2xl shadow-sm p-6 mb-6 border border-gantry-gray/20 cursor-pointer hover:border-gantry-purple/30 transition-all duration-300"
            onClick={() => navigate("/points-rewards")}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-lg flex items-center gap-2">
                <Star className="w-5 h-5 text-gantry-purple" />
                Points & Rewards
              </h2>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-gantry-purple/5 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Available Points</span>
                  <Gift className="w-4 h-4 text-gantry-purple" />
                </div>
                <p className="text-2xl font-bold text-gantry-purple">{USER_PROFILE.points}</p>
                <p className="text-xs text-gray-500 mt-1">Worth ≈ ${(USER_PROFILE.points * 0.05).toFixed(2)}</p>
              </div>
              
              <div className="bg-gantry-purple/5 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Active Rewards</span>
                  <Award className="w-4 h-4 text-gantry-purple" />
                </div>
                <p className="text-2xl font-bold text-gantry-purple">3</p>
                <p className="text-xs text-gray-500 mt-1">Available to redeem</p>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-1 text-sm">
                <span className="text-gray-600">Progress to Next Level</span>
                <span className="text-gantry-purple font-medium">75%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div className="bg-gantry-purple h-2 rounded-full" style={{ width: '75%' }}></div>
              </div>
            </div>
          </div>
        )}
        
        <div className="bg-white rounded-2xl shadow-sm p-4 mb-6 border border-gantry-gray/20">
          <h2 className="font-semibold mb-3">Badges</h2>
          
          <div className="flex flex-wrap gap-2">
            {isSeller
              ? SELLER_METRICS.badges.map((badge, index) => (
                  <div 
                    key={index}
                    className="bg-amber-50 text-amber-800 px-3 py-1.5 rounded-lg text-sm"
                  >
                    {badge}
                  </div>
                ))
              : USER_PROFILE.badges.map((badge, index) => (
                  <div 
                    key={index}
                    className="bg-gantry-gray-light text-gantry-purple-dark px-3 py-1.5 rounded-lg text-sm"
                  >
                    {badge}
                  </div>
                ))
            }
          </div>
        </div>
        
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-6 border border-gantry-gray/20">
          <div className="p-4 border-b border-gantry-gray/20">
            <h2 className="font-semibold">Account</h2>
          </div>
          
          <div>
            {isSeller ? (
              // Seller menu items
              <>
                <AccountMenuItem 
                  icon={<Store className="w-5 h-5" />} 
                  label="My Business" 
                  to="/business-profile" 
                />
                <AccountMenuItem 
                  icon={<ShoppingBag className="w-5 h-5" />} 
                  label="Orders" 
                  to="/orders" 
                />
                <AccountMenuItem 
                  icon={<Award className="w-5 h-5" />} 
                  label="Performance" 
                  to="/performance" 
                />
              </>
            ) : (
              // Buyer menu items
              <>
                <AccountMenuItem 
                  icon={<ShoppingBag className="w-5 h-5" />} 
                  label="My Orders" 
                  to="/orders" 
                />
                <AccountMenuItem 
                  icon={<MessageSquare className="w-5 h-5" />} 
                  label="Messages" 
                  to="/messages" 
                  badge="2"
                />
              </>
            )}
            
            <AccountMenuItem 
              icon={<CreditCard className="w-5 h-5" />} 
              label="Payment Methods" 
              to="/payment-methods" 
            />
            
            <AccountMenuItem 
              icon={<User className="w-5 h-5" />} 
              label="Profile Information" 
              to="/profile" 
            />
            
            <AccountMenuItem 
              icon={<Settings className="w-5 h-5" />} 
              label="Settings" 
              to="/settings" 
            />
            
            <AccountMenuItem 
              icon={<LogOut className="w-5 h-5" />} 
              label="Log Out" 
              to="/logout" 
              className="text-red-500"
            />
          </div>
        </div>
        
        <p className="text-center text-gray-500 text-sm">
          App Version 1.0.0
        </p>
      </div>
    </div>
  );
};

export default Account;
