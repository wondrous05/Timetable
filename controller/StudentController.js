const Student = require("../model/StudentModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const SignUp = async (req, res) => {
  const { email, password, matricNo, level, Department, modeOfStudy } =
    req.body;

  try {
    const checkStudent = await Student.findOne({ email: email });

    if (checkStudent) {
      return res
        .status(401)
        .json({ msg: "Student already exists kindly login" });
    }

    const hash = await bcrypt.hash(password, 12);

    const newStudent = new Student({
      email,
      password: hash,
      matricNo,
      level,
      Department,
      modeOfStudy,
    });

    await newStudent.save();

    return res.status(201).json({ msg: "Student registered to the database" });
  } catch (error) {
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

const Login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const checkstudent = await Student.findOne({ email: email });

    if (!checkstudent) {
      return res.status(404).json({ msg: "data not found" });
    }
    const checkpass = await bcrypt.compare(password, checkstudent.password);

    if (!checkpass) {
      return res.status(404).json({ msg: "incorrect password" });
    }
    const payload = {
      id: checkpass._id,
      role: checkpass.role,
      email: checkpass.email,
    };
    const token = jwt.sign(payload, process.env.JWTSCRET, {
      expiresIn: process.env.EXPIRESIN,
    });
    return res.status(200).json({ msg: "login successful", token });
  } catch (error) {
    console.log(error);

    return res.status(500).json({ msg: "internal server error" });
  }
};
module.exports = { SignUp, Login };
