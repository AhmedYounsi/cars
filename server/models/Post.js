const mongoose = require("mongoose");
const PostShema = mongoose.Schema({
  img: String,
  owner: String,
  owner_id: String,
  likes: [],

  model: String,
  description: String,
  created_at: {
    type: Date,
    default: Date.now,
  },
});
module.exports = mongoose.model("Post", PostShema);
