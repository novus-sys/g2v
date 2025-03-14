import React from "react";
import { User, Mail, Phone, MapPin, Calendar, ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { UserProfile } from "../types";

// Using the same mock user data from Account page
const USER_PROFILE: UserProfile = {
  id: "user1",
  name: "Vivek Kumar",
  avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
  level: 3,
  points: 750,
  badges: ["Early Adopter", "Social Butterfly", "Group Buy Expert"],
  rank: "Campus Explorer",
  email: "vivek.kumar@example.com",
  phone: "+91 98765 43210",
  location: "Mumbai, Maharashtra",
  joinedDate: "January 2024"
};

interface ProfileFieldProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  isEditable?: boolean;
}

const ProfileField: React.FC<ProfileFieldProps> = ({ icon, label, value, isEditable = true }) => {
  return (
    <div className="border-b border-gantry-gray/20 last:border-b-0">
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gantry-purple/5 flex items-center justify-center">
              {icon}
            </div>
            <div>
              <p className="text-sm text-gray-600">{label}</p>
              <p className="font-medium">{value}</p>
            </div>
          </div>
          {isEditable && (
            <button className="text-gantry-purple hover:text-gantry-purple-dark transition-all duration-300 text-sm font-medium">
              Edit
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const ProfileInformation: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-screen-xl mx-auto pb-24 section-padding">
      <div className="animate-fade-in">
        {/* Header with back button */}
        <div className="flex items-center mb-6">
          <button 
            onClick={() => navigate(-1)}
            className="mr-4 p-2 hover:bg-gantry-gray-light rounded-full transition-all duration-300"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-bold">Profile Information</h1>
        </div>

        {/* Profile Picture Section */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6 border border-gantry-gray/20">
          <div className="flex items-center">
            <div className="w-24 h-24 rounded-full overflow-hidden mr-6 border-2 border-gantry-purple">
              <img
                src={USER_PROFILE.avatarUrl}
                alt={USER_PROFILE.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <button className="bg-gantry-purple text-white px-4 py-2 rounded-lg hover:bg-gantry-purple-dark transition-all duration-300">
                Change Photo
              </button>
              <p className="text-sm text-gray-600 mt-2">
                Recommended: Square JPG, PNG, or GIF, at least 1000x1000 pixels.
              </p>
            </div>
          </div>
        </div>

        {/* Personal Information Section */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gantry-gray/20">
          <div className="p-4 border-b border-gantry-gray/20">
            <h2 className="font-semibold">Personal Information</h2>
          </div>

          <ProfileField
            icon={<User className="w-5 h-5 text-gantry-purple" />}
            label="Full Name"
            value={USER_PROFILE.name}
          />

          <ProfileField
            icon={<Mail className="w-5 h-5 text-gantry-purple" />}
            label="Email Address"
            value={USER_PROFILE.email}
          />

          <ProfileField
            icon={<Phone className="w-5 h-5 text-gantry-purple" />}
            label="Phone Number"
            value={USER_PROFILE.phone}
          />

          <ProfileField
            icon={<MapPin className="w-5 h-5 text-gantry-purple" />}
            label="Location"
            value={USER_PROFILE.location}
          />

          <ProfileField
            icon={<Calendar className="w-5 h-5 text-gantry-purple" />}
            label="Member Since"
            value={USER_PROFILE.joinedDate}
            isEditable={false}
          />
        </div>
      </div>
    </div>
  );
};

export default ProfileInformation; 