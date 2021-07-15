const express = require("express");
const router = express.Router();
const authMiddleware = require("../helpers/authMiddleware");
const Post = require("../models/Post");
const User = require("../models/User");

// INIT cloudinary
const cloudinary = require("cloudinary").v2;
// cloudinary set
cloudinary.config({
  cloud_name: "dg3ftjfp0",
  api_key: "274791757228526",
  api_secret: "tKJX9317FINQtZ0I56U4qfs11Po",
});

// Add new post
router.post("/new_post", authMiddleware, async (req, res) => {
 
  try {
    const result = await cloudinary.uploader.upload(req.body.ImageURI);
    const newPost = new Post({
      model: req.body.model,
      description: req.body.description,
      img: result.secure_url,
      owner: req.body.user,
      owner_id: req.body.user_id,

    });
    await newPost.save();
    const all_items = await Post.find().sort({ _id: -1 });
    res.status(200).send(all_items);
  } catch (err) {
    return res.status(422).send(err.message);
  }
});

//Get All posts
router.get("/get_posts", (req, res) => {

  Post.find()
    .sort({ _id: -1 })
    .then((post) => res.send(post))
    .catch((err) => {
      console.error(err.message);
      res.status(500).send({ msg: "Server Error" });
    });
});
//Get user postes
router.get("/myPosts", authMiddleware, (req, res) => {
  User.find({ owner: req.userId })
    .then((post) => res.send(posts))
    .catch((err) => {
      console.error(err.message);
      res.status(500).send({ msg: "Server Error" });
    });
});

router.post("/single_post", async (req, res) => {

    const post = await Post.findById(req.body.id);
 
    res.status(200).send(post);
  
 
});

module.exports = router;
