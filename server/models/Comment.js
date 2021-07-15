const mongoose = require("mongoose");
const CommentShema = mongoose.Schema({
  post_id: String,
  comment: [],
});
module.exports = mongoose.model("Comment", CommentShema);
