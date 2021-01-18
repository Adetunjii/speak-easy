const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    content: String,
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    groupId: { type: mongoose.Schema.Types.ObjectId, ref: "Group" },
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
