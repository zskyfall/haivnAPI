var express = require('express');
var router = express.Router();

var User = require('../models/User');
var OOPUser = require('../models/OOPUser');
var Photo = require('../models/Photo');
/* Utils */
let validate = require('../utils').validate;

const PAGE = 1;
const PAGE_SIZE = 5;
const NUMB_ONE = 1;
const NUMB_MINUS_ONE = -1;
const BLANK_STRING = '';
const TEXT_ERROR = "error";
const TEXT_OK = "ok";

/* Utils */
let paginate = require('../utils').paginate;

/* GET users listing. */

router.get('/', function(req, res, next) {

	let page = parseInt(req.query.page) || PAGE;
	let size = parseInt(req.query.size) || PAGE_SIZE;

	var query = {};

	Photo.paginate(query, {page: page, limit: size})
		.then(photos => {

				var result = {
					message: TEXT_OK,
					data: photos
				};

				res.json(result);
			

		});
});

router.post('/love', (req, res) => {
	var userId = req.body.userId;
	var postId = req.body.postId;
	if(validate(userId) && validate(postId)) {

		Like.hasLike(userId, postId, isLiked => {
			//Nếu User đã like bài viết
			if(isLiked){
						Like.removeLike(userId, postId, err => {
							if(err) {
								var result = {
									message: TEXT_ERROR,
									description: err
								};

								res.json(result);
							}
							else {
								Photo.updateLike(NUMB_MINUS_ONE, postId, er => {
									if(er) {
										var result = {
											message: TEXT_ERROR,
											description: er
										};

										res.json(result);
									}
									else {
										var result = {
											message: TEXT_OK
										};

										res.json(result);
									}
								});

							}
						});
			}
			//Nếu User chưa like
			else {
						Like.addLike(userId, postId, err => {
							if(err) {
								var result = {
									message: TEXT_ERROR,
									description: err
								};

								res.json(result);
							}
							else {
								Photo.updateLike(NUMB_ONE, postId, er => {
									if(er) {
										var result = {
											message: TEXT_ERROR,
											description: er
										};

										res.json(result);
									}
									else {
										var result = {
											message: TEXT_OK
										};

										res.json(result);
									}
								});

							}
						});
			}
		})

	}
	

});

module.exports = router;
