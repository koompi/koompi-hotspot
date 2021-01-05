const router = require("express").Router();
const pool = require("../../db");
const fileUpload = require("express-fileupload");
const cors = require("cors");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const path = require("path");
const authorization = require("../../middleware/authorization");
const express = require("express");

// enable files upload
router.use(
  fileUpload({
    createParentPath: true,
  })
);

// add other middleware
router.use(cors());
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));
router.use(morgan("dev"));

router.post("/upload-avatar", authorization, async (req, res) => {
  try {
    if (!req.files) {
      res.send({
        status: false,
        message: "No file uploaded",
      });
    } else {
      //Use the name of the input field (i.e. "avatar") to retrieve the uploaded file
      let avatar = req.files.file;
      // res.send(avatar.file.name);
      let name = "avatar" + "_" + Date.now() + path.extname(avatar.name);

      if (
        avatar.mimetype == "image/jpeg" ||
        avatar.mimetype == "image/png" ||
        avatar.mimetype == "image/gif" ||
        avatar.mimetype == "image/jpg"
      ) {
        //Use the mv() method to place the file in upload directory (i.e. "uploads")
        avatar.mv("./uploads/" + name);
        await pool.query("update users_email set image=$1 where id = $2", [
          name,
          req.user,
        ]);

        //send response
        res.send({
          status: true,
          message: "File is uploaded",
          data: {
            name: name,
            mimetype: avatar.mimetype,
            size: avatar.size,
            file: `/uploads/${name}`,
          },
        });
      } else {
        console.log(avatar.mimetype);
        res
          .status(500)
          .send(
            "This format is not allowed , please upload file with '.png','.gif','.jpg'!"
          );
      }
    }
  } catch (err) {
    res.status(500).send("Server Error!");
    console.log(err);
  }
});
module.exports = router;
