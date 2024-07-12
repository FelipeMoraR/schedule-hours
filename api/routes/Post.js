const express = require('express');
const router = express.Router();
const { test } = require('../models')

router.get('/', async (req, res) => {
    const listTest = await test.findAll();
    res.json(listTest);
});


router.post('/', async (req, res) => {
    const post = req.body;
    await test.create(post);
    res.json(post);
});



module.exports = router;

