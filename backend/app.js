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
                'GET, POST, PUT, PATCH, DELETE, OPTIONS');
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

app.get('/posts/:id', (req, res) => {
  Post.findById(req.params.id).then(post => {
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({message: 'Post not found!'});
    }
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

app.put('/posts/:id', (req, res) => {
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content
  });
  Post.updateOne({_id: req.params.id}, post)
    .then(result => {
      console.log(result);
      res.status(200).json({message: 'Post updated successfully'});
    })
});

app.delete('/posts/:id', (req, res) => {
  Post.deleteOne({_id: req.params.id})
  .then(res => {
    console.log(res);
    res.status(200).json({message: 'Post deleted!'});
  });
});


module.exports = app;
