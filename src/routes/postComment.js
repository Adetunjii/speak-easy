const { Router } = require("express");
const auth = require("../middleware/auth");
const User = require("../models/users");
const Post = require("../models/posts");
const PostComment = require("../models/PostComment");
const router = Router();

router.post("/:postId", auth, async (req, res, next) => {
  try {
    const postId = req.params.postId;
    const userId = req.body.userId;

    //check if the post id and user id is valid
    if (!postId || !userId) {
      throw new Error(404, "Invalid request body");
    }

    //create a new comment
    const comment = new PostComment(req.body);

    //check if the user exists
    const user = await User.findById(userId);
    if (!user) {
      throw new ErrorHandler(404, "User doesn't exist");
    }

    //find particular post by id
    const post = await Post.findById(postId);

    if (!post) {
      throw new ErrorHandler(404, "Post not found");
    }

    //add the newly created comment to the existing post
    const postComments = post.comments;
    postComments.push(comment._id);
    await post.save();

    await comment.save();
    res.status(201).send({
      status: true,
      message: "Posted comment successfully",
      data: comment,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
