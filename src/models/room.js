const mongoose = require("mongoose");
const validator = require("validator");

const roomSchema = new mongoose.Schema(
  {
    roomName: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
      trim: true,
      validate(value) {
        if (validator.isEmpty(value)) {
          throw new Error("Field cannot be empty");
        }
      },
    },
    users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
        unique: true,
      },
    ],
    isAvailable: { type: Boolean, default: true, required: true },
  },
  { timestamps: true }
);

const Room = mongoose.model("Room", roomSchema);

module.exports = Room;
