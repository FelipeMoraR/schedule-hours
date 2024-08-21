const express = require('express');
const router = express.Router();
const { Log, TYPEUSER, USER } = require('../../models');
const { registerUser } = require('../controller/controller')

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

router.post('/create-type-user', async (req, res) => {
    try {
        const { name } = req.body

        const newTypeUser = await TYPEUSER.create({
            name: name
        });
        res.status(201).json(newTypeUser);
     } catch (error) {
        res.status(500).json({ error: error.message });
     }
});

router.post('/create-user', registerUser);



module.exports = router;