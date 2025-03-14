
import React from "react";
import { Navbar } from "./Navbar";
import { GamificationBar } from "./GamificationBar";
import { Outlet } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { ModeToggle } from "./ModeToggle";

export const Layout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gantry-white flex flex-col">
      <header className="fixed top-0 left-0 right-0 bg-white glass border-b border-gantry-gray/30 px-6 py-2 z-50">
        <div className="max-w-screen-xl mx-auto flex items-center justify-between">
          <NavLink to="/" className="flex items-center">
            <span className="text-xl font-bold text-gantry-purple">Gantries</span>
          </NavLink>
          
          <div className="flex items-center gap-3">
            <ModeToggle />
            <GamificationBar />
          </div>
        </div>
      </header>
      <main className="flex-1 pt-16 mt-8 transition-all-300 animate-fade-in">
        <Outlet />
      </main>
      <Navbar />
    </div>
  );
};
