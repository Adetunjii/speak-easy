const mongoose = require("mongoose");
const User = require("./users");

const bookingSchema = new mongoose.Schema({
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    validate(value) {
      const isValid = mongoose.Types.ObjectId.isValid(value);
      if (!isValid) {
        throw new Error("Invalid Id");
      }
    },
  },
  doctorID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    validate(value) {
      const isValid = mongoose.Types.ObjectId.isValid(value);
      if (!isValid) {
        throw new Error("Invalid Id");
      }
    },
  },
  amount: { type: Number, required: true },
  status: {
    type: String,
    enum: ["pending", "booked", "completed"],
    required: true,
  },
  date: { type: Date, default: new Date().toJSON() },
  paymentReference: { type: String, required: true },
  paymentStatus: {
    type: String,
    enum: ["pending", "paid", "refunded", "cancelled"],
    required: true,
  },
});

bookingSchema.statics.findUserById = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error("User doesn't exist");
  }

  return user;
};

bookingSchema.pre("find", function (next) {
  this.populate("userID").populate("doctorID");
  next();
});

const Booking = mongoose.model("Booking", bookingSchema);

module.exports = Booking;
