var express = require('express');
var bing = require('node-bing-api')({accKey: 'adf9ec1425cb43cca8954827f36b4164'});
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/api/imagesearch/:term', function(req, res, next) {
  var image = req.params.term;

  bing.images(image, {
    count: 10,
    offset: 2
  }, function(err, response, body) {
    var data = [];
    for(var i=0; i<10; i++){
      data.push({
        url: body.value[i].contentUrl,
        snippet: body.value[i].name,
        thumbnail: body.value[i].thumbnailUrl,
        context: body.value[i].hostPageUrl
      });
    }
    res.json(data);
    //next();
  });
});

module.exports = router;
