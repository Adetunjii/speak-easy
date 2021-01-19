const mongoose = require("mongoose");
const validator = require("validator");

const groupSchema = new mongoose.Schema({
  groupName: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  imageURL: String,
  groupType: { type: String, enum: ["private", "public"], required: true },
  members: [
    {
      userDetails: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
      },
      memberType: {
        type: String,
        required: true,
        enum: ["admin", "moderators", "users"],
      },
    },
  ],
  posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
});

const Group = mongoose.model("Group", groupSchema);
module.exports = Group;
