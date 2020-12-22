const express = require("express");
const mongoose = require("./db/mongoose");
const dotenv = require("dotenv").config();
const cors = require("cors");
const { userRouter } = require("./routes");

const app = express();
app.use(express.json());
app.use(cors({ origin: true }));

//routes
app.use("/api/users", userRouter);

//server instantiation
const port = process.env.PORT || 3000;
app.listen(port, () => console.log("Server is running on port", port));
