const router = require("express").Router();
let Message = require("../models/Message");
const { check, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();
const ImageKit = require('imagekit');


const imagekit = new ImageKit({
    urlEndpoint: 'https://ik.imagekit.io/tb5em07q5',
    publicKey: 'public_n1qVVkAdBe09dzJ2xXnLSzx6wxY=',
    privateKey: 'private_T3IsMlHI+tuCLurhZnIlt2Wopu4='
});

//new mess

router.post("/", async (req, res) => {
    // console.log("in here to add new messages", req.body);
    const newMessage = new Message(req.body);
    console.log(newMessage);
    try {
        const savedMessage = await newMessage.save();
        res.status(200).json(savedMessage);
    } catch (err) {
        res.status(500).json(err);
    }
});

//get mess of a user

router.post("/getmess", async (req, res) => {

    // console.log("in getmess -> ", req.body.convid);
    try {
        const messages = await Message.find({
            conversationId: req.body.convid,
        });
        res.status(200).json(messages);
    } catch (err) {
        res.status(500).json(err);
    }
});


//get mess of a user

router.post("/imagemess", async (req, res) => {
    // console.log("in cima gemess")
    var result = imagekit.getAuthenticationParameters();
    console.log( "i am here-> ",result);
    res.send(result);
    

});


module.exports = router;
