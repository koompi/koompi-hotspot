import { useEffect } from "react";
import Cookie from "js-cookie";
const Logout = () => {
  useEffect(() => {
    Cookie.set("token", "");
    window.location.replace("/login");
  });
  return null;
};

export default Logout;
