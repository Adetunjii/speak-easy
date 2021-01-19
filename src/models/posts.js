const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    text: { type: String, required: true },
    imageURL: String,
    likes: { type: Number, default: 0 },
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "PostComment" }],
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    groupId: { type: mongoose.Schema.Types.ObjectId, ref: "Group" },
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
