const mongoose = require("mongoose");
const validator = require("validator");
const { ErrorHandler } = require("../helpers/errors");

const otpSchema = new mongoose.Schema(
  {
    userEmail: {
      type: String,
      required: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new ErrorHandler(400, "Invalid Email Address");
        }
      },
    },
    generatedOTP: [{ type: String }],
  },
  { timestamps: true }
);

const OTP = mongoose.model("OTP", otpSchema);

module.exports = OTP;
