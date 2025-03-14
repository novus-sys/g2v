import React, { useState, useEffect } from "react";
import { Search, SlidersHorizontal, Tag, X } from "lucide-react";
import { Business } from "../types";
import { BusinessCard } from "../components/BusinessCard";
import { useSearchParams } from "react-router-dom";

// Mock data
const ALL_BUSINESSES: Business[] = [
  {
    id: "1",
    name: "Campus Coffee",
    description: "Artisanal coffee and pastries made by students in the culinary program.",
    category: "Food & Drinks",
    imageUrl: "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    rating: 4.8,
    reviewCount: 124,
    tags: ["Coffee", "Breakfast", "Snacks"],
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
    tags: ["Tutoring", "Tech", "CS"],
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
    tags: ["Snacks", "Desserts", "Delivery"],
    deliveryTime: "30-45 min",
    isGroupBuyingEnabled: false
  },
  {
    id: "4",
    name: "Student Notes",
    description: "High-quality class notes for the most challenging courses on campus.",
    category: "Academic",
    imageUrl: "https://images.unsplash.com/photo-1501504905252-473c47e087f8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    rating: 4.7,
    reviewCount: 63,
    tags: ["Notes", "Study Materials", "Academic"],
    deliveryTime: "Instant Download",
    isGroupBuyingEnabled: false
  },
  {
    id: "5",
    name: "Campus Movers",
    description: "Student-run moving service for dorm room transitions and storage solutions.",
    category: "Services",
    imageUrl: "https://images.unsplash.com/photo-1600585152220-90363fe7e115?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    rating: 4.5,
    reviewCount: 48,
    tags: ["Moving", "Storage", "Labor"],
    deliveryTime: "Scheduled",
    isGroupBuyingEnabled: true,
    groupBuyingDiscount: 10
  },
  {
    id: "6",
    name: "Art Club Prints",
    description: "Digital and physical art prints created by the university's art students.",
    category: "Art & Design",
    imageUrl: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    rating: 4.9,
    reviewCount: 37,
    tags: ["Art", "Prints", "Decor"],
    deliveryTime: "3-5 days",
    isGroupBuyingEnabled: false
  }
];

// Filter and tag options
const CATEGORIES = ["All", "Food & Drinks", "Services", "Academic", "Art & Design"];
const TAGS = ["Coffee", "Breakfast", "Tutoring", "Tech", "Snacks", "Desserts", "Notes", "Moving", "Art"];

