const router = require("express").Router();
const pool = require("../../db");
const moment = require("moment");

const path = require("path");
const authorization = require("../../middleware/authorization");

router.get("/discount", authorization, async (req, res) => {
  try {
    const teachers = await pool.query(
      "SELECT  detail.id, detail.fullname, detail.role, d.* FROM  useraccount AS detail, discount_teachers AS d WHERE detail.id::text = d.acc_id"
    );

    res.status(200).send({
      teachers: teachers.rows
    });
  } catch (error) {
    console.log("error on get teacherfication", error);
    res.status(500).json({ message: "Server Error!" });
  }
});
router.post("/discount/:id", authorization, async (req, res) => {
  try {
    const teachers = await pool.query(
      "update discount_teachers set approved = TRUE where acc_id = $1",
      [req.params.id]
    );

    res.status(200).send({
      teachers: teachers.rows
    });
  } catch (error) {
    console.log("error on post discount id", error);
    res.status(500).json({ message: "Server Error!" });
  }
});
router.post("/set-discount", authorization, async (req, res) => {
  try {
    const { role, discount } = req.body;
    await pool.query("insert into setdiscount (role,discount) values($1,$2)", [
      role,
      discount
    ]);

    res.status(200).send({
      status: true
    });
  } catch (error) {
    console.log("error on post set-discount", error);
    res.status(500).json({ message: "Server Error!" });
  }
});
router.get("/set-discount", authorization, async (req, res) => {
  try {
    const roles = await pool.query("select * from setdiscount");

    res.status(200).send({
      roles: roles.rows
    });
  } catch (error) {
    console.log("error on get set-discount", error);
    res.status(500).json({ message: "Server Error!" });
  }
});
module.exports = router;
