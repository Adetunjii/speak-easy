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
    res.status(400).send(error);
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

router.patch("/updateBooking/:bookingId", auth, async (req, res, next) => {
  const updates = Object.keys(req.body);
  const bookingId = req.params.bookingId;
  const allowedUpdates = [
    "userID",
    "doctorID",
    "amount",
    "status",
    "date",
    "paymentReference",
    "paymentStatus"
  ];
  const isValidOperation = updates.every((update) => {
    return allowedUpdates.includes(update);
  });

  try {
    if (!isValidOperation) {
      throw new ErrorHandler(400, "invalid update");
    }

    const booking = await Booking.findById(bookingId);

    if(!booking) {
      throw new ErrorHandler(404, "Booking not found");
    }

    updates.forEach((update) => (booking[update] = req.body[update]));

  
    await booking.save();
    res.status(200).send({
      status: true,
      message: "successfully updated",
      data: booking
    })
    next();
  } catch (error) {
    error.statusCode = 400;
    next(error);
  }
});


router.delete("/deleteBooking/:bookingId", auth, async (req, res, next) => {
  const bookingId = req.params.bookingId;
  try {
    const booking = Room.findOneAndDelete({ _id: bookingId });
    if (!booking) {
      throw new ErrorHandler(404, "Booking doesn't exist");
    }

    res.status(200).send({
      status: true,
      message: 'Successfully deleted',
      data: booking
    });
    next();
  } catch (error) {
    error.statusCode = 404;
    next(error);
  }
});


module.exports = router;
