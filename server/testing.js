// const cron = require("node-cron");

// cron.schedule("* * * * *", () => {
//   console.log("running every 30 second");
// });
// var min = 100000;
// var max = 999999;
// var code = Math.floor(Math.random() * (max - min + 1) + min);
// console.log(code);

// var a = "0.000011";
// var b = "1.000011";
// a = parseInt(a,10);
// b = parseFloat(b,10);

// console.log(a);
// console.log(b);

// async function validateAddress(address) {
//   return new Promise(async (resolve, reject) => {
const moment = require("moment");

var due = moment().format("YYYY MMM DD");
console.log(due);
