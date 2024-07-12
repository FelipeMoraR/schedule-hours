const express = require('express');
const app = express();

//This allow send json to the db, in POST.JS you're sending a json.
app.use(express.json());

//routers 
const postRouter = require('./routes/Post');

app.use('/post', postRouter);

app.listen(3001, () => {
    console.info('toi parao en el puerto 3001');
});
