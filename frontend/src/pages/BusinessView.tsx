
import React from "react";
import { useParams } from "react-router-dom";
import { BusinessDetail } from "../components/BusinessDetail";
import { Business, Product } from "../types";

// Mock data
const BUSINESSES: { [key: string]: Business } = {
  "1": {
    id: "1",
    name: "Campus Coffee",
    description: "Artisanal coffee and pastries made by students in the culinary program, featuring beans sourced from ethical farms and pastries baked fresh daily.",
    category: "Food & Drinks",
    imageUrl: "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    rating: 4.8,
    reviewCount: 124,
    tags: ["Coffee", "Breakfast", "Snacks", "Local"],
    deliveryTime: "15-20 min",
    minOrderAmount: 5,
    isGroupBuyingEnabled: true,
    groupBuyingDiscount: 15
  },
  "2": {
    id: "2",
    name: "Tech Tutors",
    description: "One-on-one tutoring for computer science and engineering courses, taught by peer students who have excelled in these classes. Personalized sessions to help you master difficult concepts.",
    category: "Services",
    imageUrl: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    rating: 4.9,
    reviewCount: 87,
    tags: ["Tutoring", "Tech", "CS", "Engineering"],
    deliveryTime: "Schedule",
    isGroupBuyingEnabled: true,
    groupBuyingDiscount: 20
  }
};

// Mock products for each business
const BUSINESS_PRODUCTS: { [key: string]: Product[] } = {
  "1": [
    {
      id: "p1",
      businessId: "1",
      name: "Artisanal Latte",
      description: "Smooth espresso with steamed milk and a touch of vanilla.",
      price: 4.50,
      imageUrl: "https://images.unsplash.com/photo-1541167760496-1628856ab772?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
      isAvailable: true,
      category: "Drinks"
    },
    {
      id: "p2",
      businessId: "1",
      name: "Blueberry Muffin",
      description: "Freshly baked muffin loaded with sweet blueberries.",
      price: 3.25,
      imageUrl: "https://images.unsplash.com/photo-1586188138003-918d302be5ec?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
      isAvailable: true,
      category: "Pastries"
    },
    {
      id: "p3",
      businessId: "1",
      name: "Coffee Beans (1lb)",
      description: "Ethically sourced coffee beans, perfect for brewing at home.",
      price: 12.99,
      imageUrl: "https://images.unsplash.com/photo-1611854779393-1b2da9d400fe?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
      isAvailable: true,
      category: "Goods"
    },
    {
      id: "p4",
      businessId: "1",
      name: "Breakfast Sandwich",
      description: "Egg, cheese, and avocado on a freshly baked croissant.",
      price: 6.75,
      imageUrl: "https://images.unsplash.com/photo-1525351484163-7529414344d8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
      isAvailable: true,
      category: "Food"
    }
  ],
  "2": [
    {
      id: "p5",
      businessId: "2",
      name: "1-Hour Python Tutoring",
      description: "One-on-one session focused on Python programming concepts.",
      price: 25.00,
      imageUrl: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
      isAvailable: true,
      category: "Tutoring"
    },
    {
      id: "p6",
      businessId: "2",
      name: "Data Structures Package",
      description: "Four 1-hour sessions covering essential data structures.",
      price: 90.00,
      imageUrl: "https://images.unsplash.com/photo-1516321165247-4aa89a48be28?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
      isAvailable: true,
      category: "Packages"
    },
    {
      id: "p7",
      businessId: "2",
      name: "Group Coding Workshop",
      description: "3-hour workshop for up to 5 students on web development.",
      price: 75.00,
      imageUrl: "https://images.unsplash.com/photo-1623479322729-28b25c16b011?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
      isAvailable: true,
      category: "Workshops"
    }
  ]
};

const BusinessView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  
  // In a real app, you would fetch this data from an API
  const business = id && BUSINESSES[id];
  const products = id && BUSINESS_PRODUCTS[id] || [];
  
  if (!business) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
        <h2 className="text-2xl font-bold mb-2">Business Not Found</h2>
        <p className="text-gray-600 mb-6">The business you're looking for doesn't exist or has been removed.</p>
        <button
          onClick={() => window.history.back()}
          className="px-4 py-2 bg-gantry-purple text-white rounded-lg hover:bg-gantry-purple-dark transition-all-300"
        >
          Go Back
        </button>
      </div>
    );
  }
  
  return (
    <div className="pb-24">
      <BusinessDetail business={business} products={products} />
    </div>
  );
};

export default BusinessView;
