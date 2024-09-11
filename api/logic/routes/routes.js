const express = require('express');
const router = express.Router();
const { registerUser, loginUser, logoutUser, midleWareVerifyToken, createTypeUser, statusVerifyToken, cookieDetect } = require('../controller/controller')

router.get('/verify-token', midleWareVerifyToken, statusVerifyToken);
router.post('/create-type-user', midleWareVerifyToken, createTypeUser);
router.post('/create-user', midleWareVerifyToken, registerUser); //This is how you can add the middleware to protect routes.
router.post('/login-user', loginUser);
router.post('/logout-user', logoutUser);
router.get('/cookie-protection', cookieDetect);

module.exports = router;