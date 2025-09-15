const Admin = require("../model/Adminmodel");
const timeTable = require("../model/timeTable.model");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const nodemmailer = require("nodemailer");
const { rawListeners } = require("process");
const port = process.env.PORT;

const SignUp = async (req, res) => {
  const { email, name, phonenumber, password, role } = req.body;

  // console.log(Admin);

  try {
    const checkAdmin = await Admin.findOne({ email: email });

    if (checkAdmin) {
      return res.status(401).json({ msg: "admin already exist kindly login" });
    }

    const hash = await bcrypt.hash(password, 12);

    const newAdmin = new Admin({
      email,
      name,
      phonenumber,
      password: hash,
      role,
    });

    await newAdmin.save();

    const transporter = nodemmailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.USER_EMAIL,
        pass: process.env.USER_PASSWORD,
      },
    });

    // defien mail option

    const mailOptions = {
      from: process.env.USER_EMAIL,
      to: `${newAdmin.email}`,
      subject: "welcome",
      text: `Dear User welcome to NACOS MAPOLY Time-Table Pro website. You are now an ADMIN`,
    };

    //send the mail options
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log("Error occured:", error);
      } else {
        console.log(("Email sent:", info.response));
      }
    });

    return res
      .status(201)
      .json({ msg: "You have been registered as an Admin" });
  } catch (error) {
    console.log("signuperror", error.message);
    return res
      .status(500)
      .json({ msg: "internal server error", Error: error.message });
  }
};

const Login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const checkadmin = await Admin.findOne({ email: email });

    if (!checkadmin) {
      return res.status(404).json({ msg: "user not exist kindly signup" });
    }
    const checkpass = await bcrypt.compare(password, checkadmin.password);

    if (!checkpass) {
      return res.status(404).json({ msg: "incorrect password" });
    }

    const payload = {
      id: checkadmin.id,
      role: checkadmin.role,
      email: checkadmin.email,
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.EXPIRESIN,
    });
    return res.status(200).json({ msg: "login succesful", token });
  } catch (error) {
    console.log(error);

    return res.status(500).json({ msg: "internal server error" });
  }
};

const Forgotpassword = async (req, res) => {
  const { email } = req.body;

  try {
    const admin = await Admin.findOne({ email: email });

    if (!admin) {
      return res.status(404).json({ msg: "email doesnt exist" });
    }
    console.log("i am here");

    const token = crypto.randomBytes(40).toString("hex");
    const tokenExpiration = Date.now() + 3600000;

    admin.resetToken = token;
    admin.resetTokenExpiry = tokenExpiration;
    console.log(token);

    await admin.save();

    const transporter = nodemmailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.USER_EMAIL,
        pass: process.env.USER_PASSWORD,
      },
    });

    //DEFINE EMAIL OPTION

    const mailOptions = {
      from: process.env.USER_EMAIL,
      to: `${admin.email}`,
      subject: "password Reset",
      text: `this is a request you have made to reset
          password of your account.
          please click on the following link, or paste this 
          on your browser to complete the process:
          http://localhost:${port}/api/v1/users/reset/${token}
          if you did not authenticate this request please ignore this
          message and your password will remain the same,`,
    };

    //SEND THE MAIL
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

// PASSWORD RESET
const Resetpassword = async (req, res) => {
  try {
    const { token } = req.params;

    const { password } = req.body;

    const admin = await Admin.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() },
    });

    if (!admin) {
      return res.status(404).json({ msg: "invalid token or expired" });
    }

    const hashpassword = await bcrypt.hash(password, 10);

    admin.password = hashpassword;
    admin.resetToken = undefined;
    admin.resetTokenExpiry = undefined;

    await admin.save();

    return res.status(200).json({ msg: "password reset successfully" });
  } catch (error) {
    console.log("reseterror", error.message);

    return res.status(500).json({ msg: "internal server error" });
  }
};

const createTable = async (req, res) => {
  try {
    const {
      course,
      time,
      day,
      semester,
      year,
      lectureRoom,
      lecturer,
      level,
      department,
    } = req.body;

    // ✅ Validate required fields
    if (!course || !time || !day || !semester || !year || !lectureRoom || !lecturer || !level || !department) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    // ✅ Normalize values
    const normalizedDay = day.toLowerCase();  // keep days consistent (e.g., "monday")

    // ✅ Check if venue is already booked at same time/day/semester/year
    const checkTable = await timeTable.findOne({
      day: normalizedDay,
      lectureRoom,
      time,
      semester,
      year,
    });

    if (checkTable) {
      return res.status(403).json({
        msg: "The venue is already in use for this schedule",
      });
    }

    // ✅ Check if lecturer already has a class at that time/day
    const checkLecturer = await timeTable.findOne({
      lecturer,
      day: normalizedDay,
      time,
      year,
    });

    if (checkLecturer) {
      return res.status(403).json({
        msg: "Lecturer already has a class scheduled at this time",
      });
    }

    // ✅ Save new timetable entry
    const newTable = new timeTable({
      course,
      time,
      day: normalizedDay,
      semester,
      year,
      lectureRoom,
      lecturer,
      level,
      department,
    });

    await newTable.save();

    return res.status(201).json({
      msg: "Timetable created successfully",
      data: newTable,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      msg: "Internal server error",
      error: error.message,
    });
  }
};


module.exports = { SignUp, Login, Forgotpassword, Resetpassword, createTable };
