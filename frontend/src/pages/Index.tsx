import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "@/context/AppContext";
import { FeaturedBusinesses } from "@/components/FeaturedBusinesses";
import { Search, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import debounce from 'lodash/debounce';

const Index: React.FC = () => {
  const { userMode } = useAppContext();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  
  useEffect(() => {
    // Redirect to dashboard if in seller mode
    if (userMode === "seller") {
      navigate("/dashboard");
    }
  }, [userMode, navigate]);

  // Debounced navigation function
  const debouncedNavigate = useCallback(
    debounce((query: string) => {
      if (query.trim()) {
        navigate(`/explore?search=${encodeURIComponent(query.trim())}`);
      }
    }, 500),
    [navigate]
  );

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    setIsTyping(true);
    debouncedNavigate(query);
  };

  // If in seller mode, we'll be redirected, so we don't need to render anything
  if (userMode === "seller") {
    return <div className="loading">Redirecting to seller dashboard...</div>;
  }

  // Buyer view
  return (
    <div className="max-w-screen-xl mx-auto pb-24 px-4 sm:px-6">
      <div className="animate-fade-in">
        {/* Hero Section */}
        <section className="mb-8 mt-6">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Discover <span className="text-gantry-purple">Student-Powered</span> Campus Services
          </h1>
          <p className="text-gray-600 mb-8">
            Support your fellow students while finding what you need.
          </p>

          {/* Search Bar */}
          <div className="relative mb-8">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search for businesses or services..."
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-full focus-ring"
              autoComplete="off"
            />
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-2 md:gap-4 mb-12">
            <CategoryButton icon="🍔" label="Food" />
            <CategoryButton icon="💼" label="Services" />
            <CategoryButton icon="📚" label="Tutoring" />
            <CategoryButton icon="💻" label="Tech" />
            <CategoryButton icon="🧶" label="Crafts" />
            <CategoryButton icon="💄" label="Beauty" />
            <CategoryButton icon="📌" label="More" hasChevron />
          </div>
        </section>

        <FeaturedBusinesses />
      </div>
    </div>
  );
};

const CategoryButton: React.FC<{
  icon: string;
  label: string;
  hasChevron?: boolean;
}> = ({ icon, label, hasChevron }) => {
  return (
    <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-gray-200 hover:bg-gray-50 transition-colors-300 focus-ring">
      <span>{icon}</span>
      <span>{label}</span>
      {hasChevron && <ChevronRight className="h-4 w-4 ml-1" />}
    </button>
  );
};

export default Index;
