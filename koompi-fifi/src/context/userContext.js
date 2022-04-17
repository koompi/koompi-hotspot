import React, { createContext, useState, useEffect } from "react";
import jwt from "jsonwebtoken";
import Cookie from "js-cookie";

export const UserContext = createContext();

export const UserProvider = (props) => {
  const [user, setUser] = useState({
    fullname: "",
    email: "",
    avatar: "",
  });

  useEffect(() => {
    let token = Cookie.get("token");
    let user = jwt.decode(token);
    setUser(user);
  }, []);

  return (
    <UserContext.Provider value={{ user }}>
      {props.children}
    </UserContext.Provider>
  );
};
