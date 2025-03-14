
import React from "react";
import { Link } from "react-router-dom";
import { Business } from "../types";
import { ChevronRight, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

// Mock data - updated to match the names in the image
const FEATURED_BUSINESSES: Business[] = [
  {
    id: "1",
    name: "Campus Coffee",
    description: "Artisanal coffee and pastries made by students in the culinary program.",
    category: "Food & Drinks",
    imageUrl: "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    rating: 4.8,
    reviewCount: 124,
    tags: ["Coffee", "Breakfast"],
    deliveryTime: "15-20 min",
    isGroupBuyingEnabled: true,
    groupBuyingDiscount: 15
  },
  {
    id: "2",
    name: "Tech Tutors",
    description: "One-on-one tutoring for computer science and engineering courses.",
    category: "Services",
    imageUrl: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    rating: 4.9,
    reviewCount: 87,
    tags: ["Tutoring", "Tech"],
    deliveryTime: "Schedule",
    isGroupBuyingEnabled: true,
    groupBuyingDiscount: 20
  },
  {
    id: "3",
    name: "Dorm Delights",
    description: "Homemade snacks and treats delivered right to your dorm room.",
    category: "Food & Drinks",
    imageUrl: "https://images.unsplash.com/photo-1621939514649-280e2ee25f60?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    rating: 4.6,
    reviewCount: 92,
    tags: ["Snacks", "Desserts"],
    deliveryTime: "30-45 min",
    isGroupBuyingEnabled: false
  }
];

interface FeaturedBusinessesProps {
  title?: string;
  businesses?: Business[];
  viewAllLink?: string;
}

export const FeaturedBusinesses: React.FC<FeaturedBusinessesProps> = ({ 
  title = "Featured Campus Businesses", 
  businesses = FEATURED_BUSINESSES,
  viewAllLink = "/explore"
}) => {
  return (
    <section className="mb-8 animate-slide-up">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">{title}</h2>
        {viewAllLink && (
          <Link 
            to={viewAllLink}
            className="text-gantry-purple flex items-center group focus-ring rounded-md px-2 py-1"
          >
            View all 
            <ChevronRight className="w-4 h-4 ml-1 transition-transform-300 group-hover:translate-x-1" />
          </Link>
        )}
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {businesses.map((business) => (
          <BusinessCard key={business.id} business={business} />
        ))}
      </div>
    </section>
  );
};

// Custom BusinessCard component to match the design in the image
const BusinessCard: React.FC<{ business: Business }> = ({ business }) => {
  return (
    <Link to={`/business/${business.id}`} className="block">
      <div className="rounded-xl overflow-hidden bg-white border border-gray-200 transition-all hover:shadow-md">
        <div className="relative">
          <img 
            src={business.imageUrl} 
            alt={business.name} 
            className="w-full h-48 object-cover"
          />
          {business.isGroupBuyingEnabled && (
            <div className="absolute top-3 right-3 bg-gantry-purple text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
              <span className="text-xs">👥</span> Group Buy
            </div>
          )}
        </div>
        
        <div className="p-4">
          <div className="flex justify-between items-start mb-1">
            <h3 className="font-semibold text-lg">{business.name}</h3>
            <div className="flex items-center">
              <span className="text-yellow-500 mr-1">⭐</span>
              <span className="font-medium">{business.rating}</span>
              <span className="text-gray-500 text-sm ml-1">({business.reviewCount})</span>
            </div>
          </div>
          
          <p className="text-gray-600 text-sm mb-4">{business.description}</p>
          
          <div className="flex items-center text-gray-500 text-sm mb-3">
            <Clock className="h-4 w-4 mr-1" />
            <span>{business.deliveryTime}</span>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {business.tags?.map((tag, index) => (
              <span 
                key={index}
                className={cn(
                  "text-xs px-2 py-1 rounded-full",
                  tag === "Coffee" && "bg-amber-100 text-amber-800",
                  tag === "Breakfast" && "bg-blue-100 text-blue-800",
                  tag === "Tutoring" && "bg-green-100 text-green-800",
                  tag === "Tech" && "bg-purple-100 text-purple-800",
                  tag === "Snacks" && "bg-pink-100 text-pink-800",
                  tag === "Desserts" && "bg-red-100 text-red-800"
                )}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
};
