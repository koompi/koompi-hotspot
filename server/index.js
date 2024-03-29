const express = require("express");
require('dotenv').config();
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const moment = require("moment");
// For auto checking
const cron = require("node-cron");
const autoCheck = require("./routes/hotspot_plan/auto/autoCheck");
const autoTopUp = require("./routes/hotspot_plan/auto/autoTopup");
const {connectSelendra} = require("./config/connectSelendra");
// AWS sending email middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// to access profile
app.use(express.static("./"));

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
app.use("/api/hotspot", require("./routes/hotspot_plan/hotspot_plan"));
app.use("/api/hotspot", require("./routes/hotspot_plan/renewPlan"));
// app.use("/api/hotspot", require("./routes/hotspot_plan/disconnect"));

//  change password
app.use(  "/api/change-password", require("./routes/Account/change_password_Acc"));

app.use("/api", require("./routes/Account/change_password_Acc"));

// vote ads
app.use("/api/ads", require("./utils/vote_ads"));


//  Admin
app.use("/api/auth/admin", require("./routes/admin/adminAuth"));
app.use("/api/admin", require("./routes/admin/notification"));
app.use("/api/admin", require("./routes/admin/discount_Teacher"));
app.use("/api/admin", require("./routes/admin/users"));
app.use("/api/admin", require("./routes/admin/dashboard"));

//  forgot and reset password
app.use("/api", require("./routes/Account/forgot_reset_pass"));

// upload avata
app.use("/api", require("./routes/Account/uploadProfile"));
app.use("/api", require("./routes/Account/request_discount"));

// save contact address
app.use("/api/", require("./routes/Account/contact_list"));

// integration with selendra wallet
app.use("/api/selendra", require("./routes/intergrate_Selendra/getwallet"));
// send sms to testing
app.use("/api/test", require("./routes/Account/twilioSMS/lookup"));


// Check deadline at 11:59 PM every day.
cron.schedule("59 23 * * *", () => {
  autoCheck.statusPlan();
  console.log("checking automatically plan every day");
});

// Check auto topup at 11:59 PM every day.
cron.schedule("59 23 * * *", () => {
  autoTopUp.autoRenew();
  console.log("automatically topup every minute");
});

// // Check  every minute for automatically to up.
// cron.schedule("* * * * *", () => {
//   autoTopUp.autoRenew();
//   console.log("automatically topup every minute");
// });

connectSelendra();

app.listen(5000, () => {
  console.log("server is running on port 5000...");

});
