const router = require("express").Router();
const pool = require("../db");
require("dotenv").config({ path: `../../.env` });
const authorization = require("../middleware/authorization");


router.post("/upvote-ads", authorization, async (req, res) => {
  try{
    const {id, vote} = req.body;
    var count = await pool.query("SELECT vote FROM notification WHERE _id = $1",[id]); 
    var i = count.rows[0].vote;

    const checkRewared = await pool.query("SELECT * FROM uservoted WHERE user_id = $1 AND ads_id = $2", [req.user, id]);

    const ads = await pool.query("SELECT * FROM notification WHERE _id = $1", [id]);


    if(vote == "Voted Up"){
      if(checkRewared.rows.length == 0){
        await pool.query(
          "INSERT INTO uservoted(user_id, voted, voted_type, ads_id, voted_name) VALUES($1, $2, $3, $4, $5)",
          [req.user, 1, 1, id, "Voted Up"]
        );
    
        await pool.query("UPDATE notification SET vote = $1 WHERE _id = $2", [i += 1, id]);
    
        res.status(200).send({
          notification: ads.rows
        });
      }
      else if(checkRewared.rows[0].voted_name == vote){
        res.status(422).send({
          message: "Already voted up"
        });
      }
      else{
        // res.status(200).send({
        //   message: 'No Reward'
        // });
        await pool.query(
          "UPDATE uservoted SET voted_type = $1, voted_name = $2 WHERE ads_id = $3",
          [1, "Voted Up", id]
        );
        await pool.query("UPDATE notification SET vote = $1 WHERE _id = $2", [i += 1, id]);

        res.status(200).send({
          notification: ads.rows
        });
      }
    }
  } 
  catch (error) {
    res.status(422).send({
      Error: error.message
    });
  }
})

router.put("/upvote-ads", authorization, async (req, res) => {
  try{
    const {id, vote} = req.body;
    var count = await pool.query("SELECT vote FROM notification WHERE _id = $1",[id]); 
    var i = count.rows[0].vote;

    const checkVoted = await pool.query("SELECT voted_type FROM uservoted WHERE user_id = $1 AND ads_id = $2", [req.user, id]);

    const ads = await pool.query("SELECT * FROM notification WHERE _id = $1", [id]);

    if(vote == "Voted Up"){
      try {
        if(checkVoted.rows[0].voted_type == "Voted Up"){
          res.status(422).send({
            error: "Cannot vote the same ID"
          });
        }
        else if(checkVoted.rows[0].voted_type == null){
          await pool.query(
            "UPDATE uservoted SET voted_type = $1 WHERE user_id = $2 AND ads_id = $3",
            ["Voted Up", req.user, id]
          );
      
          await pool.query("UPDATE notification SET vote = $1 WHERE _id = $2", [i += 1, id]);
      
          res.status(200).send({
            notification: ads.rows
          });
        }
        else{
          await pool.query(
            "UPDATE uservoted SET voted_type = $1 WHERE user_id = $2 AND ads_id = $3",
            ["Voted Down", req.user, id]
          );
      
          await pool.query("UPDATE notification SET vote = $1 WHERE _id = $2", [i += 2, id]);
      
          res.status(200).send({
            notification: ads.rows
          });
        }
      } catch (error) {
        res.status(422).send({
          Error: error.message
        });
      }
    }
  }
  
  catch (error) {
    res.status(422).send({
      Error: error.message
    });
  }
});


router.post("/downvote-ads", authorization, async (req, res) => {
  try{
    const {id, vote} = req.body;
    var count = await pool.query("SELECT vote FROM notification WHERE _id = $1",[id]); 
    var i = count.rows[0].vote;

    const checkRewared = await pool.query("SELECT * FROM uservoted WHERE user_id = $1 AND ads_id = $2", [req.user, id]);

    const ads = await pool.query("SELECT * FROM notification WHERE _id = $1", [id]);


    if(vote == "Voted Down"){
      if(checkRewared.rows.length == 0){
        await pool.query(
          "INSERT INTO uservoted(user_id, voted, voted_type, ads_id, voted_name) VALUES($1, $2, $3, $4, $5)",
          [req.user, 1, 0, id, "Voted Down"]
        );
    
        await pool.query("UPDATE notification SET vote = $1 WHERE _id = $2", [i -= 1, id]);
    
        res.status(200).send({
          notification: ads.rows
        });
      }
      else if(checkRewared.rows[0].voted_name == vote){
        res.status(422).send({
          message: "Already voted up"
        });
      }
      else{
        // res.status(200).send({
        //   message: 'No Reward'
        // });
        console.log("else condition")
        await pool.query(
          "UPDATE uservoted SET voted_type = $1, voted_name = $2 WHERE ads_id = $3",
          [0, "Voted Down", id]
        );
        await pool.query("UPDATE notification SET vote = $1 WHERE _id = $2", [i -= 1, id]);
        res.status(200).send({
          notification: ads.rows
        });
      }
    }
  } 
  catch (error) {
    res.status(422).send({
      Error: error.message
    });
  }
});

