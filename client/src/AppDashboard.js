import React, { useState } from "react";
import "./App.css";
import "./assets/css/App.css";
// import Navbar from "./admin/components/layout/navbar/Navbar";
// import Main from "./admin/components/pages/main/Main";
// import Sidebar from "./admin/components/layout/sidebar/Sidebar";
// import Dashboard from "./admin/index";
import Login from "./admin/user/login";

const AppDashboard = () => {
  // const [sidebarOpen, setSidebarOpen] = useState(false);

  // const openSidebar = () => {
  //   setSidebarOpen(true);
  // };

  // const closeSidebar = () => {
  //   setSidebarOpen(false);
  // };
  return (
    // <div className="container">
    //   <Navbar sidebarOpen={sidebarOpen} openSidebar={openSidebar} />
    //   <Main />
    //   <Sidebar sidebarOpen={sidebarOpen} closeSidebar={closeSidebar} />
    // </div>
    // <Dashboard />
    <Login />
  );
};

export default AppDashboard;
