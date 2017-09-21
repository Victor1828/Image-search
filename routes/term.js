var express = require('express');
var dotenv = require('dotenv');
dotenv.config();
var bing = require('node-bing-api')({accKey: process.env.bing});
var searchImages = require('../public/javascripts/searchImages');
var router = express.Router();

// search info
router.get('/:term', function(req, res, next) {
    var image = req.params.term;
    var offset = req.query.offset;
  
    // saving search term on database
    var data = new searchImages({
      search_term: image,
      date: new Date()
    });
  
    data.save(function(err) {
      if(err){
        res.render('error');
      }
    });
  
    // bing api
    function bingApi (skip) {
      bing.images(image, {
        count: 10 ,
        offset: 2 * skip
      }, function(err, response, body) {
        var bingResult = [];
        if(err){
          return next(err);
        }
        body.value.map(function(val) {
          bingResult.push({
            url:val.contentUrl,
            snippet: val.name,
            thumbnail: val.thumbnailUrl,
            context: val.hostPageUrl
          });
        });
        res.json(bingResult);
      });
    }

    if(!offset){
      bingApi(0);
    }else if(offset>1){
      bingApi(offset);
    }
});

module.exports = router;

