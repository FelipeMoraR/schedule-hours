const express = require('express');
const router = express.Router();
const { Log } = require('../models');

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

module.exports = router;