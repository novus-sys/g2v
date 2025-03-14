
import React from "react";
import { GroupBuy, Business, Product } from "../types";
import { Users, Clock, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

// Mock data
const ACTIVE_GROUP_BUYS: (GroupBuy & { business: Business, product: Product })[] = [
  {
    id: "1",
    businessId: "1",
    productId: "p1",
    targetParticipants: 10,
    currentParticipants: 7,
    discountPercentage: 15,
    expiresAt: "2023-07-15T12:00:00Z",
    status: "active",
    business: {
      id: "1",
      name: "Campus Coffee",
      description: "Artisanal coffee and pastries",
      category: "Food & Drinks",
      imageUrl: "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
      rating: 4.8,
      reviewCount: 124,
      tags: ["Coffee", "Breakfast"],
      deliveryTime: "15-20 min",
      isGroupBuyingEnabled: true,
      groupBuyingDiscount: 15
    },
    product: {
      id: "p1",
      businessId: "1",
      name: "Coffee Package Deal",
      description: "A month of premium coffee beans",
      price: 50,
      imageUrl: "https://images.unsplash.com/photo-1611854779393-1b2da9d400fe?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
      isAvailable: true,
      category: "Packages"
    }
  },
  {
    id: "2",
    businessId: "2",
    productId: "p2",
    targetParticipants: 5,
    currentParticipants: 3,
    discountPercentage: 20,
    expiresAt: "2023-07-18T12:00:00Z",
    status: "active",
    business: {
      id: "2",
      name: "Tech Tutors",
      description: "One-on-one tutoring",
      category: "Services",
      imageUrl: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
      rating: 4.9,
      reviewCount: 87,
      tags: ["Tutoring", "Tech"],
      deliveryTime: "Schedule",
      isGroupBuyingEnabled: true,
      groupBuyingDiscount: 20
    },
    product: {
      id: "p2",
      businessId: "2",
      name: "Group Coding Session",
      description: "3-hour coding workshop for beginners",
      price: 75,
      imageUrl: "https://images.unsplash.com/photo-1623479322729-28b25c16b011?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
      isAvailable: true,
      category: "Workshops"
    }
  }
];

export const GroupBuying: React.FC = () => {
  return (
    <section className="mb-8 animate-slide-up" style={{ animationDelay: "0.1s" }}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Active Group Buys</h2>
        <Link 
          to="/groups"
          className="text-sm text-gantry-purple flex items-center group focus-ring rounded-md px-2 py-1"
        >
          View all 
          <ChevronRight className="w-4 h-4 ml-1 transition-transform-300 group-hover:translate-x-1" />
        </Link>
      </div>
      
      <div className="space-y-4">
        {ACTIVE_GROUP_BUYS.map((groupBuy) => (
          <Link 
            key={groupBuy.id}
            to={`/groups/${groupBuy.id}`}
            className="block"
          >
            <div className="bg-white rounded-2xl overflow-hidden border border-gantry-gray/20 shadow-sm hover:shadow-md transition-all-300 hover:-translate-y-1">
              <div className="flex">
                <div className="w-24 h-24 sm:w-32 sm:h-32">
                  <img 
                    src={groupBuy.product.imageUrl} 
                    alt={groupBuy.product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="flex-1 p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-base">{groupBuy.product.name}</h3>
                      <p className="text-sm text-gray-500">{groupBuy.business.name}</p>
                    </div>
                    
                    <div className="bg-gantry-purple/10 text-gantry-purple px-2 py-1 rounded-full text-xs font-medium">
                      {groupBuy.discountPercentage}% Off
                    </div>
                  </div>
                  
                  <div className="mt-2">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-gray-600 flex items-center">
                        <Users className="w-3.5 h-3.5 mr-1" />
                        {groupBuy.currentParticipants}/{groupBuy.targetParticipants} joined
                      </span>
                      
                      <span className="text-gray-600 flex items-center">
                        <Clock className="w-3.5 h-3.5 mr-1" />
                        {getRemainingTimeLabel(groupBuy.expiresAt)}
                      </span>
                    </div>
                    
                    <div className="w-full bg-gantry-gray rounded-full h-1.5">
                      <div 
                        className="bg-gantry-purple h-1.5 rounded-full transition-all duration-1000 ease-in-out" 
                        style={{ width: `${(groupBuy.currentParticipants / groupBuy.targetParticipants) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

// Helper function to calculate and format remaining time
function getRemainingTimeLabel(expiresAt: string): string {
  const now = new Date();
  const expiry = new Date(expiresAt);
  const diffMs = expiry.getTime() - now.getTime();
  
  if (diffMs <= 0) return "Expired";
  
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  
  if (diffDays > 0) {
    return `${diffDays}d ${diffHours}h left`;
  }
  
  const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  if (diffHours > 0) {
    return `${diffHours}h ${diffMinutes}m left`;
  }
  
  return `${diffMinutes}m left`;
}
