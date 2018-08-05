var express = require('express');
var router = express.Router();

var User = require('../models/User');
var OOPUser = require('../models/OOPUser');
var Photo = require('../models/Photo');
var base64Img = require('base64-img');
var Like = require('../models/Like');
/* Utils */
let validate = require('../utils').validate;
let change_alias_vi = require('../utils').change_alias_vi;
let currentTime = require('../utils').currentTime;

const PAGE = 1;
const PAGE_SIZE = 5;
const NUMB_ONE = 1;
const NUMB_MINUS_ONE = -1;
const BLANK_STRING = '';
const TEXT_ERROR = "error";
const TEXT_OK = "ok";
const MESSAGE_POST_SUCCESS = "Ảnh đã được đăng!";
const MESSAGE_DELETE_SUCCESS = "Ảnh đã được xóa thành công!";
const MESSAGE_UPDATE_SUCCESS = "Cập nhật thành công!"
const MESSAGE_INVALID_INPUT = "Dữ liệu không hợp lệ. Nhập lại?";
const MESSAGE_LIKE = "liked";
const MESSAGE_UNLIKE = "unliked";

/* Utils */
let paginate = require('../utils').paginate;

/* GET users listing. */

router.get('/', function(req, res, next) {

	let page = parseInt(req.query.page) || PAGE;
	let size = parseInt(req.query.size) || PAGE_SIZE;
	let owner = req.query.owner;
	var query = {};

	if(owner != undefined) {
		query = {"owner.username" : owner};
	}

	Photo.paginate(query, {page: page, limit: size, sort: {_id: -1} })
		.then(photos => {

				var result = {
					message: TEXT_OK,
					data: photos
				};

				res.json(result);
			

		});
});

router.get('/:id', function(req, res) {
	var id = req.params.id;

	Photo.getPhotoById(id, (err, photo) => {
		if(err) {
			var result = {
				message: TEXT_ERROR,
				description: err
			};

			res.json(result);
		}
		else {
			var result = {
				message: TEXT_OK,
				photo: photo
			};

			res.json(result);
		}

	});
});

router.post('/add', (req, res) => {
	var createdDate = currentTime();
	var photo = req.body;
		var title = photo.title;
		var rawPhoto = photo.rawPhoto;
		var ownerName = photo.ownerName;
		var ownerAvatar = photo.ownerAvatar;
		var ownerUsername = photo.ownerUsername;

	var owner = {
		name: ownerName,
		avatar: ownerAvatar,
		username: ownerUsername
	};

	var dateNow = new Date();
	var timeNow = dateNow.getTime();

	if(validate(title) && validate(rawPhoto)) {
		var namePhoto = change_alias_vi(title);
		base64Img.img('data:image/png;base64,'+ rawPhoto, 'public/uploads/posts/', 
			ownerUsername+'-' + timeNow + namePhoto, function(err, filepath) {
				if(err) {
					console.log(err);
					var result = {
						message: TEXT_ERROR,
						description: err
					};

					res.json(result);
				}
				else {
					console.log("khong loi");
					var post = new Photo({
						title: title,
						url: filepath,
						owner: owner,
						created: timeNow
					});

					post.save(function(er) {
						if(er) {
							console.log(er);
							var result = {
								message: TEXT_ERROR,
								description: er
							};

							res.json(result);
						}
						else {
							var result = {

								message: TEXT_OK,
								description: MESSAGE_POST_SUCCESS
							};

							res.json(result);
						}
					});
				}
		});
	}

	else {
			res.json({
				message: TEXT_ERROR,
				description: MESSAGE_INVALID_INPUT
			});
	}

});

router.post('/delete', (req, res) => {
	var id = req.body.id;

	Photo.deletePhotoById(id, (err) => {
		if(err) {
			var result = {
				message: TEXT_ERROR,
				description: err
			};

			res.json(result);
		}
		else {
			Like.remove({postId: id}, (er) => {
				if(err) {
					var result = {
						message: TEXT_ERROR,
						description: er
					};

					res.json(result);
				}

				else {
						var result = {
							message: TEXT_OK,
							description: MESSAGE_DELETE_SUCCESS
						};

						res.json(result);
				}
			});
		}

	});
});


router.post('/update', (req, res) => {

	var post = req.body;
	var id = post.postId;
	var title = post.title;

	Photo.update({_id: postId}, {title: title}, (err) => {
		if(err) {
			res.json({
				message: TEXT_ERROR,
				description: err
			});
		}
		else {
			res.json({
				message: TEXT_OK,
				description: MESSAGE_UPDATE_SUCCESS
			});
		}
	});

});

router.post('/love', (req, res) => {
	var username = req.body.username;
	var postId = req.body.postId;
	if(validate(username) && validate(postId)) {

		Like.hasLike(username, postId, isLiked => {
			//Nếu User đã like bài viết
			if(isLiked){
						Like.removeLike(username, postId, err => {
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
											message: MESSAGE_UNLIKE
										};

										res.json(result);
									}
								});

							}
						});
			}
			//Nếu User chưa like
			else {
						Like.addLike(username, postId, err => {
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
											message: MESSAGE_LIKE
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
