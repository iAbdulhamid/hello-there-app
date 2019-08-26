const express = require('express');

const Post = require('../models/post');

const router = express.Router();

router.get('/posts', (req, res) => {
  // fetching all posts documents from (posts) collection => find()
  Post.find().then(documents => {
    res.status(200).json({
      message: 'Posts fetched successfully!',
      data: documents,
    });
  });
});

router.get('/posts/:id', (req, res) => {
  Post.findById(req.params.id).then(post => {
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({message: 'Post not found!'});
    }
  });
});

router.post('/posts', (req, res) => {
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

router.put('/posts/:id', (req, res) => {
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

router.delete('/posts/:id', (req, res) => {
  Post.deleteOne({_id: req.params.id})
  .then(res => {
    console.log(res);
    res.status(200).json({message: 'Post deleted!'});
  });
});

module.exports = router;
