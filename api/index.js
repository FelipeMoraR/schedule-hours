const express = require('express');
const app = express();
const cors = require('cors');

if (process.env.NODE_ENV !== 'production'){
    require('dotenv').config();
}



//This allow send json to the db, in POST.JS you're sending a json.
app.use(express.json());

//Corse to use third apis conexions
app.use(cors());

//routers 
const postRouter = require('./routes/Post');

app.use('/post', postRouter);

const PORT = process.env.PORT || 3001;


app.listen(PORT, () => {
    console.info('toi parao en el puerto', PORT);
});
