
import React from "react";
import { GroupBuy, Business, Product } from "../types";
import { Users, Clock } from "lucide-react";
import { Link } from "react-router-dom";

// Mock data - same as in GroupBuying.tsx
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
  },
  {
    id: "3",
    businessId: "3",
    productId: "p3",
    targetParticipants: 8,
    currentParticipants: 5,
    discountPercentage: 15,
    expiresAt: "2023-07-20T12:00:00Z",
    status: "active",
    business: {
      id: "3",
      name: "Campus Books",
      description: "New and used textbooks",
      category: "Retail",
      imageUrl: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
      rating: 4.5,
      reviewCount: 93,
      tags: ["Books", "Study"],
      deliveryTime: "1-2 days",
      isGroupBuyingEnabled: true,
      groupBuyingDiscount: 15
    },
    product: {
      id: "p3",
      businessId: "3",
      name: "Semester Textbook Bundle",
      description: "All required textbooks for Computer Science",
      price: 300,
      imageUrl: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
      isAvailable: true,
      category: "Bundles"
    }
  }
];

// Helper function from GroupBuying.tsx
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

const Groups: React.FC = () => {
  return (
    <div className="container px-4 py-6 max-w-screen-xl mx-auto mb-20">
      <h1 className="text-2xl font-bold mb-6">Active Group Buys</h1>
      
      <div className="grid grid-cols-1 gap-6">
        {ACTIVE_GROUP_BUYS.map((groupBuy) => (
          <Link 
            key={groupBuy.id}
            to={`/groups/${groupBuy.id}`}
            className="block"
          >
            <div className="bg-white rounded-2xl overflow-hidden border border-gantry-gray/20 shadow-sm hover:shadow-md transition-all-300 hover:-translate-y-1">
              <div className="flex flex-col sm:flex-row">
                <div className="w-full sm:w-1/4 h-48 sm:h-auto">
                  <img 
                    src={groupBuy.product.imageUrl} 
                    alt={groupBuy.product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="flex-1 p-6">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold text-lg">{groupBuy.product.name}</h3>
                      <p className="text-gantry-gray-dark">{groupBuy.business.name}</p>
                      <p className="mt-2">{groupBuy.product.description}</p>
                    </div>
                    
                    <div className="bg-gantry-purple/10 text-gantry-purple px-3 py-1.5 rounded-full text-sm font-medium">
                      {groupBuy.discountPercentage}% Off
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between my-4">
                    <div className="flex items-center text-gantry-gray-dark">
                      <Users className="w-4 h-4 mr-1" />
                      <span>{groupBuy.currentParticipants}/{groupBuy.targetParticipants} participants</span>
                    </div>
                    
                    <div className="flex items-center text-gantry-gray-dark">
                      <Clock className="w-4 h-4 mr-1" />
                      <span>{getRemainingTimeLabel(groupBuy.expiresAt)}</span>
                    </div>
                  </div>
                  
                  <div className="mt-2">
                    <div className="w-full bg-gantry-gray rounded-full h-2">
                      <div 
                        className="bg-gantry-purple h-2 rounded-full transition-all duration-1000 ease-in-out" 
                        style={{ width: `${(groupBuy.currentParticipants / groupBuy.targetParticipants) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex justify-between items-center">
                    <div>
                      <span className="text-sm text-gantry-gray-dark">Original price: </span>
                      <span className="text-sm line-through">${groupBuy.product.price}</span>
                      <span className="ml-2 text-lg font-bold text-gantry-purple">
                        ${(groupBuy.product.price * (1 - groupBuy.discountPercentage / 100)).toFixed(2)}
                      </span>
                    </div>
                    
                    <div className="text-gantry-purple-light text-sm font-medium">
                      {groupBuy.targetParticipants - groupBuy.currentParticipants} more needed for discount
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Groups;
