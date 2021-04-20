const router = require("express").Router();
const pool = require("../../db");
const moment = require("moment");

const path = require("path");
const authorization = require("../../middleware/authorization");

router.post("/discount", authorization, async (req, res) => {
  try {
    const { description } = req.body;
    if (!req.files) {
      console.log(req.files);

      res.send({
        status: false,
        message: "No file uploaded"
      });
    } else {
      let teacher = req.files.file;
      let name = "teacher" + "_" + Date.now() + path.extname(teacher.name);

      if (
        teacher.mimetype == "image/jpeg" ||
        teacher.mimetype == "image/png" ||
        teacher.mimetype == "image/gif" ||
        teacher.mimetype == "image/jpg"
      ) {
        teacher.mv("./uploads/teacher/" + name);
        var now = moment();

        await pool.query(
          "UPDATE useraccount  SET role = 'Teacher' WHERE id = $1",
          [req.user]
        );

        const teach = await pool.query(
          "select * from discount_teachers where acc_id=$1",
          [req.user]
        );

        if (teach.rows.length !== 0) {
          await pool.query(
            "UPDATE discount_teachers SET description=$1, photo=$2,date=$3 WHERE acc_id=$4",
            [description, name, now, req.user]
          );
        } else
          await pool.query(
            "INSERT INTO discount_teachers (acc_id,description,photo,date) VALUES($1,$2,$3,$4)",
            [req.user, description, name, now]
          );
        res.status(200).json({
          status: true,
          description,
          message: "File is uploaded",
          data: {
            name: name,
            mimetype: teacher.mimetype,
            size: teacher.size,
            file: `/uploads/teacher/${name}`
          }
        });
      } else {
        res.status(401).json({
          message:
            "This format is not allowed , please upload file with '.png','jpeg','.gif','.jpg'!"
        });
      }
    }
  } catch (error) {
    console.log("error on POST discount_teacher", error);
    res.status(500).json({ message: "Server Error!" });
  }
});
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
router.post("/discount:id", authorization, async (req, res) => {
  try {
    const teachers = await pool.query(
      "update discount_teachers set approved = TRUE where acc_id = $1",
      []
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
