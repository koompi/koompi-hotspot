const pool = require("./db");

pool.query("UPDATE radcheck SET status = true WHERE acc_id = $1", [
  "0a1d3284-f2ea-4c84-a6c6-aface91cc6e1"
]);
