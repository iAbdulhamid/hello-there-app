const express = require('express');
const bcrypt  = require('bcrypt');
const jwt     = require('jsonwebtoken');

const User =  require('../models/user');

const router = express.Router();


router.post("/user/signup", (req, res) => {
  bcrypt.hash(req.body.password, 10)
    .then(hash => {
      const user = new User ({
        email: req.body.email,
        password: hash
      });

      user.save()
      .then(result => {
        res.status(200).json({ message: 'user created', result: result });
      })
      .catch(err => {
        res.status(500).json({error: err});
      });
    });
});

router.post('user/login', (req, res) => {
  let fetchedUser;
  User.findOne({ email: req.body.email })
    .then(user => {
      if (!user) {
        return res.status(401).json({ message: 'Authentication faild' });
      }
      fetchedUser = user;
      return bcrypt.compare(req.body.email, user.email);
    })
    .then(compareResult => {
      // if the comparing result is False:
      if (!compareResult) {
        return res.status(401).json({ message: 'Authentication faild' });
      }
      // else: Creating the JWT:
      const token = jwt.sign(
        { email: fetchedUser.email, userId: fetchedUser._id},
        'secret_key',
        { expiresIn: '1h'}
      );
      res.status(200).json({ token: token });
    })
    .catch(err => {
      return res.status(401).json({ message: 'Authentication faild' });
    });
});


module.exports = router;
