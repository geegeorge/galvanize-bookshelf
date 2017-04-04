'use strict';

const express = require('express');
const bcrypt = require('bcrypt-as-promised');

// eslint-disable-next-line new-cap
const router = express.Router();

router.post('/users', (req, res, next) => {
  bcrypt.hash(req.body.password, 12)
        .then((hashed_password) => {
          res.send(200);
        });

      return knex('users').insert({
        email: req.body.email,
          hashed_password: hashed_password
        }, '*')
        .then((users) => {
          user = users[0];
          delete user.hashed_password;
          res.send(user);
        })
        .catch((err) => {
          next(err);
        });
})
module.exports = router;