router.put("/downvote-ads", authorization, async (req, res) => {
  try{
    const {id, vote} = req.body;
    var count = await pool.query("SELECT vote FROM notification WHERE _id = $1",[id]); 
    var i = count.rows[0].vote;

    const checkVoted = await pool.query("SELECT voted_type FROM uservoted WHERE user_id = $1 AND ads_id = $2", [req.user, id]);

    const ads = await pool.query("SELECT * FROM notification WHERE _id = $1", [id]);

    if(vote == "Voted Down"){

      try {
        if(checkVoted.rows[0].voted_type == "Voted Down"){
          res.status(422).send({
            error: "Cannot vote the same ID"
          });
        }
        else if(checkVoted.rows[0].voted_type == null){
          await pool.query(
            "UPDATE uservoted SET voted_type = $1 WHERE user_id = $2 AND ads_id = $3",
            ["Voted Down", req.user, id]
          );
      
          await pool.query("UPDATE notification SET vote = $1 WHERE _id = $2", [i -= 1, id]);
      
          res.status(200).send({
            notification: ads.rows
          });
        }
        else{
          await pool.query(
            "UPDATE uservoted SET voted_type = $1 WHERE user_id = $2 AND ads_id = $3",
            ["Voted Down", req.user, id]
          );
      
          await pool.query("UPDATE notification SET vote = $1 WHERE _id = $2", [i -= 2, id]);
      
          res.status(200).send({
            notification: ads.rows
          });
        }
      } catch (error) {
        res.status(422).send({
          Error: error.message
        });
      }
    }
  } 
  catch (error) {
    res.status(422).send({
      Error: error.message
    });
  }
})

router.put("/unvote-ads", authorization, async (req, res) => {
  try{
    const {id, vote} = req.body;
    var count = await pool.query("SELECT vote FROM notification WHERE _id = $1",[id]); 
    var i = count.rows[0].vote;
    
    const checkVoted = await pool.query("SELECT voted_name FROM uservoted WHERE user_id = $1 AND ads_id = $2", [req.user, id]);

    const ads = await pool.query("SELECT * FROM notification WHERE _id = $1", [id]);

    if(vote == "Un Voted"){
      console.log(checkVoted.rows[0].voted)
      try {
        if(checkVoted.rows[0].voted_name == "Voted Up"){
          await pool.query(
            "UPDATE uservoted SET voted_name = $1 WHERE user_id = $2 AND ads_id = $3",
            ["Voted Up", req.user, id]
          );
      
          await pool.query("UPDATE notification SET vote = $1 WHERE _id = $2", [i -= 1, id]);

          res.status(200).send({
            notification: ads.rows
          });
        }
         
        else if(checkVoted.rows[0].voted_name == "Voted Down"){
          await pool.query(
            "UPDATE uservoted SET voted_name = $1 WHERE user_id = $2 AND ads_id = $3",
            ["Voted Down", req.user, id]
          );
      
          await pool.query("UPDATE notification SET vote = $1 WHERE _id = $2", [i += 1, id]);

          res.status(200).send({
            notification: ads.rows
          });
        }
        
        else if(checkVoted.rows[0].voted_type == null){

          res.status(200).send({
            message: 'Cannot un voted again!'
          });
        }

        else{
          res.status(404).send({
            message: 'Something went wrong!'
          });
        }

      } catch (error) {
        console.log(error);
        res.status(422).send({
          Error: error.message
        });
      }
    }
  } 
  catch (error) {
    res.status(422).send({
      Error: error.message
    });
  }
});

router.get("/get-voted/:id", authorization, async (req, res) => {
  try{

    var id = req.params.id;

    const checkVoted = await pool.query("SELECT * FROM uservoted WHERE user_id = $1 AND ads_id = $2", [req.user, id]);


    if(id == checkVoted.rows[0].ads_id){
      res.status(200).send({
        "user_id": checkVoted.rows[0].user_id,
        "voted": checkVoted.rows[0].voted,
        "voted_type": checkVoted.rows[0].voted_type,
        "ads_id": checkVoted.rows[0].ads_id,
        "voted_name": checkVoted.rows[0].voted_name
      });
    }

  } 
  catch (error) {
    res.status(422).send({
      Error: error.message
    });
  }
})


module.exports = router;