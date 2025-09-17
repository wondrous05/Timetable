const express = require("express");
const {
  SignUp,
  Login,
  Forgotpassword,
  Resetpassword, 
  
} = require("../controller/AdminController");
const { isAuthenticated } = require("../middleware/jwt");
const { Admin} = require("../middleware/rbac")
const router = express.Router();
const { ViewTable } = require("../controller/StudentController");


router.post("/signup", SignUp);
router.post("/login", Login);
router.post("/forgotpassword", Forgotpassword);
router.post("/resetpassword/:token", Resetpassword);
router.get("/viewtable", isAuthenticated, Admin, ViewTable);


module.exports = router;
