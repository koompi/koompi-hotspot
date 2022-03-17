const pool = require("../../db");
const router = require("express").Router();
const authorization = require("../../middleware/authorization");

router.post("/contactlist", authorization, async (req, res) => {

    try{

        const { contact_name, contact_wallet  } = req.body;

        console.log(req.body);
        console.log(req.user);

        await pool.query(
            "insert into contacts (user_id, contact_name, contact_wallet) values ($1, $2, $3)",
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

router.get("/contactlist", authorization, async (req, res) => {

    try{

        getContactList = await pool.query(
            "select * from contacts where user_id = $1",
            [req.user]
        )

        // sort by name
        // const itemSort = items.sort(function(a, b) {

        //     var a = getContactList.rows[0].contact_name;
        //     var b = getContactList.rows[0].contact_name;

        //     const nameA = a.toUpperCase(); // ignore upper and lowercase
        //     const nameB = b.toUpperCase(); // ignore upper and lowercase
        //     if (nameA < nameB) {
        //     return -1;
        //     }
        //     if (nameA > nameB) {
        //     return 1;
        //     }
        
        //     // names must be equal
        //     return 0;
        // });

        var sortName = getContactList.rows.sort(function(a, b) {
            var textA = a.contact_name.toUpperCase();
            var textB = b.contact_name.toUpperCase();
            return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
        });


        return res.status(200).json(
            JSON.parse(
                JSON.stringify(sortName)
            )
        );

    }
    catch (err) {
        res.status(500).json({ message: err });
    }

})

router.put("/contactlist", authorization, async (req, res) => {

    try{

        const { id, contact_name, contact_wallet  } = req.body;

        const checkid = await pool.query(
            "select id from contacts where id = $1", 
            [id]
        );

        if(checkid.rows.length === 0){
            return res.status(401).json({ message: "Contact wallet is not exist!" });
        }
        else{
            const id = checkid.rows[0].id;

            await pool.query(
                "update contacts set contact_name = $1, contact_wallet = $2 where id = $3",
                [contact_name, contact_wallet, id]
            )

            return res.status(200).json({
                contact_id: id,
                contact_name: contact_name,
                contact_wallet: contact_wallet
            });
        }


    }
    catch (err) {
        res.status(500).json({ message: err });
    }

})

router.delete("/contactlist", authorization, async (req, res) => {

    try{

        const { id } = req.body;

        const checkid = await pool.query(
            "select id from contacts where id = $1", 
            [id]
        );

        if(checkid.rows.length === 0){
            return res.status(401).json({ message: "Contact wallet is not exist!" });
        }
        else{
            const id = checkid.rows[0].id;

            await pool.query(
                "delete from contacts  where id = $1",
                [id]
            )

            return res.status(200).json({
                success: true,
            });
        }

    }
    catch (err) {
        res.status(500).json({ message: err });
    }

})

module.exports = router;