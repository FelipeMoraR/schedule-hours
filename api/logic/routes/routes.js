const express = require('express');
const router = express.Router();
const { Log, test } = require('../../models');

router.post('/create-log', async (req, res) => {
    try {

        const log = await Log.create({
            From: 'LOG TEST',
            Type: 'log',
            Log: 'Log created to test te create method and the timestamp.'
        });
        res.status(201).json(log);
     } catch (error) {
        res.status(500).json({ error: error.message });
     }
});


router.get('/test-post', async (req, res) => {
    const listTest = await test.findAll();
    res.json(listTest);
});


router.post('/test-post', async (req, res) => {
    const post = req.body;
    await test.create(post);
    res.json(post);
});



module.exports = router;