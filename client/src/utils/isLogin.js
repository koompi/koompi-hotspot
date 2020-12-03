import jwt from "jsonwebtoken";

const isLogin = () => {
  let token = localStorage.getItem("token");
  let user = jwt.decode(token);

  if (!user) {
    return false;
  }
  return true;
};

export default isLogin;
