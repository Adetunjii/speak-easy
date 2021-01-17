const mongoose = require("mongoose");
const validator = require("validator");

const groupSchema = new mongoose.Schema({
  groupName: { type: String, required: true, trim: true, unique: true },
  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      unique: true,
      ref: "User",
    },
  ],
  followers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      unique: true,
      ref: "User",
    },
  ],
});

const Group = mongoose.model("Group", groupSchema);

module.exports = Group;
