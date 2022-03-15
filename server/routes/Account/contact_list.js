const pool = require("../../db");
const router = require("express").Router();
const authorization = require("../../middleware/authorization");

router.post("/contactlist", authorization, async (req, res) => {

    try{

        const { contact_name, contact_wallet  } = req.body;

        console.log(req.body);
        console.log(req.user);

        await pool.query(
            "insert into contacts (contact_id, contact_name, contact_wallet) values ($1, $2, $3)",
            [req.user, contact_name, contact_wallet]
        )

        res.status(200).json({
            contact_id: req.user,
            contact_name: contact_name,
            contact_wallet: contact_wallet
        });

    }
    catch (err) {
        res.status(500).json({ message: err });
    }

})

module.exports = router;