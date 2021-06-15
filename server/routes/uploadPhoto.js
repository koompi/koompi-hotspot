const router = require("express").Router();
const fileUpload = require("express-fileupload");
const cors = require("cors");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const path = require("path");

// enable files upload
router.use(
  fileUpload({
    createParentPath: true
  })
);

// add other middleware
router.use(cors());
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));
router.use(morgan("dev"));

router.post("/upload-photo", async (req, res) => {
  try {
    if (!req.files) {
      console.log(req.files);
      res.send({
        status: false,
        message: "No file uploaded"
      });
    } else {
      //Use the name of the input field (i.e. "photo") to retrieve the uploaded file
      let photo = req.files.file;
      let name = "photo" + "_" + Date.now() + path.extname(photo.name);

      if (
        photo.mimetype == "image/jpeg" ||
        photo.mimetype == "image/png" ||
        photo.mimetype == "image/gif" ||
        photo.mimetype == "image/jpg"
      ) {
        //Use the mv() method to place the file in upload directory (i.e. "uploads")
        photo.mv("./uploads/" + name);
        
        //send response
        res.status(200).json({
          status: true,
          message: "File is uploaded",
          data: {
            name: name,
            mimetype: photo.mimetype,
            size: photo.size,
            file: `/uploads/${name}`
          }
        });
      } else {
        console.log(photo.mimetype);
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

module.exports = router;
