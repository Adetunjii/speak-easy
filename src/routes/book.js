const { Router } = require("express");
const Book = require("../models/book");
const auth = require("../middleware/auth");

const router = Router();

router.post("/addBook", auth, async (req, res) => {
  const newBook = new Book(req.body);

  await newBook.save();
  res.status(201).send({
    status: true,
    message: "book added successfully...",
    data: newBook,
  });
});

module.exports = router;
