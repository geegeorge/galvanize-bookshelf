'use strict';

const express = require('express');
const bcrypt = require('bcrypt-as-promised')
// eslint-disable-next-line new-cap
const router = express.Router();
// YOUR CODE HERE
router.get('/token', (req, res, next) => {
console.log(token);

  if (!token) {
    res.send(200);
  }
});

module.exports = router;
