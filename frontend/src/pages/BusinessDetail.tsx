import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from '../lib/axios';

interface Business {
  _id: string;
  name: string;
  description: string;
  logo: string;
  coverImage: string;
  rating: number;
  reviewCount: number;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  products: Array<{
    _id: string;
    name: string;
    description: string;
    price: number;
    image: string;
    category: string;
  }>;
}

const BusinessDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [business, setBusiness] = useState<Business | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    const fetchBusiness = async () => {
      try {
        const response = await axios.get(`/api/businesses/${id}`);
        setBusiness(response.data);
      } catch (err) {
        setError('Failed to load business details. Please try again.');
        console.error('Error fetching business:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBusiness();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gantry-blue mx-auto"></div>
          <p className="mt-2 text-sm text-gray-500">Loading business details...</p>
        </div>
      </div>
    );
  }

  if (error || !business) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Error</h2>
          <p className="mt-2 text-sm text-gray-600">{error || 'Business not found'}</p>
        </div>
      </div>
    );
  }

  const categories = ['all', ...new Set(business.products.map(product => product.category))];
  const filteredProducts = business.products.filter(
    product => selectedCategory === 'all' || product.category === selectedCategory
  );

  return (
    <div className="bg-white">
      {/* Cover Image */}
      <div className="relative h-64 sm:h-80">
        <img
          src={business.coverImage}
          alt={business.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
      </div>

      {/* Business Info */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative -mt-16 sm:-mt-24">
          <div className="bg-white p-6 sm:p-8 shadow-lg rounded-lg">
            <div className="sm:flex sm:items-center sm:justify-between">
              <div className="sm:flex sm:items-center">
                <img
                  src={business.logo}
                  alt={business.name}
                  className="h-20 w-20 rounded-lg object-cover"
                />
                <div className="mt-4 sm:mt-0 sm:ml-6">
                  <h1 className="text-2xl font-bold text-gray-900">{business.name}</h1>
                  <div className="mt-2 flex items-center">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`h-5 w-5 ${
                            i < business.rating ? 'text-yellow-400' : 'text-gray-300'
                          }`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 15.585l-6.327 3.89 1.42-7.897L.222 6.974l7.947-1.092L10 0l1.831 5.882 7.947 1.092-4.871 4.604 1.42 7.897L10 15.585z"
                            clipRule="evenodd"
                          />
                        </svg>
                      ))}
                    </div>
                    <p className="ml-2 text-sm text-gray-500">
                      {business.rating} ({business.reviewCount} reviews)
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-4 sm:mt-0">
                <p className="text-sm text-gray-500">{business.address.street}</p>
                <p className="text-sm text-gray-500">
                  {business.address.city}, {business.address.state} {business.address.zipCode}
                </p>
              </div>
            </div>
            <p className="mt-4 text-gray-600">{business.description}</p>
          </div>
        </div>

        {/* Category Filter */}
        <div className="mt-8">
          <div className="flex space-x-2 overflow-x-auto pb-2">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium ${
                  selectedCategory === category
                    ? 'bg-gantry-blue text-white'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="mt-8 grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 pb-16">
          {filteredProducts.map(product => (
            <div key={product._id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-medium text-gray-900">{product.name}</h3>
                <p className="mt-1 text-sm text-gray-500">{product.description}</p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-lg font-medium text-gray-900">
                    ${product.price.toFixed(2)}
                  </span>
                  <Link
                    to={`/groups/create?product=${product._id}`}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gantry-blue hover:bg-blue-700"
                  >
                    Start Group Buy
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BusinessDetail; 