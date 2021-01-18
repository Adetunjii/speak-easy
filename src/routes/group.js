const { Router } = require("express");
const Group = require("../models/group");
const router = Router();
const auth = require("../middleware/auth");
const { ErrorHandler } = require("../helpers/errors");
const { create } = require("../models/group");
const User = require("../models/users");

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

router.post("/joinGroup", auth, async (req, res, next) => {
  try {
    const groupId = req.body.groupId;
    const userId = req.body.userId;

    const group = await Group.findById(groupId);
    if (!group) {
      throw new ErrorHandler(404, "Group doesn't exist");
    }

    const groupMembers = group.members;
    const isGroupMember = groupMembers.find((member) => member === userId);
    if (isGroupMember) {
      throw new ErrorHandler(400, "User is already a member");
    }
    group.members.push(userId);
    const joinedGroup = await group.save();

    //update user
    const user = await User.findById(userId);
    if (!user) {
      throw new ErrorHandler(404, "User doesn't exist");
    }
    const userGroups = user.groups;
    const isExist = userGroups.find((id) => id.toString() === groupId);
    if (isExist) {
      throw new ErrorHandler(400, "User already in group");
    }
    userGroups.push(groupId);
    await user.save();

    res.status(200).send({
      status: true,
      message: "successfully joined group",
      data: { joinedGroup },
    });
    next();
  } catch (error) {
    next(error);
  }
});

router.get("/getUserGroups/:userId", auth, async (req, res, next) => {
  try {
    const userId = req.params.userId.trim();
    if (!userId) {
      throw new ErrorHandler(400, "userId is required");
    }
    const user = await User.findById(userId);
    if (!user) {
      throw new ErrorHandler(404, "User doesn't exist");
    }
    await user.populate("groups");
    const userGroups = user.groups;
    res.status(200).send({
      status: true,
      message: "successfully fetched...",
      data: userGroups,
    });
    next();
  } catch (error) {
    next(error);
  }
});

router.get("/getAllGroups", auth, async (req, res, next) => {
  try {
    const groups = await Group.find({});
    console.log(groups);
    res.status(200).send(groups);
    next();
  } catch (error) {
    next(error);
  }
});

router.get("/getGroupById/:groupId", auth, async (req, res, next) => {
  try {
    const groupId = req.params.groupId;
    const group = await Group.findById(groupId);

    if (!group) {
      throw new ErrorHandler(404, "Group doesn't exist");
    }

    res
      .status(200)
      .send({ status: true, message: "successfully fetched..", data: group });
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
