const express    = require('express');
const bodyParser = require('body-parser');
const cors       = require('cors');
const mongoose   = require('mongoose');

const postsRoutes = require('./routes/posts');

const app = express();

mongoose.connect("mongodb+srv://iks:hpzG0Crcclz87ARt@cluster0-gaanz.mongodb.net/hello-there-db?retryWrites=true&w=majority")
  .then(() => {
    console.log('Connected to DB!');
  })
  .catch(() => {
    console.log('Connection failed!');
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cors());

app.use((req, res, next) => {
  // console.log('hello from express, first middleware');
  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader('Access-Control-Allow-Headers',
                'Origin, X-Requested-With, Content-Type, Accept');
  res.setHeader('Access-Control-Allow-Methods',
                'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  next();
});

// all posts routes:
app.use(postsRoutes);

module.exports = app;
