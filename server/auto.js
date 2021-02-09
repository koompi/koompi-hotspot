const cron = require("node-cron");
const autoCheck = require("./routes/hotspot_plan/auto/autoCheck");

// Check deadline at 11:59 PM every day.
cron.schedule("59 23 * * *", () => {
  autoCheck.statusPlan();
  console.log("checking a plan every day");
});
