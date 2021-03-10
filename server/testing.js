// const cron = require("node-cron");

// cron.schedule("* * * * *", () => {
//   console.log("running every 30 second");
// });
var min = 100000;
var max = 999999;
var code = Math.floor(Math.random() * (max - min + 1) + min);
console.log(code);
