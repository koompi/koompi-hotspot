const Logout = () => {
  localStorage.removeItem("token");
  window.location.replace("/");
};

export default Logout;
