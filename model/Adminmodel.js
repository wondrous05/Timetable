const mongoose = require("mongoose");

const Schema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  phonenumber: {
    type: Number,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
    default: "Admin",
  },
  resetToken: {
    type: String,
  },
  resetTokenExpiry: {
    type: Date,
  },
});

const Admin = mongoose.model("Admin", Schema);

module.exports = Admin;
