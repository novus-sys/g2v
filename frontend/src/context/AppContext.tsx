
import React, { createContext, useContext, useState } from "react";

type UserMode = "buyer" | "seller";

interface AppContextType {
  userMode: UserMode;
  toggleUserMode: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userMode, setUserMode] = useState<UserMode>("buyer");

  const toggleUserMode = () => {
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
