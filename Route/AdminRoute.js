const express = require('express');
const { SignUp, Login, Forgotpassword, 
    Resetpassword, } = require('../controller/AdminController');
 const router = express.Router();


 router.post('/signup', SignUp );
 router.post('/login', Login);
 router.post('/forgotpassword', Forgotpassword);
 router.post('/resetpassword/:token', Resetpassword);



 module.exports = router;