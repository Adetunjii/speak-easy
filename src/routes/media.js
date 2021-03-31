const { Router } = require("express");
const { ErrorHandler } = require("../helpers/errors");
const auth = require("../middleware/auth");
const Media = require("../models/media");

const router = Router();

router.get("/getAllMedia", auth, async (req, res, next) => {
  try {
    const media = await Media.find();

    res.status(200).send({
      status: true,
      message: "successfully fetched...",
      data: media,
    });
  } catch (error) {
    next(error);
  }
});

router.post("/createMedia", auth, async (req, res, next) => {
  try {
    const media = new Media(req.body);

    await media.save();

    res.status(200).send({
      status: true,
      message: "Successfully created",
      data: media,
    });
  } catch (error) {
    next(error);
  }
});

router.patch("/udpateMedia/:id", auth, async (req, res, next) => {
  const id = req.params.id.trim();
  const updates = Objects.keys(req.body);
  const allowedUpdates = ["displayName", "additionalInfo", "fileType"];
  const isValidOperation = updates.every((update) => {
    return allowedUpdates.includes(update);
  });

  try {
    if (!id) {
      throw new ErrorHandler(400, "Invalid media id");
    }

    if (!isValidOperation) {
      throw new ErrorHandler(400, "Invalid updates");
    }

    const media = await Media.findById(id);

    if (!media) {
      throw new ErrorHandler(404, "Media not found");
    }

    updates.forEach((update) => (media[update] = req.body[update]));

    await media.save();

    res.status(200).send({
      status: true,
      message: "successfully updated",
      data: media,
    });
  } catch (error) {
    next(error);
  }
});

router.delete("/deleteMedia/:id", auth, async (req, res, next) => {
  try {
    const id = req.params.id.trim();

    const media = await Media.findByIdAndRemove(id);

    if (!media) {
      throw new ErrorHandler(404, "Media does not exist");
    }

    res.status(200).send({
      status: true,
      message: "Successfully deleted...",
      data: media,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