const Explore: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showOnlyGroupBuying, setShowOnlyGroupBuying] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  // Initialize search query from URL parameters
  useEffect(() => {
    const searchFromUrl = searchParams.get("search");
    if (searchFromUrl) {
      setSearchQuery(searchFromUrl);
    }
  }, [searchParams]);

  // Update URL when search query changes
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setSearchQuery(newQuery);
    if (newQuery) {
      setSearchParams({ search: newQuery });
    } else {
      searchParams.delete("search");
      setSearchParams(searchParams);
    }
  };
  
  // Filter businesses based on current selections
  const filteredBusinesses = ALL_BUSINESSES.filter(business => {
    // Filter by search
    if (searchQuery && !business.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !business.description.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // Filter by category
    if (selectedCategory !== "All" && business.category !== selectedCategory) {
      return false;
    }
    
    // Filter by tags
    if (selectedTags.length > 0 && !selectedTags.some(tag => business.tags.includes(tag))) {
      return false;
    }
    
    // Filter by group buying
    if (showOnlyGroupBuying && !business.isGroupBuyingEnabled) {
      return false;
    }
    
    return true;
  });
  
  const handleTagToggle = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };
  
  const clearFilters = () => {
    setSelectedCategory("All");
    setSelectedTags([]);
    setShowOnlyGroupBuying(false);
  };
  
  return (
    <div className="max-w-screen-xl mx-auto pb-24 section-padding">
      <header className="mb-6 animate-fade-in">
        <h1 className="text-2xl font-bold">Explore Businesses</h1>
        <p className="text-gray-600">Discover student-run businesses on campus.</p>
      </header>
      
      <div className="flex items-center justify-between mb-6 animate-slide-up">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="w-5 h-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full pl-12 pr-4 py-3 bg-white border border-gantry-gray/30 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-gantry-purple focus:border-transparent transition-all-300"
          />
        </div>
        
        <button
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className="ml-3 bg-white border border-gantry-gray/30 rounded-xl p-3 shadow-sm hover:border-gantry-purple/30 transition-all-300 flex items-center"
        >
          <SlidersHorizontal className="w-5 h-5" />
        </button>
      </div>
      
      {/* Filter panel */}
      {isFilterOpen && (
        <div className="bg-white rounded-xl border border-gantry-gray/30 p-4 mb-6 shadow-sm animate-scale-in">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium">Filters</h3>
            
            <div className="flex items-center">
              <button
                onClick={clearFilters}
                className="text-sm text-gantry-purple hover:text-gantry-purple-dark mr-4 transition-all-300"
              >
                Clear all
              </button>
              
              <button
                onClick={() => setIsFilterOpen(false)}
                className="text-gray-500 hover:text-gray-700 transition-all-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          <div className="mb-4">
            <h4 className="text-sm font-medium mb-2">Categories</h4>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-3 py-1.5 rounded-full text-sm transition-all-300 ${
                    selectedCategory === category
                      ? "bg-gantry-purple text-white"
                      : "bg-gantry-gray-light text-gray-700 hover:bg-gantry-gray"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
          
          <div className="mb-4">
            <h4 className="text-sm font-medium mb-2">Tags</h4>
            <div className="flex flex-wrap gap-2">
              {TAGS.map((tag) => (
                <button
                  key={tag}
                  onClick={() => handleTagToggle(tag)}
                  className={`px-3 py-1.5 rounded-full text-sm transition-all-300 ${
                    selectedTags.includes(tag)
                      ? "bg-gantry-purple text-white"
                      : "bg-gantry-gray-light text-gray-700 hover:bg-gantry-gray"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={showOnlyGroupBuying}
                onChange={() => setShowOnlyGroupBuying(!showOnlyGroupBuying)}
                className="sr-only peer"
              />
              <div className="relative w-11 h-6 bg-gantry-gray rounded-full peer peer-checked:bg-gantry-purple transition-all-300">
                <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-all-300 peer-checked:left-6"></div>
              </div>
              <span className="ml-3 text-sm font-medium">Group buying only</span>
            </label>
          </div>
        </div>
      )}
      
      {/* Applied filters */}
      {(selectedCategory !== "All" || selectedTags.length > 0 || showOnlyGroupBuying) && (
        <div className="mb-4 flex flex-wrap gap-2 animate-fade-in">
          {selectedCategory !== "All" && (
            <div className="bg-gantry-purple/10 text-gantry-purple rounded-full px-3 py-1 text-sm flex items-center">
              <span className="mr-2">{selectedCategory}</span>
              <button onClick={() => setSelectedCategory("All")} className="hover:bg-gantry-purple/20 rounded-full p-0.5 transition-all-300">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
          
          {selectedTags.map(tag => (
            <div key={tag} className="bg-gantry-purple/10 text-gantry-purple rounded-full px-3 py-1 text-sm flex items-center">
              <span className="mr-2">{tag}</span>
              <button onClick={() => handleTagToggle(tag)} className="hover:bg-gantry-purple/20 rounded-full p-0.5 transition-all-300">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
          
          {showOnlyGroupBuying && (
            <div className="bg-gantry-purple/10 text-gantry-purple rounded-full px-3 py-1 text-sm flex items-center">
              <span className="mr-2">Group Buying</span>
              <button onClick={() => setShowOnlyGroupBuying(false)} className="hover:bg-gantry-purple/20 rounded-full p-0.5 transition-all-300">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      )}
      
      {/* Business grid */}
      {filteredBusinesses.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
          {filteredBusinesses.map((business) => (
            <BusinessCard key={business.id} business={business} />
          ))}
        </div>
      ) : (
        <div className="py-12 text-center animate-fade-in">
          <div className="mb-4 w-16 h-16 mx-auto bg-gantry-gray-light rounded-full flex items-center justify-center">
            <Tag className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium mb-1">No results found</h3>
          <p className="text-gray-600 mb-4">Try adjusting your search or filters.</p>
          <button
            onClick={clearFilters}
            className="px-4 py-2 bg-gantry-purple text-white rounded-lg hover:bg-gantry-purple-dark transition-all-300"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
};

export default Explore;
