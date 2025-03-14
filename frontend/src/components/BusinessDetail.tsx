
import React from "react";
import { Business, Product } from "../types";
import { Star, Clock, Info, ChevronRight, ShoppingBag, Users } from "lucide-react";
import { Link } from "react-router-dom";

interface BusinessDetailProps {
  business: Business;
  products: Product[];
}

export const BusinessDetail: React.FC<BusinessDetailProps> = ({ business, products }) => {
  return (
    <div className="animate-fade-in">
      <div className="relative">
        <div className="h-48 sm:h-64 md:h-80 overflow-hidden">
          <img 
            src={business.imageUrl} 
            alt={business.name}
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none"></div>
        
        <button
          onClick={() => window.history.back()}
          className="absolute top-4 left-4 bg-white/80 backdrop-blur-sm rounded-full p-2 shadow-sm hover:bg-white transition-all-300"
        >
          <ChevronRight className="w-5 h-5 transform rotate-180" />
        </button>
      </div>
      
      <div className="relative -mt-16 mx-4 p-6 bg-white rounded-2xl shadow-sm">
        <div className="flex justify-between items-start mb-4">
          <h1 className="text-2xl font-bold">{business.name}</h1>
          
          <div className="flex items-center bg-gantry-gray-light px-3 py-1 rounded-full">
            <Star className="w-4 h-4 text-amber-400 fill-amber-400 mr-1" />
            <span className="font-medium">{business.rating}</span>
            <span className="text-xs text-gray-500 ml-1">({business.reviewCount})</span>
          </div>
        </div>
        
        <p className="text-gray-600 mb-4">{business.description}</p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {business.tags.map((tag, index) => (
            <span 
              key={index}
              className="text-xs bg-gantry-gray-light text-gantry-purple-dark px-3 py-1 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
        
        <div className="flex items-center justify-between py-3 border-y border-gantry-gray/30">
          <div className="flex items-center text-gray-600">
            <Clock className="w-4 h-4 mr-2" />
            {business.deliveryTime}
          </div>
          
          {business.minOrderAmount && (
            <div className="flex items-center text-gray-600">
              <Info className="w-4 h-4 mr-2" />
              <span>Min. order: ${business.minOrderAmount}</span>
            </div>
          )}
        </div>
      </div>
      
      <div className="mt-6 px-4">
        <h2 className="text-xl font-semibold mb-4">Available Items</h2>
        
        <div className="space-y-4">
          {products.map((product) => (
            <div 
              key={product.id}
              className="bg-white rounded-xl border border-gantry-gray/20 overflow-hidden shadow-sm hover:shadow-md transition-all-300"
            >
              <div className="flex">
                <div className="w-24 h-24 sm:w-32 sm:h-32">
                  <img 
                    src={product.imageUrl} 
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="flex-1 p-4 flex flex-col justify-between">
                  <div>
                    <h3 className="font-medium">{product.name}</h3>
                    <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>
                  </div>
                  
                  <div className="flex justify-between items-center mt-3">
                    <span className="font-semibold">${product.price.toFixed(2)}</span>
                    
                    <div className="flex gap-2">
                      {business.isGroupBuyingEnabled && (
                        <button className="bg-gantry-purple/10 hover:bg-gantry-purple/20 text-gantry-purple rounded-full w-8 h-8 flex items-center justify-center transition-all-300">
                          <Users className="w-4 h-4" />
                        </button>
                      )}
                      
                      <button className="bg-gantry-purple text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-gantry-purple-dark transition-all-300">
                        <ShoppingBag className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
