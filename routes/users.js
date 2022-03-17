'use strict';
const User = require('../models').User
const express = require('express');
const { authenticateUser } = require('../middleware/auth-user');
const { asyncHandler } = require('../middleware/async-handler');

// This array is used to keep track of user records

// Construct a router instance.
const router = express.Router();

  //gets a user if authenticateded
router.get('/', authenticateUser, asyncHandler(async(req, res) => {
    const user = req.currentUser
        res.status(200).json(user);
  }));

  //create a user
router.post('/', asyncHandler(async(req, res) => {
    console.log(req.body)

    const user = await User.create(req.body)
    if(user) {
        res
        .status(201)
        .location("/")
        .end()
    } else {
        return err
    }
  }));

  module.exports = router

// {
//     "firstName": "Gabe",
//     "lastName": "Powers",
//     "email": "userGabe@mail.com",
//     "password": "P4ssword",
//     "confirmedPassword": "P4ssword"
// }