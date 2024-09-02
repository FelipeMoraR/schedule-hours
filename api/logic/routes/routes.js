const express = require('express');
const router = express.Router();
const { registerUser, loginUser, logoutUser, verifyToken, createTypeUser } = require('../controller/controller')

router.get('/verify-token', verifyToken, (req, res) => {
    res.status(200).json({status: 200, message: 'Token is valid', info: req.info})
});
router.post('/create-type-user', verifyToken, createTypeUser);
router.post('/create-user', verifyToken, registerUser); //This is how you can add the middleware to protect routes.
router.post('/login-user', loginUser);
router.post('/logout-user', logoutUser);

module.exports = router;