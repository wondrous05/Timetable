const express = require("express");
const { SignUp, Login, Forgotpassword, Resetpassword, ViewTable} = require("../controller/StudentController");
const isAuthenticated = require("../middleware/jwt");
const router = express.Router();

router.post("/signup", SignUp);
router.post("/login", Login);
router.post("/forgotpassword", Forgotpassword);
router.post("/resetpassword", Resetpassword);
router.get("/view", ViewTable);

module.exports = router;
