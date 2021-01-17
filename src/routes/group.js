const { Router } = require("express");
const Group = require("../models/group");
const router = Router();
const auth = require("../middleware/auth");
const { ErrorHandler } = require("../helpers/errors");
const { create } = require("../models/group");

router.post("/createGroup", auth, async (req, res, next) => {
  try {
    const group = new Group(req.body);
    await group.save();
    res.status(201).send({ status: "success", data: { group } });
    next();
  } catch (error) {
    error.statusCode = 400;
    next(error);
  }
});

router.get("/getGroup/:userId", auth, async (req, res) => {
  try {
    const userId = req.params.userId;
    const userGroups = Group.find({ $where: {} });
  } catch (error) {}
});

router.post("/joinGroup", auth, async (req, res, next) => {
  try {
    const groupId = req.body.groupId;
    const userId = req.body.userId;

    const group = await Group.findById(groupId);
    if (!group) {
      throw new ErrorHandler(404, "Group doesn't exist");
    }

    const groupMembers = group.members;
  } catch (error) {}
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
