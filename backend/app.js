const path        = require('path');
const express     = require('express');
const bodyParser  = require('body-parser');
const cors        = require('cors');
const mongoose    = require('mongoose');
// Routes:
const postsRoutes = require('./routes/posts');
const userRoutes  = require('./routes/user');

const app = express();

mongoose.connect("mongodb+srv://iks:hpzG0Crcclz87ARt@cluster0-gaanz.mongodb.net/hello-there-db?retryWrites=true&w=majority", { useNewUrlParser: true })
  .then(() => {
    console.log('Connected to DB!');
  })
  .catch(() => {
    console.log('Connection failed!');
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cors());
// to allow the front end to access the images file:
app.use('/images', express.static(path.join('backend/images')));

app.use((req, res, next) => {
  // console.log('hello from express, first middleware');
  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  next(); // Go execute the next middleware ...
});

// all posts routes:
app.use(postsRoutes);
// all users routes:
app.use(userRoutes);

module.exports = app;
