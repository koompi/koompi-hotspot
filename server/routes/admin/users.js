const router = require("express").Router();
const pool = require("../../db");
const authorization = require("../../middleware/authorization");
require("dotenv").config();

router.get("/users-register", authorization, async (req, res) => {
    try {
      const registers = await pool.query(
        "SELECT id, fullname, phone, gender, birthdate, address, role, activate, image, ban FROM useraccount"
      );  
      res.status(200).json({
        users_resgistered: registers.rows        
      });
    } catch (error) {
      console.log("error on users ", error);
      res.status(500).json({ message: "Server Error!" });
    }
  });

  router.put("/users-register/:id", authorization, async (req, res) => {
    try {
      if(req.params.id === req.user){
        return res.status(400).send({message: "Cannot ban yourself!"})
      }

      if(req.params.id === process.env.ADMINER_ID){
        return res.status(400).send({message: "Cannot ban root admin!"})
      }
      const ban = await pool.query(
        "SELECT ban FROM useraccount WHERE id = $1",[req.params.id]
        );      
        console.log(ban.rows[0].ban);
      
      if(ban.rows[0].ban === false){
        await pool.query(
          "UPDATE useraccount SET ban = true WHERE id = $1",[req.params.id]
        ); 
        res.status(200).json({
          message:  "Disable successfully."        
        });
      }

      if(ban.rows[0].ban === true){
        await pool.query(
          "UPDATE useraccount SET ban = false WHERE id = $1",[req.params.id]
        ); 
        res.status(200).json({
          message:  "Enable successfully."        
        });
      }
      
    } catch (error) {
      console.log("error on users ", error);
      res.status(500).json({ message: "Server Error!" });
    }
  });

  router.get("/users-admin", authorization, async (req, res) => {
    try {
      const admins = await pool.query(
        "SELECT id, fullname, phone, gender, birthdate, address, role, activate, image FROM useraccount WHERE role = 'Admin'"
      );

       res.status(200).json({
        user_admins: admins.rows
      });
    } catch (error) {
      console.log("error on users admin", error);
      res.status(500).json({ message: "Server Error!" });
    }
  });

  router.get("/users-active", authorization, async (req, res) => {
    try {
      // const users_active_login = await pool.query(
      //   "SELECT * FROM  radacct WHERE  calledstationid ='sanng-school' AND acctterminatecause is NULL"
      // );  
      const users = await pool.query(
        "SELECT detail.id,detail.fullname, detail.phone, r.*, c.acc_id,c.calledstationid,c.acctterminatecause FROM  useraccount AS detail, radgroupcheck as r, radacct AS c WHERE detail.id::text=c.acc_id AND r.acc_id=c.acc_id AND  c.calledstationid ='sanng-school' AND c.acctterminatecause IS NULL"
      );
      let str = users.rows[0].groupname;
      let plan = str.slice(str.lastIndexOf("Ex_") + 3, str.lastIndexOf("_"));
      res.status(200).json({
        users_login: {
          fullname: users.rows[0].fullname,
          phone: users.rows[0].phone,
          plan,
          expire: users.rows[0].value,
          simultaneous: users.rows[1].value,
          speed_up: '5',
          speed_down: '5',
          device: '1',
          status: 'Active'
        }
      });
    } catch (error) {
      console.log("error on users active", error);
      res.status(500).json({ message: "Server Error!" });
    }
  });

module.exports = router;