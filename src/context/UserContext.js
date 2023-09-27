import { refresh } from "@cloudinary/url-gen/qualifiers/artisticFilter";
import { createContext, useState, useEffect } from "react";

const UserContext = createContext();


const refreshUser = JSON.parse(localStorage.getItem("user") || {_id: '', email: '', username: '', verified: false,})



export const UserProvider = ({ children }) => {
  const [user, setUser] = useState( refreshUser );
  // const [user, setUser] = useState("");
  
  const [wrongPassState, setWrongPassState] = useState(false)
  
  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(user))
  }, [user])
  console.log(user)
      console.log(refreshUser)

  
      // setUser(refreshUser);

  return (
    <UserContext.Provider value={{ user, setUser, wrongPassState, setWrongPassState }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext