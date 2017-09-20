var express = require('express');
var dotenv = require('dotenv');
dotenv.config();
var bing = require('node-bing-api')({accKey: process.env.bing});
var searchImages = require('../public/javascripts/searchImages');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/api/imagesearch/:term', function(req, res, next) {
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
      for(var i = 0; i < 10; i++){
        bingResult.push({
          url: body.value[i].contentUrl,
          snippet: body.value[i].name,
          thumbnail: body.value[i].thumbnailUrl,
          context: body.value[i].hostPageUrl
        });
      }
      res.json(bingResult);
    });
  }else if(offset>1){
    bing.images(image, {
      count: 10 ,
      offset: 2 * offset
    }, function(err, response, body) {
      var bingResult = [];
      for(var i = 0; i < 10; i++){
        bingResult.push({
          url: body.value[i].contentUrl,
          snippet: body.value[i].name,
          thumbnail: body.value[i].thumbnailUrl,
          context: body.value[i].hostPageUrl
        });
      }
      res.json(bingResult);
    });
  }

});

module.exports = router;
