const router = require("express").Router();
const pool = require("../../db");
const authorization = require("../../middleware/authorization");

router.get("/", authorization, async (req, res) => {
  try {
    // req.user has the payload
    // res.json(req.user); user

    const user = await pool.query(
      "SELECT * FROM useraccount WHERE id = $1 AND activate = true",
      [req.user]
    );
    if (user.rows.length === 0) {
      return res
        .status(401)
        .json({ message: "Please active your acount first!" });
    }
    else{
      return res.status(200).send(user.rows[0]);
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server Error" });
  }
});

router.get("/notification", authorization, async (req, res) => {
  try {
    const noti = await pool.query("SELECT * FROM notification ORDER BY _id DESC");

    if (noti.rows.length === 0) {
      return res
        .status(401)
        .json({ message: "No results found!" });
    }
    else{
      return res.status(200).send(noti.rows);
    }
  
    
  } catch (error) {
    console.log("error on get notification", error);
    res.status(500).json({ message: "Server Error!" });
  }
});

module.exports = router;
