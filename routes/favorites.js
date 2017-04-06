'use strict';

const humps = require('humps');
const boom = require('boom');
const express = require('express');
const bcrypt = require('bcrypt-as-promised');
// eslint-disable-next-line new-cap
const router = express.Router();
const knex = require('../knex');
// const req.body = {email, password}
const jwt = require('jsonwebtoken');

router.get('/', (req, res, next) => {
    // console.log('duck');
    if (!req.cookies.token) {
        // res.send('Unauthorized');
        res.sendStatus(401);
    } else {
        knex('favorites')
            .join('books', 'books.id', 'book_id')
            .then((favs) => {
                res.send(humps.camelizeKeys(favs));
            });
    }
});
router.get('/check', (req, res, next) => {
    if (!req.cookies.token) {
        res.sendStatus(401);
    } else {
        let id = +req.query.bookId;
        knex('favorites')
            .where('id', id)
            .then((favorite) => {
                if (!favorite.length) {
                    res.send(false)
                } else {
                    res.send(true)
                }
            })
    }
})
router.post('/', (req, res, next) => {
    if (!req.cookies.token) {
        res.status(401);
        return next(boom.create(401, 'Unauthorized'))
    } else {
        knex.raw("select setval('favorites_id_seq', (select max(id) from favorites))")
        knex('favorites')
            .insert({
                id: req.body.id,
                book_id: req.body.bookId,
                user_id: 1
            })
            .returning('*')
            .then(function(data) {
                res.send(humps.camelizeKeys(data[0]));

            })
    }
});
router.delete('/', (req, res, next) => {
  console.log(req.cookies.token);
    if (!req.cookies.token) {
        return next(boom.create(401, 'Unauthorized'))
    }
    knex('favorites')
        .returning(['book_id', 'user_id'])
        .where('book_id', req.body.bookId)
        .del()
        .then((favs) => {
            // delete favs[0].id;
            res.send(humps.camelizeKeys(favs[0]));
        })
});
module.exports = router;
