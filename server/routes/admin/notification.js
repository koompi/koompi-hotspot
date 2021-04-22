const router = require("express").Router();
const pool = require("../../db");
const fileUpload = require("express-fileupload");
const moment = require("moment");

const path = require("path");
const authorization = require("../../middleware/authorization");

// enable files upload
router.use(
  fileUpload({
    createParentPath: true
  })
);

router.post("/notification", authorization, async (req, res) => {
  try {
    const { title, category, description } = req.body;
    if (!req.files) {
      res.send({
        status: false,
        message: "No file uploaded"
      });
    } else {
      let noti = req.files.file;
      // res.send(avatar.file.name);
      let name = "notification" + "_" + Date.now() + path.extname(noti.name);

      if (
        noti.mimetype == "image/jpeg" ||
        noti.mimetype == "image/png" ||
        noti.mimetype == "image/gif" ||
        noti.mimetype == "image/jpg"
      ) {
        //Use the mv() method to place the file in upload/noti directory (i.e. "uploads")
        noti.mv("./uploads/noti/" + name);
        var now = moment();
        await pool.query(
          "INSERT INTO notification (title,category,description,image,date,acc_id) VALUES($1,$2,$3,$4,$5,$6)",
          [title, category, description, name, now, req.user]
        );

        res.status(200).json({
          status: true,
          title,
          category,
          description,
          message: "File is uploaded",
          data: {
            name: name,
            mimetype: noti.mimetype,
            size: noti.size,
            file: `/uploads/noti/${name}`
          }
        });
      } else {
        console.log(noti.mimetype);
        res.status(401).json({
          message:
            "This format is not allowed , please upload file with '.png','jpeg','.gif','.jpg'!"
        });
      }
    }
  } catch (error) {
    console.log("error on POST notification", error);
    res.status(500).json({ message: "Server Error!" });
  }
});
router.get("/notification", authorization, async (req, res) => {
  try {
    const noti = await pool.query("SELECT * from notification");

    res.status(200).send({
      notification: noti.rows
    });
  } catch (error) {
    console.log("error on get notification", error);
    res.status(500).json({ message: "Server Error!" });
  }
});
module.exports = router;
