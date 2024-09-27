const express = require('express');
const router = express.Router();
const { registerUser, loginUser, logoutUser, midleWareVerifyToken, createTypeUser, cookieValidator, cookieDetect, removeCookie, refreshToken, insertTokenBlackList} = require('../controller/controller')


router.post('/create-type-user', midleWareVerifyToken, createTypeUser);
router.post('/logout-user', logoutUser);
router.get('/cookie-protection', cookieDetect);
router.get('/verify-cookie', midleWareVerifyToken, cookieValidator);
router.post('/remove-cookie', removeCookie);
router.get('/refresh-token', refreshToken);
router.post('/register-user', registerUser); //This is how you can add the middleware to protect routes.
router.post('/login-user', loginUser);
router.post('/insert-token-black-list', insertTokenBlackList);

module.exports = router;