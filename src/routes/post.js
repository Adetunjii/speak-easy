const { Router } = require("express");
const { ErrorHandler } = require("../helpers/errors");
const auth = require("../middleware/auth");
const Group = require("../models/group");
const Post = require("../models/posts");

const router = Router();

router.post("/createPost", auth, async (req, res, next) => {
  try {
    const post = new Post(req.body);

    const group = await Group.findById(req.body.groupId);

    if (!group) {
      throw new ErrorHandler(404, "Group doesn't exist");
    }

    console.log(post);
    group.posts.push(post._id);
    await post.save();
    await group.save();

    res.status(201).send({
      status: true,
      message: "successfully created",
      post,
    });
    next();
  } catch (error) {
    error.statusCode = 400;
    next(error);
  }
});

router.get("/getPost/:groupId/:userId", auth, async (req, res, next) => {
  try {
    const groupId = req.params.groupId.trim();
    const userId = req.params.userId.trim();

    if (!groupId || !userId) {
      throw new ErrorHandler(400, "Invalid groupId | userId");
    }

    const posts = await Post.find({ userId, groupId });

    res.status(200).send({
      status: true,
      message: "Fetched successfully...",
      data: posts,
    });
    next();
  } catch (error) {
    next(error);
  }
});

router.get("/getPosts/:groupId", auth, async (req, res, next) => {
  try {
    const groupId = req.params.groupId.trim();
    if (!groupId) {
      throw new ErrorHandler(400, "Invalid group id");
    }

    const posts = await Group.findById(groupId)
      .select("posts")
      .populate("posts");
    res.status(200).send({
      status: true,
      message: "fetched successfully...",
      data: posts,
    });
    next();
  } catch (error) {
    next(error);
  }
});

router.patch("/update/:postId", auth, async (req, res, next) => {
  const updates = Object.keys(req.body);
  const postId = req.params.postId;
  const allowedUpdates = [
    "text",
    "imageURL",
  ];
  const isValidOperation = updates.every((update) => {
    return allowedUpdates.includes(update);
  });

  try {
    if (!isValidOperation) {
      throw new ErrorHandler(400, "invalid update");
    }

    const post = await Room.findById(postId);

    if(!post) {
      throw new ErrorHandler(404, "Post not found");
    }

    updates.forEach((update) => (post[update] = req.body[update]));

  
    await post.save();
    res.status(200).send({
      status: true,
      message: "successfully updated",
      data: post
    })
    next();
  } catch (error) {
    error.statusCode = 400;
    next(error);
  }
});

router.delete("/deletePost/:groupId/:userId", auth, async (req, res, next) => {
  try {
    const groupId = req.params.groupId;
    const userId = req.params.userId;

    const post = await Post.findOneAndRemove(
      {
        userId: userId,
        groupId: groupId,
      },
      { useFindAndModify: true }
    );

    res.status(200).send({
      status: true,
      message: "successfully deleted..",
      data: post,
    });
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = router;
