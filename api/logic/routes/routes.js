const express = require('express');
const router = express.Router();
const { registerUser, loginUser, logoutUser, midleWareVerifyToken, createTypeUser, cookieValidator, 
    removeCookie, refreshToken, insertTokenBlackList, getUserData, createStatusClass, createClass, resUploadCloudImg} = require('../controller/controller')


router.post('/create-type-user', midleWareVerifyToken, createTypeUser);
router.post('/logout-user', midleWareVerifyToken, logoutUser);
router.get('/verify-cookie', midleWareVerifyToken, cookieValidator);
router.post('/remove-cookie', removeCookie);
router.get('/refresh-token', refreshToken);
router.post('/register-user', registerUser); //This is how you can add the middleware to protect routes.
router.post('/login-user', loginUser);
router.get('/get-user-info', midleWareVerifyToken, getUserData);
router.post('/insert-token-black-list', insertTokenBlackList);
router.post('/insert-status-class', midleWareVerifyToken, createStatusClass);
router.post('/create-class', midleWareVerifyToken, createClass);
router.post('/upload-image', resUploadCloudImg);

module.exports = router;