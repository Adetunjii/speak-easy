const { Router } = require("express");
const Group = require("../models/group");
const router = Router();
const auth = require("../middleware/auth");
const { ErrorHandler } = require("../helpers/errors");

router.post("/createGroup", auth, async (req, res, next) => {
  try {
    const group = new Group(req.body);
    await group.save();
    res.status(201).send(group);
    next();
  } catch (error) {
    error.statusCode = 400;
    next(error);
  }
});

router.get("/getAllGroups", auth, async (req, res, next) => {
  try {
    const groups = await Group.find({}).populate("users");
    res.status(200).send(groups);
    next();
  } catch (error) {
    next(error);
  }
});

router.delete("/deleteGroup/:id", auth, async (req, res) => {
  try {
    const groupId = req.params.id;
    const group = await Group.findByIdAndDelete(groupId);

    if (!group) {
      throw new ErrorHandler(404, "Group doesn't exist");
    }

    res.status(200).send(group);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
