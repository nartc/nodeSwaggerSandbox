'use strict';

const passport = require('passport');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../../config/keys');
const User = require('../models/User');

module.exports.register = (req, res) => {
  let newUser = new User({
    email: req.swagger.params.user.value.user.email,
    password: req.swagger.params.user.value.user.password
  });

  bcrypt.genSalt(10, (err, salt) => {
    if (err) {
      return res.status(500).json({
        success: false,
        title: 'error',
        message: 'Error generating salt for password',
        error: err
      });
    }

    bcrypt.hash(newUser.password, salt, (err, hash) => {
      if (err) {
        return res.status(500).json({
          success: false,
          title: 'error',
          message: 'Error hashing password',
          error: err
        });
      }

      newUser.password = hash;
      newUser.save((err, user) => {
        if (err) {
          return res.status(500).json({
            success: false,
            title: 'error',
            message: 'Error registering new user',
            error: err
          });
        }

        res.status(200).json({
          success: true,
          title: 'success',
          message: 'User registered',
          response: user
        });
      });
    });
  });
}

module.exports.login = (req, res) => {
  let email = req.swagger.params.credential.value.email;
  let password = req.swagger.params.credential.value.password;

  console.log(req.swagger.params.credential);

  let emailQuery = {
    email: email
  };

  User.findOne(emailQuery, (err, user) => {
    if (err) {
      return res.status(500).json({
        success: false,
        title: 'error',
        message: `Error fetching User by email`,
        error: err
      });
    }

    if (!user) {
      return res.status(500).json({
        success: false,
        title: 'error',
        message: `Email or password does not exist`
      });
    }

    bcrypt.compare(password, user.password, (err, isMatched) => {
      if (err) {
        return res.status(500).json({
          success: false,
          title: 'error',
          message: 'Error comparing password',
          error: err
        });
      }

      if (!isMatched) {
        res.status(400).json({
          success: false,
          title: 'error',
          message: 'Password does not match'
        });
      } else {
        jwt.sign({user: user}, config.secretKEY, {expiresIn: 18000}, (err, token) => {
          if(err) {
            return res.status(500).json({
                success: false,
                title: 'error',
                message: 'Error authenticating',
                error: err
            });
          }

          res.status(200).json({
            success: true,
            title: 'success',
            message: 'Logged In',
            authToken: `JWT ${token}`,
            user: {
                _id: user._id,
                email: user.email
            }
          });
        });
      }
    });
  });
}

//const passportStrategy = passport.authenticate('jwt', {session:false});

module.exports.getUser = (req, res) => {
  let authToken = req.headers.authorization;
  console.log(authToken);

  if(!authToken) {
    return res.status(400).json({
      success: false,
      title: 'error',
      message: 'Token is missing'
    });
  }

  jwt.verify(authToken, config.secretKEY, (err, decodedToken) => {
    if(err) throw err;

    res.json({
      success: true,
      title: 'success',
      message: 'Successfully fetched user profile',
      user: {
        _id: decodedToken.user._id,
        email: decodedToken.user.email,
        createdOn: decodedToken.user.createdOn,
        issuedAt: decodedToken.iat
      }
    });
  });
}