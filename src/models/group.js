const mongoose = require("mongoose");
const validator = require("validator");

const groupSchema = new mongoose.Schema({
  groupName: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  followers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
});

const Group = mongoose.model("Group", groupSchema);
module.exports = Group;
