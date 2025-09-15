const Student = require("../model/StudentModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const time = require("../model/timeTable.model");
const port = process.env.PORT;

const SignUp = async (req, res) => {
  const { email, password, matricNo, level, department, modeOfStudy, role } =
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
      department,
      modeOfStudy,
      role,
    });

    await newStudent.save();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.USER_EMAIL,
        pass: process.env.USER_PASSWORD,
      },
    });

    // Define the email options
    const mailOptions = {
      from: process.env.USER_EMAIL,
      to: `${newStudent.email}`,
      subject: "Welcome",
      text: `Dear User welcome to NACOS MAPOLY Time-Table Pro website`,
    };

    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log("Error occurred:", error);
      } else {
        console.log("Email sent:", info.response);
      }
    });

    return res.status(201).json({ msg: "Student registered to the database" });
  } catch (error) {
    console.log("signuperrror:", error.message);
    return res
      .status(500)
      .json({ msg: "Internal Server Error", error: error.message });
  }
};

const Login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const checkstudent = await Student.findOne({ email: email });

    if (!checkstudent) {
      return res.status(404).json({ msg: "user does not exist try to signup" });
    }
    const checkpass = await bcrypt.compare(password, checkstudent.password);

    if (!checkpass) {
      return res.status(404).json({ msg: "incorrect password" });
    }
    const payload = {
      id: checkstudent._id,
      role: checkstudent.role,
      email: checkstudent.email,
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.EXPIRESIN,
    });
    return res.status(200).json({ msg: "login successful", token });
  } catch (error) {
    console.log(error);

    return res.status(500).json({ msg: "internal server error" });
  }
};

const Forgotpassword = async (req, res) => {
  const { email } = req.body;

  try {
    const student = await Student.findOne({ email: email });

    if (!student) {
      return res.status(404).json({ msg: "email not exist" });
    }
    console.log("i am here");

    const token = crypto.randomBytes(40).toString("hex");
    const tokenExpiration = Date.now() + 3600000;

    student.resetToken = token;
    student.resetTokenExpiry = tokenExpiration;
    console.log(token);

   await student.save({ validateBeforeSave: false });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.USER_EMAIL,
        pass: process.env.USER_PASSWORD,
      },
    });

    console.log(process.env.USER_EMAIL);
    console.log(process.env.USER_PASSWORD);

    //define email option

    const mailOptions = {
      from: process.env.USER_EMAIL,
      to: `${student.email}`,
      subject: "Password Reset",
      text: `this is a request you have made to reset 
      password of your account.
      please click on the following link, or paste
      this on your browser to complete the process:
      http://localhost:${port}/api/v1/users/reset/${token}
      if you did not authenticate this request please ignore this 
      message and your password will remain the same.`,
    };

    //send the mail
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log("error encountered", error);
      } else {
        console.log("Email sent:", info.response);
      }
    });

    return res.status(200).json({ msg: "check your mailbox" });
  } catch (error) {
    console.log("error:", error);
    return res
      .status(500)
      .json({ msg: "internal server error:", error: error.message });
  }
};

//password reset

const Resetpassword = async (req, res) => {
  try {
    const { token } = req.params

    const { password } = req.body

    const student = await Student.findOne({
      resetToken: token,
      resetTokenExpiration: { $gt: Date.now() },
    });

    if (!student) {
      return res.status(404).json({ msg: "invalid token or expired" });
    }

    const hashpassword = await bcrypt.hash(password, 16);

    Student.password = hashpassword;
    Student.resetToken = undefined;
    Student.resetTokenExpiry = undefined;

    await Student.save();

    return res.status(200).json({ msg: "password reset successfully" });
  } catch (error) {
    console.log("reseterror", error.message);
    
    return res.status(500).json({ msg: "internal server error" });
  }
};

const ViewTable = async (req, res) => {
  try {
    const { semester, level, year, department } = req.query;

    const timeTable = await time.find({
      semester,
      level,
      year,
      department,   // now filter by course
    });

    if (!timeTable || timeTable.length === 0) {
      return res.status(404).json({ msg: "No timetable found" });
    }

    return res.status(200).json(timeTable);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Server Error", error });
  }
};


module.exports = { SignUp, Login, Forgotpassword, Resetpassword, ViewTable };
