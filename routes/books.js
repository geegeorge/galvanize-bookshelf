'use strict';

const express = require('express');
const knex = require('../knex');
const humps = require('humps');

// const http = require('http');
// eslint-disable-next-line new-cap
const router = express.Router();

router.get('/books', (req, res, next) => {
  knex('books')
        .orderBy('title', 'asc')
        .then((books) => {
          res.send(humps.camelizeKeys(books));
        })
        .catch((err) => {
          next(err);
        });
});

router.get('/books/:id', (req, res, next) => {
  knex('books')
        .where('id', req.params.id)
        .then((books) => {
            // console.log('id', req.params.id)
          res.send(humps.camelizeKeys(books[0]));
        })
        .catch((err) => {
          next(err);
        });
});
router.post('/books', (req, res, next) => {
  knex('books')
        .insert({
          title: req.body.title,
          author: req.body.author,
          genre: req.body.genre,
          description: req.body.description,
          cover_url: req.body.coverUrl
        })
        .returning(['id', 'title', 'author', 'genre', 'description', 'cover_url'])
        .then((book) => {
          res.send(humps.camelizeKeys(book[0]));
        });
});
router.patch('/books/:id', (req, res, next) => {
  knex('books')
        .where('id', req.params.id)
        .update({
          title: req.body.title,
          author: req.body.author,
          genre: req.body.genre,
          description: req.body.description,
          cover_url: req.body.coverUrl
        })
        .returning('*')
        .then((books) => {
          res.json(humps.camelizeKeys(books[0]));
        });
});
router.delete('/books/:id', (req, res, next) => {
  let books;

  knex('books')
        .where('id', req.params.id)
        .returning('*')
        .del()
        .then((books) => {
          delete books[0].id;
          res.send(humps.camelizeKeys(books[0]));
        });
});
module.exports = router;
