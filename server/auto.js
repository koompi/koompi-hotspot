const cron = require("node-cron");
const autoCheck = require("./routes/hotspot_plan/auto/autoCheck");

// Check deadline at 11:59 PM every day.
cron.schedule("* * * * *", () => {
  autoCheck.statusPlan();
  console.log("checking a plan every day");
});
