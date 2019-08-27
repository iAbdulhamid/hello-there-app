const express = require('express');
const multer  = require('multer');

const Post = require('../models/post');

const router = express.Router();

const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg"
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("Invalid mime type");
    if (isValid) {
      error = null;
    }
    cb(error, "backend/images");
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(" ").join("-");
    const extinsion = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + "-" + Date.now() + "." + extinsion);
  }
});

// 01: GET all posts:
router.get('/posts', (req, res) => {
  // fetching all posts documents from (posts) collection => find()
  const pageSize    = Number(req.query.pagesize);
  const currentPage = Number(req.query.page);
  const postQuery   = Post.find();
  let fetchedPosts;

  if(pageSize && currentPage) {
    postQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }

  postQuery.then(documents => {
    fetchedPosts = documents;
    return Post.count();
  }).then(count => {
    res.status(200).json({
      message: 'Posts fetched successfully!',
      data: fetchedPosts,
      maxPosts: count
    });
  });
});

// 02: GET one post:
router.get('/posts/:id', (req, res) => {
  Post.findById(req.params.id).then(post => {
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({message: 'Post not found!'});
    }
  });
});

// 03: POST a post:
router.post('/posts', multer({storage: storage}).single('image'), (req, res) => {

  const url = req.protocol + '://' + req.get('host');

  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: url + '/images' + req.file.fieldname
  });
  post.save().then(createdPost => {
    res.status(201).json({
      message: `Post ${createdPost._id} added successfully`,
      post: {
        id: createdPost._id,
        title: createdPost.title,
        content: createdPost.content,
        imagePath: createdPost.imagePath
      }
    });
  });
});

// 04: PUT a post:
router.put('/posts/:id', multer({ storage: storage }).single("image"), (req, res) => {
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
    imagePath: imagePath
  });
  Post.updateOne({_id: req.params.id}, post)
    .then(result => {
      console.log(result);
      res.status(200).json({message: 'Post updated successfully'});
    });
});

// 05: DELETE a post:
router.delete('/posts/:id', (req, res) => {
  Post.deleteOne({_id: req.params.id})
  .then(res => {
    console.log(res);
    res.status(200).json({message: 'Post deleted!'});
  }).catch((err)=>console.log(err));
});

module.exports = router;
