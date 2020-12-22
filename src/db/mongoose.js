const mongoose = require("mongoose");
const dotenv = require("dotenv").config();

const { MONGODB_URI } = process.env;

console.log(MONGODB_URI);
//setup a connection to the database
mongoose.connect(
  MONGODB_URI,
  {
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: true,
    useUnifiedTopology: true,
  },
  (error) => {
    if (error) {
      return console.log("Db couldn't connect");
    }
    console.log("Db connected successfully....");
  }
);

module.exports = mongoose;
