
import React from "react";
import { Link } from "react-router-dom";
import { Star, Clock, Users } from "lucide-react";
import { Business } from "../types";

interface BusinessCardProps {
  business: Business;
}

export const BusinessCard: React.FC<BusinessCardProps> = ({ business }) => {
  return (
    <Link 
      to={`/business/${business.id}`}
      className="block rounded-2xl overflow-hidden bg-white border border-gantry-gray/20 shadow-sm hover:shadow-md transition-all-300 hover:-translate-y-1 animate-scale-in"
    >
      <div className="relative">
        <img 
          src={business.imageUrl} 
          alt={business.name}
          className="w-full h-48 object-cover"
        />
        {business.isGroupBuyingEnabled && (
          <div className="absolute top-3 right-3 bg-gantry-purple text-white text-xs px-3 py-1 rounded-full flex items-center">
            <Users className="w-3 h-3 mr-1" />
            Group Buy
          </div>
        )}
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-lg">{business.name}</h3>
          <div className="flex items-center">
            <Star className="w-4 h-4 text-amber-400 fill-amber-400 mr-1" />
            <span className="text-sm font-medium">{business.rating}</span>
            <span className="text-xs text-gray-500 ml-1">({business.reviewCount})</span>
          </div>
        </div>
        
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{business.description}</p>
        
        <div className="flex justify-between items-center">
          <div className="flex items-center text-sm text-gray-500">
            <Clock className="w-4 h-4 mr-1" />
            {business.deliveryTime}
          </div>
          
          <div className="flex flex-wrap gap-1">
            {business.tags.slice(0, 2).map((tag, index) => (
              <span 
                key={index}
                className="text-xs bg-gantry-gray-light text-gantry-purple-dark px-2 py-0.5 rounded-full"
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
