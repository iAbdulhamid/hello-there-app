const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');


const app = express();

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
  const posts = [
    {
      id: 'vbeui2313',
      title: 'first post',
      content: 'flndfknsdkfhllbhbjvlajfdva'
    },
    {
      id: 'fedfss673',
      title: 'second post',
      content: 'dfgdlms;;.lpbahsbda'
    }
  ];
  res.status(200).json({
    message: 'Posts fetched successfully!',
    data: posts,

  });
});

app.post('/posts', (req, res) => {
  const post = req.body;
  console.log(post);
  res.status(201).json({
    message: 'Post addes successfully'
  });
});



module.exports = app;
