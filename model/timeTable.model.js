const mongoose = require('mongoose');

const Schema = new mongoose.Schema({
    course: {
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
    department: {
        
    }
})

const timeSchema = mongoose.model("Timetable", Schema)

module.exports = timeSchema;