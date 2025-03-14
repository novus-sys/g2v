
import React from "react";
import { NavLink } from "react-router-dom";
import { Home, Search, Users, User, Package, LayoutDashboard } from "lucide-react";
import { useAppContext } from "@/context/AppContext";

export const Navbar: React.FC = () => {
  const { userMode } = useAppContext();
  const isSeller = userMode === "seller";

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white glass border-t border-gantry-gray/30 px-6 py-2 z-50">
      <div className="max-w-screen-xl mx-auto">
        <div className="flex justify-between items-center">
          {isSeller ? (
            // Seller navigation
            <>
              <NavItem to="/dashboard" icon={<LayoutDashboard className="w-6 h-6" />} label="Dashboard" />
              <NavItem to="/products" icon={<Package className="w-6 h-6" />} label="Products" />
              <NavItem to="/account" icon={<User className="w-6 h-6" />} label="Account" />
            </>
          ) : (
            // Buyer navigation
            <>
              <NavItem to="/" icon={<Home className="w-6 h-6" />} label="Home" />
              <NavItem to="/explore" icon={<Search className="w-6 h-6" />} label="Explore" />
              <NavItem to="/groups" icon={<Users className="w-6 h-6" />} label="Groups" />
              <NavItem to="/account" icon={<User className="w-6 h-6" />} label="Account" />
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
}

const NavItem: React.FC<NavItemProps> = ({ to, icon, label }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex flex-col items-center justify-center px-3 py-2 rounded-xl transition-all-300 ${
          isActive
            ? "text-gantry-purple font-medium"
            : "text-gray-500 hover:text-gantry-purple-light"
        }`
      }
    >
      <div className="transition-transform-300 hover:scale-110">
        {icon}
      </div>
      <span className="text-xs mt-1">{label}</span>
    </NavLink>
  );
};
