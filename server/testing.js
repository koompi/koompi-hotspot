const cron = require("node-cron");

cron.schedule("* * * * *", () => {
  console.log("running every 30 second");
});
