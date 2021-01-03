const User = require("../models/users");
const { Router } = require("express");
const auth = require("../middleware/auth");

const router = Router();

router.post("users/login", async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    if (!user) {
      res.status(404).send();
    }
    const token = await user.generateAuthToken();
    res.status(200).send({ user, token });
  } catch (error) {
    res.status(400).send("user doesn't exist");
  }
});

router.post("users/signup", async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    const token = await user.generateAuthToken();
    res.status(201).send({ user, token });
  } catch (error) {
    res.status(400).send(error);
  }
});

router.patch("users/update", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = [
    "firstName",
    "lastName",
    "username",
    "email",
    "phoneNo",
    "password",
  ];
  const isValidOperation = updates.every((update) => {
    return allowedUpdates.includes(update);
  });

  if (!isValidOperation) {
    return res.status(400).send({ error: "invalid updates" });
  }

  try {
    const user = req.user;
    updates.forEach((update) => (user[update] = req.body[update]));

    await user.save();

    if (!user) {
      res.status(404).send();
    }
    res.send(user);
  } catch (error) {
    res.send(500).send();
  }
});

router.delete("users/delete", auth, async (req, res) => {
  try {
    await req.user.remove();
    res.send("Removed successfully");
  } catch (error) {
    res.status(400).send("User doesn't exist");
  }
});

module.exports = router;
