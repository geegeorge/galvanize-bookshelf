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
            // console.log(req.cookies.token);
            if (req.cookies.token) {
                res.status(200)
                res.send(true)
            } else {
                res.status(200);
                res.send(false)
            }
          })

router.post('/', (req, res, next) => {
            // console.log('body', req.body);
            knex('users')
                .where('email', req.body.email)
                .then((users) => {
                    if (!users[0]) {
                        res.send('bad call, invalid email or password')
                    } else {
                        bcrypt.compare(req.body.password, users[0].hashed_password)
                            .then(() => {
                                var user = users[0]
                                delete user.hashed_password;
                                let token = jwt.sign(users[0], process.env.JWT_KEY)
                                res.cookie('token', token, {
                                    httpOnly: true
                                })
                                // console.log('token', token);
                                // console.log('user', user);
                                res.status(200);
                                res.send(humps.camelizeKeys(user))
                            })
                            .catch(bcrypt.MISMATCH_ERROR, () => {
                                throw boom.create(400, 'BAD EMAIL OR PASSWORD')
                            })
                            .catch((err) => {
                                next(err)
                            })
                    }
                });
        });

router.delete('/', (req, res, next) => {
  res.clearCookie('token')
  res.send(true)
})
        // router.get('/token', (req, res, next) => {
        //   console.log('get is working')
        // knex('users')
        // .where('email', email)
        // .first()
        // .then((user)=>{
        //   if(!token){
        //     return err
        //   } else {
        //     bcrypt.compare((email, users.hashed_password)=>{
        //
        //       res.send(user);
        //     })
        //   }
        // })
        // // console.log(token);
        //
        //
        //
        // });
        // router.get('/', (req, res, next) => {
        //     console.log(req.cookies.token);
        //     jwt.verify(req.cookies.token,
        //     process.env.JWT_KEY, (err, data) => {
        //       if (err){
        //         res.send(false)
        //       } else {
        //       res.send(true)
        //       res.status(200);
        //     }
        //   })
        // })

        module.exports = router;
