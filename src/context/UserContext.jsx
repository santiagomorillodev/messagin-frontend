import { createContext, useState } from "react";

export const UserContext = createContext();

export function UserProvider({ children }) {
  const [currentUserContext, setCurrentUserContext] = useState(null);

  return (
    <UserContext.Provider value={{ currentUserContext, setCurrentUserContext }}>
      {children}
    </UserContext.Provider>
  );
}
