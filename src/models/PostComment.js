const mongoose = require("mongoose");

const postCommentSchema = new mongoose.Schema(
  {
    text: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

const PostSchema = mongoose.model("PostSchema", postCommentSchema);

module.exports = PostSchema;
