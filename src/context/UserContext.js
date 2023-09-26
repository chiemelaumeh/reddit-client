import { createContext, useState, useEffect } from "react";

const UserContext = createContext();

const refreshUser = JSON.parse(localStorage.getItem("user"))

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(refreshUser);
  // const [user, setUser] = useState("");

  const [wrongPassState, setWrongPassState] = useState(false)

useEffect(() => {
        localStorage.setItem("user", JSON.stringify(user))
      }, [user])

  
    

  return (
    <UserContext.Provider value={{ user, setUser, wrongPassState, setWrongPassState }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext