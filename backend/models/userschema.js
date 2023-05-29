  const mongoose = require("mongoose");

let userdata = new mongoose.Schema(
  {
    Name: {
      type: String,
      required: true,
    },

    Phoneno: {
      type: String,
      required: true,
    },

    Email: {
      type: String,
      required: true,
    },
    
    Pincode: {
      type: String,
      required: true,
    },
    
    Location: {
      type: String,
      // required: true,
    },
    
    State: {
      type: String,
      required: true,
    },
    
    Country: {
      type: String,
      required: true,
    },

    Profession: {
      type: String,
      // required: true,
    },

    Category: {
      type: String,
      // required: true,
    },

    Password: {
      type: String,
      required: true,
    },

    Friendslist: {
      type: Array,
      required: true,
    },
  }
);

module.exports = mongoose.model("USERDATA", userdata);
