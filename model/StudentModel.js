const mongoose = require("mongoose");

const Schema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    matricNo: {
      type: String,
      required: true,
      unique: true,
    },
    level: {
      type: String,
      enum: ["ND1", "ND2", "HND1", "HND2"],
      required: true,
    },
    department: {
      type: String,
      required: true,
    },
    modeOfStudy: {
      type: String,
      required: true,
      default: "fullTime",
      enum: ["fullTime", "partTime"],
    },
   role: {
      type: String,
      required: true,
      default: "student",
      
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const Student = mongoose.model("Student", Schema);

module.exports = Student;
