const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");

// AWS sending email middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

/// midlleware

app.use(express.json()); // allow us for req.body
app.use(cors());

/// ROUTES ///

//register and login routes
app.use("/api/auth", require("./routes/Account/jwtAuth"));
app.use("/api/auth", require("./routes/Account/completeInfo"));

//dashboard route
app.use("/api/dashboard", require("./routes/Account/dashboard"));

// Hotspot Plan
app.use("/api/set-plan", require("./routes/hotspot_plan/set_plan"));
app.use("/api/reset-plan", require("./routes/hotspot_plan/reset_plan"));

//  change password
app.use(
  "/api/change-password",
  require("./routes/Account/change_password_Acc")
);
app.use(
  "/api/change-password",
  require("./routes/hotspot_plan/change_password_User")
);

//  forgot and reset password
app.use('/api',require("./routes/Account/forgot_reset_pass"))

// upload avata
app.use("/api", require("./routes/Account/uploadProfile"));

app.listen(5000, () => {
  console.log("server is running on port 5000...");
});
