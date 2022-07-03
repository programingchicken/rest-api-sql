'use strict';
const User = require('../models').User
const express = require('express');
const { authenticateUser } = require('../middleware/auth-user');
const { asyncHandler } = require('../middleware/async-handler');

// This array is used to keep track of user records

// Construct a router instance.
const router = express.Router();

  //gets a user if authenticateded
router.get('/users', authenticateUser, asyncHandler(async(req, res) => {
    const user = req.currentUser
        res.json(user).status(200).end();
  }));

  //create a user
router.post('/users', asyncHandler(async(req, res, next) => {
    console.log(req.body)

    const user = await User.create(req.body)
    if (user) {
      console.log('You have created the user!')
        res
        .status(201)
        .location(`/`)
        .end()
    } else {
        next(err) 
    }
  }));

  module.exports = router

// {
//     "firstName": "Gabe",
//     "lastName": "Powers",
//     "emailAddress": "userGabe@mail.com",
//     "password": "P4ssword",
// }