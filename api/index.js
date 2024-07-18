const express = require('express');
const path = require('path');
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


//Serve static files from your frontend's 'build' folder
app.use(express.static(path.join(__dirname, 'client/build')));

// Path to handle all other requests and serve the index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build/index.html'));
});


app.listen(PORT, () => {
    console.info('toi parao en el puerto', PORT);
});
