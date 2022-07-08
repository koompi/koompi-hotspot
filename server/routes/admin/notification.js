const router = require("express").Router();
const pool = require("../../db");
const fileUpload = require("express-fileupload");
const cors = require("cors");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const moment = require("moment");
require("dotenv").config({ path: `../../.env` });

const path = require("path");
const authorization = require("../../middleware/authorization");



// add other middleware
router.use(cors());
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));
router.use(morgan("dev"));

// enable files upload
router.use(
  fileUpload({
    createParentPath: true
  })
);

// upload image notification
router.post("/upload-img-notification", authorization, async (req, res) => {
  try {
    if (!req.files) {
      res.send({
        status: false,
        message: "No file uploaded"
      });
    } else {
      //Use the name of the input field (i.e. "image") to retrieve the uploaded file
      let image = req.files.file;
      // res.send(avatar.file.name);
      let name = "notification" + "_" + Date.now() + path.extname(image.name);

      if (
        image.mimetype == "image/jpeg" ||
        image.mimetype == "image/png" ||
        image.mimetype == "image/gif" ||
        image.mimetype == "image/jpg"
      ) {
        //Use the mv() method to place the file in upload directory (i.e. "uploads")
        image.mv("./uploads/noti/" + name);

        //send response
        res.status(200).json({
          status: true,
          message: "File is uploaded",
          data: {
            name: name,
            mimetype: image.mimetype,
            size: image.size,
            file: `/uploads/noti/${name}`
          }
        });
      } else {
        console.log(image.mimetype);
        res.status(401).json({
          message:
            "This format is not allowed , please upload file with '.png','.gif','.jpg'!"
        });
      }
    }
  } catch (err) {
    res.status(500).json({ message: "Server Error!" });
    console.log(err);
  }
});

router.post("/notification", authorization, async (req, res) => {
  try {
    const { title, category, description, name} = req.body;

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
      name,
      message: "File is uploaded",
    });


  } catch (error) {
    console.log("error on POST notification", error);
    res.status(500).json({ message: "Server Error!" });
  }
});
router.get("/notification", authorization, async (req, res) => {
  try {
    // const noti = await pool.query("SELECT n.*,a.id,a.fullname from notification as n, useraccount as a WHERE a.id::text = n.acc_id");
    const noti = await pool.query("SELECT * FROM notification");

    res.status(200).send({
      notification: noti.rows
    });
  } catch (error) {
    console.log("error on get notification", error);
    res.status(500).json({ message: "Server Error!" });
  }
});

module.exports = router;
