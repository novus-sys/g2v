import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import axios from '../lib/axios';

interface CreateGroupForm {
  name: string;
  description: string;
  targetParticipants: number;
  expiryDate: string;
  product: {
    name: string;
    price: number;
    discountPercentage: number;
  };
}

const CreateGroup: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<CreateGroupForm>({
    name: '',
    description: '',
    targetParticipants: 2,
    expiryDate: '',
    product: {
      name: '',
      price: 0,
      discountPercentage: 0,
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      navigate('/signin', { state: { from: '/groups/create' } });
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      
      const response = await axios.post('/api/groups', formData);
      navigate(`/groups/${response.data._id}`);
    } catch (err) {
      setError('Failed to create group. Please try again.');
      console.error('Error creating group:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name.startsWith('product.')) {
      const productField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        product: {
          ...prev.product,
          [productField]: value,
        },
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="md:grid md:grid-cols-3 md:gap-6">
        <div className="md:col-span-1">
          <div className="px-4 sm:px-0">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Create a New Group</h3>
            <p className="mt-1 text-sm text-gray-600">
              Fill in the details below to start a new group buy. Others will be able to join your group
              until it reaches the target number of participants or expires.
            </p>
          </div>
        </div>

        <div className="mt-5 md:mt-0 md:col-span-2">
          <form onSubmit={handleSubmit}>
            <div className="shadow sm:rounded-md sm:overflow-hidden">
              <div className="px-4 py-5 bg-white space-y-6 sm:p-6">
                {error && (
                  <div className="rounded-md bg-red-50 p-4">
                    <div className="text-sm text-red-700">{error}</div>
                  </div>
                )}

                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Group Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="mt-1 focus:ring-gantry-blue focus:border-gantry-blue block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  />
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows={3}
                    required
                    value={formData.description}
                    onChange={handleChange}
                    className="mt-1 focus:ring-gantry-blue focus:border-gantry-blue block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  />
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="targetParticipants" className="block text-sm font-medium text-gray-700">
                      Target Participants
                    </label>
                    <input
                      type="number"
                      name="targetParticipants"
                      id="targetParticipants"
                      min="2"
                      required
                      value={formData.targetParticipants}
                      onChange={handleChange}
                      className="mt-1 focus:ring-gantry-blue focus:border-gantry-blue block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>

                  <div>
                    <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700">
                      Expiry Date
                    </label>
                    <input
                      type="datetime-local"
                      name="expiryDate"
                      id="expiryDate"
                      required
                      value={formData.expiryDate}
                      onChange={handleChange}
                      className="mt-1 focus:ring-gantry-blue focus:border-gantry-blue block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <h4 className="text-sm font-medium text-gray-900">Product Details</h4>
                  
                  <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-3">
                    <div className="sm:col-span-2">
                      <label htmlFor="product.name" className="block text-sm font-medium text-gray-700">
                        Product Name
                      </label>
                      <input
                        type="text"
                        name="product.name"
                        id="product.name"
                        required
                        value={formData.product.name}
                        onChange={handleChange}
                        className="mt-1 focus:ring-gantry-blue focus:border-gantry-blue block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>

                    <div>
                      <label htmlFor="product.price" className="block text-sm font-medium text-gray-700">
                        Price
                      </label>
                      <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <span className="text-gray-500 sm:text-sm">$</span>
                        </div>
                        <input
                          type="number"
                          name="product.price"
                          id="product.price"
                          required
                          min="0"
                          step="0.01"
                          value={formData.product.price}
                          onChange={handleChange}
                          className="focus:ring-gantry-blue focus:border-gantry-blue block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="product.discountPercentage" className="block text-sm font-medium text-gray-700">
                        Discount %
                      </label>
                      <div className="mt-1 relative rounded-md shadow-sm">
                        <input
                          type="number"
                          name="product.discountPercentage"
                          id="product.discountPercentage"
                          required
                          min="0"
                          max="100"
                          value={formData.product.discountPercentage}
                          onChange={handleChange}
                          className="focus:ring-gantry-blue focus:border-gantry-blue block w-full pr-8 sm:text-sm border-gray-300 rounded-md"
                        />
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                          <span className="text-gray-500 sm:text-sm">%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gantry-blue hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gantry-blue disabled:opacity-50"
                >
                  {isSubmitting ? 'Creating...' : 'Create Group'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateGroup; 