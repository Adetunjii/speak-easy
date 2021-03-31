const mongoose = require("mongoose");

const mediaModel = new mongoose.Schema({
  displayName: String,
  additionalInfo: String,
  fileType: {
    type: String,
    enum: ["video", "audio", "url", "image", "pdf", "itemURL"],
  },
  itemURL: String,
});

const Media = mongoose.model("Media", mediaModel);

module.exports = Media;
