const userRouter = require("./user");
const baseRouter = require("./base");
const bookingRouter = require("./booking");
const roomRouter = require("./room");
const groupRouter = require("./group");
const postRouter = require("./post");
const uploadRouter = require("./upload");
const otpRouter = require("./otp");
const commentRouter = require("./postComment");

module.exports = {
  userRouter,
  baseRouter,
  bookingRouter,
  roomRouter,
  groupRouter,
  postRouter,
  uploadRouter,
  otpRouter,
  commentRouter,
};
