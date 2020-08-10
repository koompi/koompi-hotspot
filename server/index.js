const express = require("express");
const app = express();
const cors = require("cors");

/// midlleware

app.use(express.json()); // allow us for req.body
app.use(cors());

/// ROUTES ///

//register and login routes

app.use("/api/auth", require("./routes/jwtAuth"));

//dashboard route

app.use("/api/dashboard", require("./routes/dashboard"));

// Hotspot Plan

app.use("/api/set-plan", require("./routes/hotspot_plan/set_plan"));

app.listen(5000, () => {
  console.log("server is running on port 5000...");
});
