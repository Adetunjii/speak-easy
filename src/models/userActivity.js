const mongoose = require("mongoose");

const userActivitySchema = new mongoose.Schema({
  title: { type: String, required: true },
  shortDescription: [String],
  selectedItems: [{ type: mongoose.Schema.Types.ObjectId, ref: "Media" }],
});

const UserActivity = mongoose.model("UserActivity", userActivitySchema);

module.exports = UserActivity;
