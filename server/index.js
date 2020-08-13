const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");

// AWS sending email
const sesClient = require("./routes/Account/aws/aws_ses_client");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// call sesClient to send an email
app.get("/api/ses", (req, res) => {
  sesClient.sendEmail(
    (email = req.body),
    "Hey! Welcome",
    "your here your code to verify"
  );

  res.send(email);
});

/// midlleware

app.use(express.json()); // allow us for req.body
app.use(cors());

/// ROUTES ///

//register and login routes
app.use("/api/auth", require("./routes/Account/jwtAuth"));

//dashboard route
app.use("/api/dashboard", require("./routes/Account/dashboard"));

// Hotspot Plan
app.use("/api/set-plan", require("./routes/hotspot_plan/set_plan"));
app.use("/api/update-plan", require("./routes/hotspot_plan/update_plan"));

app.listen(5000, () => {
  console.log("server is running on port 5000...");
});
