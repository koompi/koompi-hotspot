const router = require("express").Router();
const pool = require("../../db");
const moment = require("moment");

const authorization = require("../../middleware/authorization");

router.post("/notification", authorization, async (req, res) => {
  try {
    const {image, title, category, description } = req.body;    
    var now = moment();

    await pool.query(
      "INSERT INTO notification (title,category,description,image,date,acc_id) VALUES($1,$2,$3,$4,$5,$6)",
      [title, category, description, image, now, req.user]
    ) 
    res.status(200).json({
      status: true,
      message: "Post notification successfully",
    });
  } catch (error) {
    console.log("error on POST notification", error);
    res.status(500).json({ message: "Server Error!" });
  }
});
router.get("/notification", authorization, async (req, res) => {
  try {
    const noti = await pool.query("SELECT n.*,a.id,a.fullname from notification as n, useraccount as a WHERE a.id::text = n.acc_id");
    // const noti = await pool.query("SELECT * from notification");
    
    res.status(200).send([{
      id: noti.rows[0]._id,
      title: noti.rows[0].title,
      category: noti.rows[0].category,
      description: noti.rows[0].description,
      date: noti.rows[0].date,
      image: noti.rows[0].image,
      fullname: noti.rows[0].fullname
    }]);
  } catch (error) {
    console.log("error on get notification", error);
    res.status(500).json({ message: "Server Error!" });
  }
});
router.delete("/notification/:id", authorization, async (req, res) => {
  try {
    await pool.query("DELETE from notification WHERE _id=$1",[req.params.id]);
    res.status(200).send({
      message:"Deleted"
    });
  } catch (error) {
    console.log("error on delete notification", error);
    res.status(500).json({ message: "Server Error!" });
  }
});

module.exports = router;
