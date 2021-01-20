const AWS = require("aws-sdk");
const dotenv = require("dotenv").config();
const { Router } = require("express");

const router = Router();
const { ACCESS_KEY_ID, SECRET_ACCESS_KEY, BUCKET_NAME, REGION } = process.env;

AWS.config.update({ region: REGION });

const s3 = new AWS.S3({
  apiVersion: "2006-03-01",
  accessKeyId: ACCESS_KEY_ID,
  secretAccessKey: SECRET_ACCESS_KEY,
  region: REGION,
  signatureVersion: "v4",
});

const getSignedUrl = (req, res) => {
  console.log(req.body);
  let fileType = req.body.fileType;
  if (
    fileType != ".jpg" &&
    fileType != ".png" &&
    fileType != ".jpeg" &&
    fileType != ".pdf" &&
    fileType != ".docx"
  ) {
    return res
      .status(404)
      .send({ status: false, message: "Invalid file format" });
  }

  fileType = fileType.substring(1, fileType.length);
  const fileName = req.body.fileName;
  const params = {
    Bucket: BUCKET_NAME,
    Key: fileName + "." + fileType,
  };

  s3.getSignedUrl("putObject", params, (err, data) => {
    if (err) {
      console.log(err);
      return;
    }

    const returnData = {
      success: true,
      message: "url generated",
      uploadUrl: data,
      downloadUrl: `https://${BUCKET_NAME}.s3.amazonaws.com/${fileName}.${fileType}`,
    };
    return res.status(201).send(returnData);
  });
};

router.post("/generateUrl", (req, res) => getSignedUrl(req, res));

module.exports = router;
