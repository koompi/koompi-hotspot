import React, { Fragment, useEffect, useState } from "react";
import axios from "axios";
// import { toast } from "react-toastify";

const Dashboard = ({ setAuth }) => {
  const [name, setName] = useState([]);
  useEffect(() => {
    axios({
      method: "GET",
      url:
        "http://ec2-52-221-199-235.ap-southeast-1.compute.amazonaws.com:5000/api/dashboard",
      headers: {
        token: localStorage.token,
        "Content-type": " application/json",
      },
    }).then((res) => {
      setName(res.data);
      console.log(" hello data", res.data);
    });
  }, []);

  // const getProfile = async e => {
  //   try {
  //     const res = await fetch(
  //       "http://ec2-52-221-199-235.ap-southeast-1.compute.amazonaws.com:5000/api/dashboard",
  //       {
  //         method: " GET",
  //         headers: { token: localStorage.token }
  //       }
  //     );

  //     const parseData = await res.json();
  //     console.log(parseData);
  //     setName(parseData.full_name);
  //   } catch (err) {
  //     console.error(err.message);
  //   }
  // };

  // const logout = async e => {
  //   e.preventDefault();
  //   try {
  //     localStorage.removeItem("token");
  //     setAuth(false);
  //     toast.success("Log out successfully");
  //   } catch (err) {
  //     console.error(err.message);
  //   }
  // };

  // useEffect(() => {
  //   getProfile();
  //   console.log("hello world");
  // }, []);

  return (
    <Fragment>
      <h1>Dashboard</h1>
      <h2>Welcome{name.full_name}</h2>
      {/* <button onClick={e => logout(e)}>Authenticate</button> */}
    </Fragment>
  );
};

export default Dashboard;
