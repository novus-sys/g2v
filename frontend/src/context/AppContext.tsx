import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

type UserMode = "buyer" | "seller";

interface AppContextType {
  userMode: UserMode;
  toggleUserMode: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userMode, setUserMode] = useState<UserMode>("buyer");
  const { user } = useAuth();

  // Force seller mode for vendors
  useEffect(() => {
    if (user?.role === 'vendor' && userMode !== 'seller') {
      setUserMode('seller');
    }
  }, [user, userMode]);

  const toggleUserMode = () => {
    // Prevent mode toggle for vendors
    if (user?.role === 'vendor') return;
    setUserMode((prevMode) => (prevMode === "buyer" ? "seller" : "buyer"));
  };

  return (
    <AppContext.Provider value={{ userMode, toggleUserMode }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};
