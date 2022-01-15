const { User, validateLogin, validateUser } = require("../models/user");

const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

const bcrypt = require("bcrypt");
const express = require("express");
const router = express.Router();
const config = require('../config/default.json');
const axios = require('axios')
const qs = require('qs')
const token = require('../middleware/token')

// const {Reply, Post, validatePost} = require("../models/posts")

//* POST register a new user


router.get("/track/:trackName", [token], async (req, res) => {

  try {
    const axiosConfig = {
      headers: {
        'Authorization': 'Bearer ' + req.token
      }
    }
 

    const spotifyRes = await axios.get(`https://api.spotify.com/v1/search?q=${req.params.trackName}&type=track&include_external=audio&limit=20`, axiosConfig)

    res.json(spotifyRes.data);
  } catch (err) {
    // console.log(err);
    res.status(500).send(err);
  }




});




module.exports = router;
