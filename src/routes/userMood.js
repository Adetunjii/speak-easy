const { Router } = require("express");
const UserMood = require("../models/userMood");
const auth = require("../middleware/auth");
const { ErrorHandler } = require("../helpers/errors");

const router = Router();

router.get("/getUserMood", auth, async (req, res, next) => {
  try {
    const userMood = await UserMood.find();
    res.status(200).send({
      status: true,
      message: "successfully fetched user mood",
      data: userMood,
    });
  } catch (error) {
    next(error);
  }
});

router.post("/createUserMood", auth, async (req, res, next) => {
  try {
    const userMood = new UserMood(req.body);

    await userMood.save();

    res.status(201).send({
      status: true,
      message: "successfully created",
      data: userMood,
    });
  } catch (error) {
    next(error);
  }
});

router.delete("/deleteUserMood/:id", auth, async (req, res, next) => {
  try {
    const id = req.params.id.trim();

    if (!id) {
      throw new ErrorHandler(400, "User mood not found");
    }

    const userMood = await UserMood.findByIdAndRemove(id);

    if (!userMood) {
      throw new ErrorHandler(404, "User mood not found");
    }

    res.status(200).send({
      status: true,
      message: "successfully deleted..",
      data: userMood,
    });
  } catch (error) {
    next(error);
  }
});

router.patch("/updateUserMood/:id", auth, async (req, res, next) => {
  const updates = Object.keys(req.body);
  const id = req.params.id.trim();
  const allowedUpdates = ["mood", "shortNote"];
  const isValidOperation = updates.every((update) => {
    return allowedUpdates.includes(update);
  });

  try {
    if (!id) {
      throw new ErrorHandler(400, "Invalid usermood");
    }

    if (!isValidOperation) {
      throw new ErrorHandler(400, "Invalid update");
    }

    const userMood = await UserMood.findById(id);
    if (!userMood) {
      throw new ErrorHandler(404, "User Mood not found");
    }

    updates.forEach((update) => (userMood[update] = req.body[update]));

    await userMood.save();
    res.status(200).send({
      status: true,
      message: "Successfully updated...",
      data: userMood,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
