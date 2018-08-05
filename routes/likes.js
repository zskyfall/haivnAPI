var express = require('express');
var router = express.Router();

var Like = require('../models/Like');

/* GET home page. */
router.get('/:username', function(req, res, next) {
  var username = req.params.username;

  Like.find({username: username}).select('postId').exec((err, like) => {
  	if(err) {
  		var result = {
  			message: "error",
  			description: err
  		};

  		res.json(result);
  	}
  	else {
  		var result = {
  			message: "ok",
  			posts: like
  		};

  		res.json(result);
  	}
  });

});

router.get('/:username/:postId', function(req, res) {
  var username = req.params.username;
  var postId = req.params.postId;

  Like.count({username: username, postId}, (err, count) => {
      if(err) {
          var result = {
            message: "error",
            description: err
          };

          res.json(result);
      }
      else {
          if(count == 1) {
              var result = {
                  message: "liked",
              };
              res.json(result);
          }
          else{
              var result = {
                message: "unliked"
              };
              res.json(result);
          }
      }
  });
});

module.exports = router;
