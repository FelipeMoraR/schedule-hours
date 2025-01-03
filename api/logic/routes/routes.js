const express = require('express');
const router = express.Router();
const { registerUser, loginUser, logoutUser, midleWareVerifyToken, createTypeUser, cookieValidator, 
    removeCookie, refreshToken, insertTokenBlackList, getUserData, createStatusClass, createClass, resUploadCloudImg,
    getAllCategoryClass, getAllClasses, getTotalCountClasses, deleteClass, uploadClass, getAllStatusClass, getAllMembersClass, removeMemberClass,
    cancellClass, petitionEnrollStudentClass, acceptEnrollStudentClass, viewProfile, updateUser

} = require('../controller/controller')



router.post('/remove-cookie', removeCookie);
router.get('/refresh-token', refreshToken);
router.post('/register-user', registerUser); //This is how you can add the middleware to protect routes.
router.post('/login-user', loginUser);
router.post('/insert-token-black-list', insertTokenBlackList);
router.get('/view-user/:idUser', viewProfile);

//Routes protected
router.post('/create-type-user', midleWareVerifyToken, createTypeUser);
router.post('/logout-user', midleWareVerifyToken, logoutUser);
router.get('/verify-cookie', midleWareVerifyToken, cookieValidator);
router.get('/get-user-info', midleWareVerifyToken, getUserData);
router.post('/insert-status-class', midleWareVerifyToken, createStatusClass);
router.post('/create-class', midleWareVerifyToken, createClass);
router.post('/upload-image', midleWareVerifyToken, resUploadCloudImg);
router.get('/all-category-class', midleWareVerifyToken, getAllCategoryClass);
router.get('/all-classes', midleWareVerifyToken, getAllClasses);
router.get('/all-counted-classes', midleWareVerifyToken, getTotalCountClasses);
router.delete('/delete-class/:id/:folder/:nameImg', midleWareVerifyToken, deleteClass);
router.put('/upload-class', midleWareVerifyToken, uploadClass);
router.put('/cancell-class', midleWareVerifyToken, cancellClass);
router.get('/all-status-class',midleWareVerifyToken, getAllStatusClass);
router.get('/members-class', midleWareVerifyToken, getAllMembersClass);
router.delete('/remove-member-class/:idUser/:idClass',midleWareVerifyToken, removeMemberClass);
router.post('/enroll-student', midleWareVerifyToken, petitionEnrollStudentClass);
router.post('/accept-enroll-student', midleWareVerifyToken, acceptEnrollStudentClass);
router.put('/update-user', updateUser);




module.exports = router;