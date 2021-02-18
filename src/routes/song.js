const { Router } = require("express");
const Song = require("../models/song");
const auth = require("../middleware/auth");

const router = Router();

router.post("/addSong", auth, async (req, res) => {
  const newSong = new Song(req.body);

  await newSong.save();
  res.status(201).send({
    status: true,
    message: "Song added successfully...",
    data: newSong,
  });
});

module.exports = router;
