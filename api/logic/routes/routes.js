const express = require('express');
const router = express.Router();
const { registerUser, loginUser, logoutUser, midleWareVerifyToken, createTypeUser, cookieValidator, 
    removeCookie, refreshToken, insertTokenBlackList, getUserData, createStatusClass, createClass, resUploadCloudImg,
    getAllCategoryClass, getAllClasses, getTotalCountClasses, deleteClass

} = require('../controller/controller')



router.post('/remove-cookie', removeCookie);
router.get('/refresh-token', refreshToken);
router.post('/register-user', registerUser); //This is how you can add the middleware to protect routes.
router.post('/login-user', loginUser);
router.post('/insert-token-black-list', insertTokenBlackList);

//Routes protected
router.post('/create-type-user', midleWareVerifyToken, createTypeUser);
router.post('/logout-user', midleWareVerifyToken, logoutUser);
router.get('/verify-cookie', midleWareVerifyToken, cookieValidator);
router.get('/get-user-info', midleWareVerifyToken, getUserData);
router.post('/insert-status-class', midleWareVerifyToken, createStatusClass);
router.post('/create-class', midleWareVerifyToken, createClass);
router.post('/upload-image', midleWareVerifyToken, resUploadCloudImg);
router.get('/all-category-class', midleWareVerifyToken, getAllCategoryClass);
router.get('/all-classes', getAllClasses);
router.get('/all-counted-classes', getTotalCountClasses);
router.delete('/delete-class/:id', midleWareVerifyToken, deleteClass);






module.exports = router;