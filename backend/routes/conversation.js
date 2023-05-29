const router = require("express").Router();
let Conversation = require("../models/Conversation");
const { check, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();

//new conv

router.post("/", async (req, res) => {
    const newConversation = new Conversation({
        members: [req.body.senderId, req.body.receiverId],
    });

    // console.log(newConversation)

    try {
        const savedConversation = await newConversation.save();
        res.status(200).json(savedConversation);
    } catch (err) {
        res.status(500).json(err);
    }
});

//get conv of a user

router.post("/getconv", async (req, res) => {

    // console.log(req.body.userid);
    try {
        const conversation = await Conversation.find({
            members: { $in: [req.body.userid] },
        });
        res.status(200).json(conversation);
    } catch (err) {
        res.status(500).json(err);
    }
});


// get the conversation based on id

router.post("/togetrec", (req, res) => {
    // console.log("reached the getuserdata function here");
    // console.log("body is here in mongodb ", req.body.cnid);

    Conversation.find({ _id: req.body.cnid }, function (err, docs) {
        if (err) {
            console.log(err);
            res.status(400);
        }
        else {
            // console.log("First function call : ", docs);
            // console.log(typeof(docs));
            res.status(200).json(docs);
        }
    });
}
);


module.exports = router;
