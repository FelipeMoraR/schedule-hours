const express = require('express');
const app = express();
const cors = require('cors');



//This allow send json to the db, in POST.JS you're sending a json.
app.use(express.json());

//Corse to use third apis conexions
app.use(cors());

//routers 
const postRouter = require('./routes/Post');

app.use('/post', postRouter);

app.listen(3001, () => {
    console.info('toi parao en el puerto 3001');
});
