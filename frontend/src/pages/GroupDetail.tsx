import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  Users,
  Clock,
  ArrowLeft,
  Calendar,
  Tag,
  DollarSign,
  UserPlus,
  MessageSquare,
} from "lucide-react";
import axios from "../lib/axios";
import { useAuth } from "../hooks/useAuth";
import { Button } from "../components/ui/button";
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
  status: "open" | "closed" | "completed";
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
  const diffHours = Math.floor(
    (diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );

  if (diffDays > 0) {
    return `${diffDays}d ${diffHours}h left`;
  }

  const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  if (diffHours > 0) {
    return `${diffHours}h ${diffMinutes}m left`;
  }

  return `${diffMinutes}m left`;
}

const GroupDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [group, setGroup] = useState<Group | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGroup = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/groups/${id}`);
        setGroup(response.data);
      } catch (err) {
        setError("Failed to fetch group details");
        toast({
          title: "Error",
          description: "Failed to load group details",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchGroup();
  }, [id, toast]);

  const handleJoinGroup = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to join the group",
        variant: "destructive",
      });
      navigate("/signin");
      return;
    }

    try {
      await axios.post(`/groups/${id}/join`);
      toast({
        title: "Success",
        description: "You've successfully joined the group!",
      });
      // Refresh group data
      const response = await axios.get(`/groups/${id}`);
      setGroup(response.data);
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to join the group",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="container px-4 py-6 max-w-screen-xl mx-auto mb-20">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gantry-purple"></div>
        </div>
      </div>
    );
  }

  if (error || !group) {
    return (
      <div className="container px-4 py-6 max-w-screen-xl mx-auto mb-20">
        <Link
          to="/groups"
          className="flex items-center text-gantry-purple mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Groups
        </Link>
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold">Group Not Found</h2>
          <p className="text-gray-500 mt-2">
            The group you're looking for doesn't exist
          </p>
        </div>
      </div>
    );
  }

  const isMember = group.members.some((member) => member._id === user?._id);
  const isCreator = group.creator._id === user?._id;

  return (
    <div className="container px-4 py-6 max-w-screen-xl mx-auto mb-20">
      <Link to="/groups" className="flex items-center text-gantry-purple mb-6">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Groups
      </Link>

      <div className="bg-white rounded-2xl overflow-hidden border border-gantry-gray/20 shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="h-64 md:h-full">
            <img
              src={
                group.image ||
                "https://via.placeholder.com/400x300?text=No+Image"
              }
              alt={group.name}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-2xl font-bold">{group.name}</h1>
                <p className="text-gantry-gray-dark">
                  Created by {group.creator.firstName} {group.creator.lastName}
                </p>
              </div>

              <div
                className={`px-3 py-1.5 rounded-full text-sm font-medium ${
                  group.status === "open"
                    ? "bg-green-100 text-green-800"
                    : group.status === "completed"
                    ? "bg-blue-100 text-blue-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {group.status.charAt(0).toUpperCase() + group.status.slice(1)}
              </div>
            </div>

            <p className="mb-6">{group.description}</p>

            <div className="space-y-4 mb-6">
              <div className="flex items-center text-gantry-gray-dark">
                <Users className="w-4 h-4 mr-2" />
                <span>
                  {group.members.length}/{group.maxMembers} members
                </span>
              </div>

              <div className="flex items-center text-gantry-gray-dark">
                <Clock className="w-4 h-4 mr-2" />
                <span>{getRemainingTimeLabel(group.expiryDate)}</span>
              </div>

              <div className="flex items-center text-gantry-gray-dark">
                <Tag className="w-4 h-4 mr-2" />
                <span>{group.category}</span>
              </div>

              <div className="flex items-center text-gantry-gray-dark">
                <Calendar className="w-4 h-4 mr-2" />
                <span>
                  Created {new Date(group.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>

            <div className="mb-6">
              <div className="w-full bg-gantry-gray rounded-full h-2 mb-2">
                <div
                  className="bg-gantry-purple h-2 rounded-full transition-all duration-1000 ease-in-out"
                  style={{
                    width: `${
                      (group.currentAmount / group.targetAmount) * 100
                    }%`,
                  }}
                ></div>
              </div>

              <div className="flex justify-between items-center">
                <div>
                  <span className="text-lg font-bold text-gantry-purple">
                    ${group.currentAmount.toFixed(2)}
                  </span>
                  <span className="text-sm text-gantry-gray-dark ml-1">
                    of ${group.targetAmount.toFixed(2)}
                  </span>
                </div>

                {group.status === "open" && (
                  <div className="text-gantry-purple-light text-sm font-medium">
                    ${(group.targetAmount - group.currentAmount).toFixed(2)}{" "}
                    more to reach target
                  </div>
                )}
              </div>
            </div>

            {group.rules.length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold mb-2">Group Rules</h3>
                <ul className="list-disc list-inside space-y-1 text-gantry-gray-dark">
                  {group.rules.map((rule, index) => (
                    <li key={index}>{rule}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex gap-4">
              {group.status === "open" && !isMember && !isCreator && (
                <Button
                  className="flex-1 bg-gantry-purple hover:bg-gantry-purple-dark"
                  onClick={handleJoinGroup}
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Join Group
                </Button>
              )}
              <Button
                className="flex-1 bg-white border border-gantry-gray hover:bg-gantry-gray/5"
                onClick={() => {
                  // TODO: Implement chat functionality
                  toast({
                    title: "Coming Soon",
                    description: "Chat functionality will be available soon!",
                  });
                }}
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                Chat
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Members Section */}
      <div className="mt-8 bg-white rounded-2xl p-6 border border-gantry-gray/20 shadow-md">
        <h2 className="text-xl font-bold mb-4">Members</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {group.members.map((member) => (
            <div
              key={member._id}
              className="flex items-center p-3 bg-gantry-gray/5 rounded-lg"
            >
              <div className="w-10 h-10 rounded-full bg-gantry-purple/10 flex items-center justify-center text-gantry-purple font-semibold">
                {member.firstName[0]}
                {member.lastName[0]}
              </div>
              <div className="ml-3">
                <p className="font-medium">
                  {member.firstName} {member.lastName}
                </p>
                <p className="text-sm text-gantry-gray-dark">{member.email}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GroupDetail;
