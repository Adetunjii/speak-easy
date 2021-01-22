const User = require("../models/users");
const { Router } = require("express");
const auth = require("../middleware/auth");
const { ErrorHandler } = require("../helpers/errors");

const router = Router();

router.post("/login", async (req, res, next) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    if (!user) {
      throw new ErrorHandler(404, "User not found");
    }
    const token = await user.generateAuthToken();
    res.status(200).send({ user, token });
    next();
  } catch (error) {
    next(error);
  }
});

router.get("/:userId", auth, async (req, res, next) => {
  try {
    const userId = req.params.userId;
    if (!userId) {
      throw new ErrorHandler(400, "Invalid user id");
    }
    const user = await User.findById(userId);
    res.status(200).send({
      status: true,
      message: "fetched successfully...",
      data: user,
    });
    next();
  } catch (error) {
    next(error);
  }
});

router.post("/signup", async (req, res, next) => {
  try {
    const user = new User(req.body);
    await user.save();
    const token = await user.generateAuthToken();
    res.status(201).send({ user, token });
    next();
  } catch (error) {
    error.statusCode = 400;
    next(error);
  }
});

router.get("/getAllUsers", async (req, res, next) => {
  try {
    const users = await User.find({});
    res.status(200).send(users);
    next();
  } catch (error) {
    next(error);
  }
});

router.patch("/update", auth, async (req, res, next) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = [
    "fullName",
    "username",
    "email",
    "phoneNo",
    "password",
    "imageURL",
    "userType",
    "availableTime",
  ];
  const isValidOperation = updates.every((update) => {
    return allowedUpdates.includes(update);
  });

  try {
    if (!isValidOperation) {
      throw new ErrorHandler(400, "invalid update");
    }

    const user = req.user;
    updates.forEach((update) => (user[update] = req.body[update]));

    if (!user) {
      throw new ErrorHandler(404, "user doesn't exist");
    }
    await user.save();
    res.send(user);
    next();
  } catch (error) {
    error.statusCode = 400;
    next(error);
  }
});

router.delete("/delete", auth, async (req, res) => {
  try {
    await req.user.remove();
    res.status(200).send("Removed successfully");
    next();
  } catch (error) {
    error.statusCode = 400;
    next(error);
  }
});

module.exports = router;
