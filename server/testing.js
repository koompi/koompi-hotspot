const pool = require("./db");

const checkDiscount = async () => {
  const req = "0a1d3284-f2ea-4c84-a6c6-aface91cc6e1";
  const a = await pool.query("SELECT role  FROM useraccount where id=$1", [
    req
  ]);
  if (a.rows[0].role === "Teacher") {
    var b = await pool.query(
      "select d.*,s.* from discount_teachers as d INNER JOIN setdiscount as s ON (d.acc_id=$1 AND d.approved IS TRUE AND s.role = 'Teacher')",
      [req]
    );
    return b.rows[0].discount;
  } else if (a.rows[0].role === "Normal") {
    const c = await pool.query(
      "SELECT *  FROM setdiscount where role='Normal'"
    );
    return c.role[0].discount;
  }
};

console.log(checkDiscount());
