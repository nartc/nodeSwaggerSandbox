'use strict';

var Cafe = require('../models/cafe');

module.exports.index = (req, res) => {
  Cafe.find({"name": {$ne: null}}, (err, cafes) => {
    if(err) {
      return res.status(500).json({
        success: false,
        title: 'error',
        message: 'error fetching cafes',
        error: err
      });
    }

    res.status(200).json({
      success: true,
      title: 'success',
      message: 'fetched cafes successfully',
      cafes: cafes
    });
  });
}

module.exports.create = (req, res) => {
  let newCafe = new Cafe(req.swagger.params.cafe.value.cafe);

  newCafe.save((err, cafe) => {
    if(err) {
      return res.status(500).json({
        success: false,
        title: 'error',
        message: 'error adding cafe',
        error: err
      });
    }

    res.status(200).json({
      success: true,
      title: 'success',
      message: 'added cafe successfully',
      cafe: cafe
    });
  });
}