const express = require('express');
const path = require('path');
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');

if (process.env.NODE_ENV !== 'production'){
    require('dotenv').config();
}

//This allow send json to the db, in POST.JS you're sending a json.
app.use(express.json());

//Corse to use third apis conexions
app.use(cors({
  origin: process.env.URL_FRONT,  
  credentials: true // This allow work with cookies
}));

app.use(cookieParser());

//routers 
const router = require('./logic/routes/routes');
app.use(
  `/auth/api`, router
);

app.use('/auth/api/*', (req, res) => {
  res.status(404).json({ error: 'API route not found' });
});

// Serve static files (JS and CSS) from your frontend's 'dist' folder
app.use(express.static(path.join(__dirname, '../client/dist')));

// Path to handle all other requests and serve the index.html that doesn't worked with the previus code.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.info('toi parao en el puerto', PORT);
});