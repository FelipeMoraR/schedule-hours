const express = require('express');
const router = express.Router();
const { Log, TYPEUSER, USER } = require('../../models');

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

router.post('/create-user', async (req, res) => {
    try {
        const { username,
            password,
            first_name,
            last_name,
            run,
            run_dv,
            age,
            id_type_user } = req.body

        const newUser = await USER.create({
            username: username,
            password: password,
            first_name: first_name,
            last_name: last_name,
            run: run,
            run_dv: run_dv,
            age: age,
            id_type_user: id_type_user
        });
        res.status(201).json(newUser);
     } catch (error) {
        res.status(500).json({ error: error.message });
     }
});




module.exports = router;