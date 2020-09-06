import React, { Fragment} from "react";
import "./App.css";

import "react-toastify/dist/ReactToastify.css";

//components

// import Login from "./components/Login";
import Register from "./components/Register";
// import Dashboard from "./components/Dashboard";

// toast.configure();

function App() {
  return (
    <Fragment>
      {/* <Router> */}
      <div className="App">
        <Register />
      </div>
      {/* </Router> */}
    </Fragment>
  );
}

export default App;
