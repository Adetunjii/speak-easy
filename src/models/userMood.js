const mongoose = require("mongoose");

const userMoodSchema = new mongoose.Schema(
  {
    mood: { type: String, required: true },
    shortNote: { type: String, required: true },
  },

  { timestamps: true }
);

const UserMood = mongoose.model("UserMood", userMoodSchema);

module.exports = UserMood;
