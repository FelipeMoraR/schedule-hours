const express = require('express');
const path = require('path');
const app = express();
const cors = require('cors');
//const logRoutes = require('./logic/routes/routesControll');

if (process.env.NODE_ENV !== 'production'){
    require('dotenv').config();
}

//This allow send json to the db, in POST.JS you're sending a json.
app.use(express.json());

//Corse to use third apis conexions
app.use(cors());

//routers 
const router = require('./logic/routes/routes');
app.use(
  `/auth/api`, router
);


//const postRouter = require('./logic/routes/Post');
//app.use('/post', postRouter);


// Example of an API
app.get('/api/data', (req, res) => {
  res.json({ message: 'Hello from the API!' });
});

// Route to test log
//app.use('/api/logs', logRoutes);


// Serve static files from your frontend's 'dist' folder
app.use(express.static(path.join(__dirname, '../client/dist')));

// Path to handle all other requests and serve the index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.info('toi parao en el puerto', PORT);
});