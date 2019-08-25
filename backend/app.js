const express    = require('express');
const bodyParser = require('body-parser');
const cors       = require('cors');
const mongoose   = require('mongoose');

const Post = require('./models/post');

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
                'GET, PUT, PATCH, DELETE, OPTIONS');
  next();
});

app.get('/posts', (req, res) => {
  // fetching all posts documents from (posts) collection => find()
  Post.find().then(documents => {
    res.status(200).json({
      message: 'Posts fetched successfully!',
      data: documents,
    });
  });
});

app.post('/posts', (req, res) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content
  });
  post.save().then(createdPost => {
    res.status(201).json({
      message: `Post ${createdPost._id} added successfully`,
      postId: createdPost._id
    });
  });
});

app.delete('/posts/:id', (req, res) => {
  Post.deleteOne({_id: req.params.id})
  .then(res => {
    console.log(res);
    res.status(200).json({message: 'Post deleted!'});
  });
});


module.exports = app;
