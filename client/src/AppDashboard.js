import React, { useState } from "react";
import Navbar from "./dashboard/components/navbar/Navbar";
import Main from "./dashboard/components/main/Main";
import Sidebar from "./dashboard/components/sidebar/Sidebar";

const AppDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const openSidebar = () => {
    setSidebarOpen(true);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };
  return (
    <div className="container">
      <Navbar sidebarOpen={sidebarOpen} openSidebar={openSidebar} />
      <Main />
      <Sidebar sidebarOpen={sidebarOpen} closeSidebar={closeSidebar} />
    </div>
  );
};

export default AppDashboard;
