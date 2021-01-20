const { Router } = require("express");
const nodemailer = require("nodemailer");
const { ErrorHandler } = require("../helpers/errors");
const OTP = require("../models/otp");
const dotenv = require("dotenv").config();
const aws = require("aws-sdk");

const {
  MAIL_HOST,
  MAIL_PORT,
  MAIL_USER,
  MAIL_PASSWORD,
  ACCESS_KEY_ID,
  SECRET_KEY_ID,
} = process.env;

aws.config.update({
  accessKeyId: "AKIAZGH6NOJQFP3J4ZML",
  secretAccessKey: "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",
  region: "us-east-1",
});

const router = Router();

//create nodemailer transport
const transport = nodemailer.createTransport({
  // host: "us-east-1.amazon.com",
  // secure: true,
  // port: 465,
  // auth: {
  //   user: "adetunjithomas1@gmail.com",
  //   pass: "ebunoluwa",
  // },
  // SES: new aws.SES({
  //   apiVersion: "2010-12-01",
  // }),
});

router.post("/generateAndSendOTP", async (req, res, next) => {
  //generate a random otp from 0000 - 9999;
  let generatedOTP = Math.floor(Math.random() * 10000 + 10000)
    .toString()
    .substring(1);
  const generatedOTPArray = [];

  try {
    const userEmail = req.body.userEmail;

    if (!userEmail) {
      throw new ErrorHandler(400, "Invalid User Email");
    }

    const mailOptions = {
      from: "adetunjithomas1@gmail.com",
      to: userEmail,
      subject: "SPEAK EASY EMAIL VERIFICATION",
      html: `
        <h3>GENERATED OTP</h3><br/>
        <h1>${generatedOTP}</h1>
        `,
    };

    transport.sendMail(mailOptions, async (err, info) => {
      if (err) {
        console.log(err);
      }
    });

    const isExist = await OTP.findOne({ userEmail: userEmail });
    console.log(isExist);
    if (isExist) {
      isExist.generatedOTP.push(generatedOTP);
      await isExist.save();
      return res.status(200).send({
        status: true,
        message: "otp sent successfully",
      });
    }

    generatedOTPArray.push(generatedOTP);
    console.log(generatedOTPArray);
    const newOtp = new OTP({ userEmail, generatedOTP: generatedOTPArray });
    await newOtp.save();
    res.status(201).send({
      status: true,
      message: "otp saved successfully",
    });
    next();
  } catch (error) {
    next(error);
  }
});

router.post("/validateOTP", async (req, res, next) => {
  try {
    const userEmail = req.body.userEmail;
    const userOTP = req.body.userOTP;

    if (!userEmail || !userOTP) {
      throw new ErrorHandler(400, "Invalid Input fields");
    }

    const isExist = await OTP.findOne({ userEmail });
    if (!isExist) {
      throw new ErrorHandler(404, "An OTP hasn't been sent to this email.");
    }

    let generatedOTP = isExist.generatedOTP;
    if (generatedOTP.length > 0) {
      let lastIndex = generatedOTP.length - 1;
      const latestOTP = generatedOTP[lastIndex];
      if (userOTP !== latestOTP) {
        throw new ErrorHandler(400, "Invalid OTP");
      }

      await OTP.findOneAndDelete({ userEmail });

      res.status(200).send({
        status: true,
        message: "Otp validation succesful",
      });
    }

    throw new Error(400, "An OTP hasn't been sent to this email");
  } catch (error) {
    next(error);
  }
});

module.exports = router;
