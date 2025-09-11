const mongoose = require("mongoose");

const Db = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB);
    console.log("DB connected");
  } catch (error) {
    console.log("error connecting to db", error.message);
  }
};

module.exports = Db;