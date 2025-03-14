import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Users, Clock, Plus, Search, Filter, Loader2 } from "lucide-react";
import axios from "../lib/axios";
import { useAuth } from "../hooks/useAuth";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { useToast } from "../components/ui/use-toast";

interface Group {
  _id: string;
  name: string;
  description: string;
  creator: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  members: Array<{
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  }>;
  maxMembers: number;
  status: 'open' | 'closed' | 'completed';
  category: string;
  targetAmount: number;
  currentAmount: number;
  expiryDate: string;
  image?: string;
  rules: string[];
  createdAt: string;
  updatedAt: string;
}

function getRemainingTimeLabel(expiryDate: string): string {
  const now = new Date();
  const expiry = new Date(expiryDate);
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
  const { user } = useAuth();
  const { toast } = useToast();
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  // Fetch groups from API
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get('/api/groups');
        setGroups(response.data);
      } catch (err) {
        setError('Failed to fetch groups. Please try again later.');
        toast({
          title: "Error",
          description: "Failed to fetch groups. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchGroups();
  }, [toast]);

  // Filter and search groups
  const filteredGroups = groups.filter(group => {
    const matchesSearch = 
      group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      group.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || group.status === statusFilter;
    const matchesCategory = categoryFilter === "all" || group.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  // Get unique categories for filter
  const categories = Array.from(new Set(groups.map(group => group.category)));

  return (
    <div className="container px-4 py-6 max-w-screen-xl mx-auto mb-20">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Groups</h1>
        <Link to="/groups/create">
          <Button className="bg-gantry-purple hover:bg-gantry-purple-dark">
            <Plus className="w-4 h-4 mr-2" /> Create Group
          </Button>
        </Link>
      </div>

      <div className="bg-white rounded-2xl p-4 mb-6 border border-gantry-gray/20 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Search groups..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <div className="flex gap-4">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-gantry-purple" />
        </div>
      ) : error ? (
        <div className="text-center py-12 bg-white rounded-2xl shadow-sm border border-gantry-gray/20">
          <div className="text-red-500 mb-4">⚠️</div>
          <h3 className="text-xl font-medium text-gray-700 mb-2">Error Loading Groups</h3>
          <p className="text-gray-500">{error}</p>
        </div>
      ) : filteredGroups.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl shadow-sm border border-gantry-gray/20">
          <Users className="w-12 h-12 mx-auto text-gantry-purple/50 mb-4" />
          <h3 className="text-xl font-medium text-gray-700 mb-2">No groups found</h3>
          <p className="text-gray-500 mb-4">
            {searchTerm || statusFilter !== "all" || categoryFilter !== "all"
              ? "Try adjusting your filters"
              : "Start by creating a new group"}
          </p>
          {!searchTerm && statusFilter === "all" && categoryFilter === "all" && (
            <Link to="/groups/create">
              <Button className="bg-gantry-purple hover:bg-gantry-purple-dark">
                <Plus className="w-4 h-4 mr-2" /> Create First Group
              </Button>
            </Link>
          )}
        </div>
      ) : (
      <div className="grid grid-cols-1 gap-6">
          {filteredGroups.map((group) => (
          <Link 
              key={group._id}
              to={`/groups/${group._id}`}
            className="block"
          >
              <div className="bg-white rounded-2xl overflow-hidden border border-gantry-gray/20 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
              <div className="flex flex-col sm:flex-row">
                <div className="w-full sm:w-1/4 h-48 sm:h-auto">
                  <img 
                      src={group.image || 'https://via.placeholder.com/400x300?text=No+Image'} 
                      alt={group.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="flex-1 p-6">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                        <h3 className="font-semibold text-lg">{group.name}</h3>
                        <p className="text-gantry-gray-dark">Created by {group.creator.firstName} {group.creator.lastName}</p>
                        <p className="mt-2">{group.description}</p>
                      </div>
                      
                      <div className={`px-3 py-1.5 rounded-full text-sm font-medium ${
                        group.status === 'open' 
                          ? 'bg-green-100 text-green-800'
                          : group.status === 'completed'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {group.status.charAt(0).toUpperCase() + group.status.slice(1)}
                      </div>
                  </div>
                  
                  <div className="flex items-center justify-between my-4">
                    <div className="flex items-center text-gantry-gray-dark">
                      <Users className="w-4 h-4 mr-1" />
                        <span>{group.members.length}/{group.maxMembers} members</span>
                    </div>
                    
                    <div className="flex items-center text-gantry-gray-dark">
                      <Clock className="w-4 h-4 mr-1" />
                        <span>{getRemainingTimeLabel(group.expiryDate)}</span>
                      </div>
                  </div>
                  
                  <div className="mt-2">
                    <div className="w-full bg-gantry-gray rounded-full h-2">
                      <div 
                        className="bg-gantry-purple h-2 rounded-full transition-all duration-1000 ease-in-out" 
                          style={{ width: `${(group.currentAmount / group.targetAmount) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex justify-between items-center">
                    <div>
                        <span className="text-lg font-bold text-gantry-purple">
                          ${group.currentAmount.toFixed(2)}
                        </span>
                        <span className="text-sm text-gantry-gray-dark ml-1">
                          of ${group.targetAmount.toFixed(2)}
                      </span>
                    </div>
                    
                      {group.status === 'open' && (
                    <div className="text-gantry-purple-light text-sm font-medium">
                          ${(group.targetAmount - group.currentAmount).toFixed(2)} more to reach target
                        </div>
                      )}
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
      )}
    </div>
  );
};

export default Groups;
