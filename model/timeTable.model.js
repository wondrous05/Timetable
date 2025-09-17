const mongoose = require("mongoose");

const Schema = new mongoose.Schema({
  department: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  day: {
    type: String,
    enum: ["monday", "tuesday", "wednesday", "thursday", "friday"],
    Required: true,
  },
  semester: {
    type: String,
    default: "first",
    enum: ["first", "second"],
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
  lectureRoom: {
    type: String,
    required: true,
  },
  lecturer: {
    type: String,
    required: true,
  },
  level: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    required: true,
    enum: [
      "08:00 - 10:00",
      "10:00 - 12:00",
      "12:00 - 14:00",
      "14:00 - 16:00",
      "16:00 - 18:00",
    ],
  },
  course: { type: String, required: true },
  //  createdBy: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: "Admin",           // references the Admin collection
  //   required: true,
  // },
});

const timeSchema = mongoose.model("Timetable", Schema);

module.exports = timeSchema;
