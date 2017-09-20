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
    if(!offset){
      bing.images(image, {
        count: 10 ,
        offset: 0
      }, function(err, response, body) {
        var bingResult = [];
        bingResult.push(body);
        var result = [];
        for(var i=0; i<10; i++){
            result.push({
                url: bingResult.value[i].contentUrl,
                snippet: bingResult.value[i].name,
                thumbnail: bingResult.value[i].thumbnailUrl,
                context: bingResult.value[i].hostPageUrl
            });
        }
        res.json(result);
      });
    }else if(offset>1){
      bing.images(image, {
        count: 10 ,
        offset: 2 * offset
      }, function(err, response, body) {
        var bingResult = [];
        for(var i = 0; i < 10; i++){
          bingResult.push({
            url: body.value[0].contentUrl,
            snippet: body.value[0].name,
            thumbnail: body.value[0].thumbnailUrl,
            context: body.value[0].hostPageUrl
          });
        }
        res.json(bingResult);
      });
    }
});

module.exports = router;