const Logout = () => {
  localStorage.removeItem("token");
  window.location.replace("/admin");
};

export default Logout;
