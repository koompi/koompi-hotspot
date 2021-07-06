const router = require("express").Router();
const pool = require("../../db");

const authorization = require("../../middleware/authorization");

// view discount part
router.get("/view-discount", authorization, async (req, res) => {
  try {
    const teachers = await pool.query(
      "SELECT  detail.id, detail.fullname, detail.role, d.* FROM  useraccount AS detail, discount_teachers AS d WHERE detail.id::text = d.acc_id AND approved = FALSE"
    );

    res.status(200).send({
      teachers: teachers.rows
    });
  } catch (error) {
    console.log("error on get teacherfication", error);
    res.status(500).json({ message: "Server Error!" });
  }
});
router.put("/approve-discount/:id", authorization, async (req, res) => {
  try {
    const teachers = await pool.query(
      "update discount_teachers set approved = TRUE where id = $1",
      [req.params.id]
    );

    res.status(200).send({
      status: true
    });
  } catch (error) {
    console.log("error on post discount id", error);
    res.status(500).json({ message: "Server Error!" });
  }
});

// approved discount part
router.get("/approved-discount", authorization, async (req, res) => {
  try {
    const teachers = await pool.query(
      "SELECT  detail.id, detail.fullname, detail.role, d.* FROM  useraccount AS detail, discount_teachers AS d WHERE detail.id::text = d.acc_id AND approved = TRUE"
    );

    res.status(200).send({
      approved: teachers.rows
    });
  } catch (error) {
    console.log("error on get approved discount", error);
    res.status(500).json({ message: "Server Error!" });
  }
});
router.put("/disapprove-discount/:id", authorization, async (req, res) => {
  try {
    const teachers = await pool.query(
      "update discount_teachers set approved = FALSE where id = $1",
      [req.params.id]
    );

    res.status(200).send({
      status: true
    });
  } catch (error) {
    console.log("error on post approved discount id", error);
    res.status(500).json({ message: "Server Error!" });
  }
});

// set discount path
router.post("/set-discount", authorization, async (req, res) => {
  try {
    const { role, discount } = req.body;
    const type = await pool.query("select * from setdiscount where role = $1", [
      role
    ]);

    if (type.rows.length !== 0) {-
      await pool.query("update setdiscount set discount = $1 where role = $2", [
        discount,
        role
      ]);
    } else {
      await pool.query(
        "insert into setdiscount (role,discount) values($1,$2)",
        [role, discount]
      );
    }

    res.status(200).send({
      message: `Set discount for ${role}.`
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
router.delete("/set-discount/:id", authorization, async (req, res) => {
  try {
    await pool.query("delete from setdiscount where id = $1", [
      req.params.id
    ]);

    res.status(200).send({
      message: `Deleted discount for role : ${req.params.id}.`
    });
  } catch (error) {
    console.log("error on post set-discount", error);
    res.status(500).json({ message: "Server Error!" });
  }
});
module.exports = router;
