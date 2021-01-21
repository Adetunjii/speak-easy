const mongoose = require("mongoose");

const postCommentSchema = new mongoose.Schema(
  {
    text: { type: String, required: true },
    postId: { type: mongoose.Schema.Types.ObjectId, ref: "Post" },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

const PostComment = mongoose.model("PostComment", postCommentSchema);

module.exports = PostComment;
