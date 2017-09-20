var express = require('express');
var searchImages = require('../public/javascripts/searchImages');
var router = express.Router();

/* Checking database for recent search */
router.get('/', function(req, res, next) {
  searchImages.find({}, function(err, data) {
    if(err){
        res.render('error');
    }
    res.json(data);
  });
});

module.exports = router;
