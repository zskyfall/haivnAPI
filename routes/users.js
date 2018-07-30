var express = require('express');
var router = express.Router();

var User = require('../models/User');
var OOPUser = require('../models/OOPUser');
var Photo = require('../models/Photo');
/* Utils */
let paginate = require('../utils').paginate;
let validate = require('../utils').validate;

const BLANK_STRING = '';
const TEXT_ERROR = 'error';
const TEXT_OK = 'ok';
const MESSAGE_LOGIN_FAIL = 'Sai Tên Đăng Nhập hoặc Mật Khẩu';
const MESSAGE_REGISTER_SUCCESS = 'Đăng Ký Thành Công!';
const MESSAGE_INVALID_INPUT = 'Dữ liệu không hợp lệ!';
const MESSAGE_UPDATE_ERROR = 'Lỗi trong quá trình cập nhật! Xin thử lại?';
const MESSAGE_EXIST_USER = 'Tên Đăng Nhập hoặc Email đã tồn tại!';
const MESSAGE_INVALID_USER = 'Người dùng không hợp lệ';
const NUMB_ONE = 1;



/* GET users listing. */
router.get('/', function(req, res, next) {

  User.getAllUsers(function(err, users){

  	if(err){
  		var result = {
				message: TEXT_ERROR,
				description: err
			};

		res.json(result);
  	}
  	else{
  		var listUsers = [];
  		users.forEach(function(user) {
				let username = user.username;
				let email = user.email;
				let fullName = user.fullName;
				let cover = user.cover;
				let avatar = user.avatar;

				let oopUser = new OOPUser(fullName, email, username, avatar, cover);
				listUsers.push(oopUser.get());
			});


			var result = {
				message: TEXT_OK,
				users: listUsers
			};

		res.json(result);
  	}

  });

});

router.get('/:username', function(req, res, next) {
	var username = req.params.username;

	User.isUser(username, (error, count) => {
		if(error) {
			var result = {
				message: TEXT_ERROR,
				description: error
			};

			res.json(result);
		}
		else {
			 if(count == NUMB_ONE) {

			 	 	var user = User.getUserByUsername(username, function(err, user){	
						if(err){
							res.json({
								message: TEXT_ERROR,
								description: err
							});
						}
						else{
								let username = user.username;
								let email = user.email;
								let fullName = user.fullName;
								let cover = user.cover;
								let avatar = user.avatar;

								let oopUser = new OOPUser(fullName, email, username, avatar, cover);

							var result = {
								message: TEXT_OK,
								user: oopUser.get()
							};

							res.json(result);
						}
					});
			 }

			 else {
			 		var result = {
			 			message: TEXT_ERROR,
			 			description: MESSAGE_INVALID_USER
			 		};

			 		res.json(result);
			 }
		}
	});

});

router.post('/login', function(req, res) {

	var username = req.body.username;
	var password = req.body.password;

	if( validate(username) && validate(password) ) {
		User.hasUser(username, password, (err, count) => {
			if(err){
				var result = {
					message: TEXT_ERROR,
					description: err
				};

				res.json(result);
			}
			else{
				if(count >= NUMB_ONE) {
					User.getUser(username, password, (er, user) => {
						if(er) {
							var result = {
								message: TEXT_ERROR,
								description: er
							};

							res.json(result);
						}
						else{
							var result = {
								message: TEXT_OK,
								user: user
							};

							res.json(result);
						}
					});
				}
				else{
					var result = {
						message: TEXT_ERROR,
						description: MESSAGE_LOGIN_FAIL
					};

					res.json(result);
				}
			}
		});
	}

});

router.post('/register', function(req, res){
	
	var user = req.body;
		var username = user.username;
		var password = user.password;
		var fullName = user.fullName;
		var email = user.email;

		if(validate(username) && validate(password) && validate(fullName) && validate(email)) {
			
			User.isExistUser(username, email, (err, count) => {
				if(err) {
					var result = {
						message: TEXT_ERROR,
						description: err
					};

					res.json(result);
				}
				else {

					if(count >= NUMB_ONE) {
						var result = {
							message: TEXT_ERROR,
							description: MESSAGE_EXIST_USER
						};

						res.json(result);
					}
					else {

						User.addNewUser(user, function(err) {

							if(err) {
								var result = {
									message: TEXT_ERROR,
									description: err
								};

								res.json(result);
							}
							else{
								var result = {
									message: TEXT_OK,
									description: MESSAGE_REGISTER_SUCCESS
								};

								res.json(result);
							}
						});

					}
				}
			});
		}
		else{
					var result = {
						message: TEXT_ERROR,
						description: MESSAGE_INVALID_INPUT
					};

					res.json(result);
		}

});

router.put('/update', function(req, res) {
	var oldUserId = req.query.id;

	var user = req.body;
		var username = user.username;
		var password = user.password;
		var fullName = user.fullName;
		var email = user.email;
		var avatar = user.avatar;

		if(validate(username) && validate(password) && validate(fullName)
		 && validate(email) && validate(avatar) && validate(oldUserId)) {
			
				User.updateUser(oldUserId, user, function(err) {

					if(err) {
						var result = {
							message: TEXT_ERROR,
							description: MESSAGE_UPDATE_ERROR
						};

						res.json(result);
					}
					else {

						User.getUserById(oldUserId, function(er, user) {

							if(er) {
								var result = {
									message: TEXT_ERROR,
									description: er
								};

								res.json(result);
							}
							else {
								var result = {
									message: TEXT_OK,
									user: user
								};

								res.json(result);
							}

						});

					}

				});
		}
		else {
			var result = {
				message: TEXT_ERROR,
				description: MESSAGE_INVALID_INPUT
			};

			res.json(result);
		}

});

module.exports = router;
