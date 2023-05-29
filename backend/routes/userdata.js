const router = require("express").Router();
let USERDATA = require("../models/userschema");
const { check, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();


router.route("/").get((req, res) => {
  USERDATA.find(function (err, data) {
    if (err) {
      console.log(err);
    } else {
      res.json(data);
      console.log("in the route", data);
    }
  });
});

// TO ADD THE USER DETAILS
// *********************************************************************************
router.post("/registeradd", (req, res) => {
  // console.log("reached the registeradd function here");
  // console.log("body is ", req.body);

  var temparr = []
  temparr.push("user1")
  temparr.push("user2")
  temparr.push("user3")
  temparr.push("user4")

  let userdata = new USERDATA({
    Name: req.body.name,
    Phoneno: req.body.phoneno,
    Email: req.body.email,
    Pincode: req.body.pincode,
    Location: req.body.location,
    State: req.body.state,
    Country: req.body.country,
    Profession: req.body.profession,
    Category: req.body.category,
    Password: bcrypt.hashSync(req.body.password, 10),
    Friendslist: temparr
  });

  // console.log(" here is ", userdata);


  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  // CHECK IF THE USER ALREADY EXIST
  USERDATA.findOne({ Phoneno: req.body.phoneno }, (err, user) => {
    if (err) {
      return res.json(err);
    }

    // console.log("user is : --> ", user);

    if (user) {
      return res.json({ data: "Existsph" });
    }
    else {
      //******************************************** */
      // CHECK IF THE USER ALREADY EXIST
      USERDATA.findOne({ Email: req.body.email }, (err, user) => {
        if (err) {
          return res.json(err);
        }

        // console.log("user is : --> ", user);

        if (user) {
          return res.json({ data: "Exists" });
        }
        else {
          //******************************************** */
          userdata
            .save()
            .then(data => {
              res.status(200).json({ User: "User added successfully" });
            })
            .catch(err => {
              console.log("yep", err);
              res.status(400).send(err);
            });
          //******************************************** */

        }
      });
      //******************************************** */

    }
  });

}
);
// *********************************************************************************


// TO CHECK THE LOGIN DETAILS
// *********************************************************************************
router.post("/logincheck", (req, res) => {

  // console.log("the data we got is", req.body);

  let email = req.body.email;
  let password = req.body.password;


  // console.log(email, password);

  USERDATA.findOne({ Email: email }, (err, user) => {
    if (err) {
      return res.json(err);
    }

    // console.log("user is : --> ", user);

    if (!user) {
      return res.json({ data: "Invalid Credentials" });
    }

    // console.log(password, user.Password);

    if (
      user &&
      bcrypt.compareSync(password, user.Password)
    ) {
      console.log("You have entered correct credentials!");

      // console.log(user)
      const payload = {
        Name: user.Name,
        Phoneno: user.Phoneno,
        Email: user.Email,
        Pincode: user.Pincode,
        Location: user.Location,
        State: user.State,
        Country: user.Country,
        Profession: user.Profession,
        Category: user.Category,
        Password: user.Password,
        Friendslist: user.Friendslist,
        _id: user._id
      };

      token = jwt.sign(payload, process.env.SECRET_OR_KEY);
      res.send(token); 

    } else {
      console.log("You have entered WRONG credentials!");
      res.json({ data: "Invalid Credentials" });
    }
  });
});
// *********************************************************************************


// TO PROVIDE THE USER DETAILS TO DISPLAY IN THE Chat PAGE
// *********************************************************************************
router.post( "/getuserdata",(req, res) => {
  // console.log("reached the getuserdata function here");
  // console.log("body is here in mongodb " , req.body);
  
  USERDATA.find({ _id: req.body.id}, function (err, docs) {
    if (err){
        console.log(err);
        res.status(400);
    }
    else{
        // console.log("First function call : ", docs);
        // console.log(typeof(docs));
        res.status(200).json(docs);
    }
  });   
}
);
// *********************************************************************************

module.exports = router;
