const { Router } = require("express");
const Booking = require("../models/booking");
const auth = require("../middleware/auth");
const User = require("../models/users");

const router = Router();

router.post("/createBooking", auth, async (req, res) => {
  try {
    const user = await Booking.findUserById(req.body.userID);
    if (!user) {
      return res.send(404).send("user not found");
    }
    const booking = new Booking(req.body);
    await booking.save();
    res.status(201).send("Booking created successfully");
  } catch (error) {
    const errorMessages = [];
    for (field in error.errors) errorMessages.push(error.errors[field].message);
    res.status(400).send(errorMessages);
  }
});

router.get("/getAllBookings", auth, async (req, res) => {
  try {
    const bookings = await Booking.find({});

    res.status(201).send(bookings);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get("/getBooking/user/:id", auth, async (req, res) => {
  try {
    const userId = req.params.id;
    const user = User.findById(userId);

    if (!user) {
      return res.status(404).send("Couldn't find user");
    }

    const bookings = await Booking.find({ userID: userId });
    res.status(200).send(bookings);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get("/getBooking/doctor/:id", auth, async (req, res) => {
  try {
    const doctorId = req.params.id;
    const doctor = User.findById(doctorId);

    if (!doctor) {
      return res.status(404).send("Couldn't find doctor");
    }

    const bookings = await Booking.find({ doctorID: doctorId });
    res.status(200).send(bookings);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
