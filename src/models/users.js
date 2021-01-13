const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const validator = require("validator");
const dotenv = require("dotenv").config();

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true, trim: true, lowercase: true },
  lastName: { type: String, required: true, trim: true, lowercase: true },
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    validate(value) {
      if (validator.isEmpty(value)) {
        throw new Error("Field cannot be empty");
      }
    },
  },
  password: { type: String, required: true },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Email is invalid");
      }
    },
  },
  phoneNo: {
    type: String,
    required: true,
    unique: true,
    validate(value) {
      if (validator.isEmpty(value)) {
        throw new Error("Field cannot be empty");
      }
    },
  },
  imageURL: {
    type: String,
    default:
      "https://avataaars.io/?avatarStyle=Circle&topType=LongHairStraight&accessoriesType=Blank&hairColor=BrownDark&facialHairType=Blank&clotheType=BlazerShirt&eyeType=Default&eyebrowType=Default&mouthType=Default&skinColor=Light",
  },
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
});

userSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();

  delete userObject.password;
  delete userObject.tokens;

  return userObject;
};

userSchema.methods.generateAuthToken = async function () {
  const { JWT_SECRET } = process.env;
  const user = this;
  const token = await jwt.sign({ _id: user._id.toString() }, JWT_SECRET, {
    expiresIn: "1 day",
  });

  user.tokens = user.tokens.concat({ token });
  await user.save();
  return token;
};

userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("Email doesn't exist");
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Invalid Password");
  }

  return user;
};

userSchema.pre("save", async function (next) {
  const user = this;

  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }

  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
