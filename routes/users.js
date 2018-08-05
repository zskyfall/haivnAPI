var express = require('express');
var router = express.Router();

var User = require('../models/User');
var OOPUser = require('../models/OOPUser');
var Photo = require('../models/Photo');
var base64Img = require('base64-img');
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
			
			User.isExistUser(username, email, (errr, count) => {
				if(errr) {
					var result = {
						message: TEXT_ERROR,
						description: errr
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
								console.log("loi 1");
								var result = {
									message: TEXT_ERROR,
									description: err
								};

								res.json(result);
							}
							else{
										console.log("2");
										User.getUserByUsername(username, function(er, resultUser) {

											if(er) {
												var result = {
													message: TEXT_ERROR,
													description: er
												};
												console.log("3");

												res.json(result);
											}
											else {
												var result = {
													message: TEXT_OK,
													user: resultUser
												};
												console.log("4");
												res.json(result);
											}

										});
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

router.post('/update', function(req, res) {

	var user = req.body;
		var username = user.username;
		var password = user.password;
		var fullName = user.fullName;
		var email = user.email;
		var rawAvatar = user.avatar;

		console.log(user);

		if(validate(username) && validate(password) && validate(fullName) && validate(email)) {

			if(validate(rawAvatar)) {

					base64Img.img('data:image/png;base64,'+ rawAvatar, 'public/uploads/users', username+'_avatar', function(errr, filepath) {
						if(errr) {
							var result = {
								message: TEXT_ERROR,
								description: errr
							}
							res.json(result);
						}
						else {	
								User.updateUser(username, {fullName: fullName, email: email, password: password, avatar: filepath}, function(err) {

									if(err) {
										var result = {
											message: TEXT_ERROR,
											description: MESSAGE_UPDATE_ERROR
										};

										res.json(result);
									}
									else {

										User.getUserByUsername(username, function(er, resultUser) {

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
													user: resultUser
												};

												res.json(result);
											}

										});

									}

								});
						}
					});
			}

			else {
								User.updateUser(username, {fullName: fullName, email: email, password: password}, function(err) {

									if(err) {
										var result = {
											message: TEXT_ERROR,
											description: MESSAGE_UPDATE_ERROR
										};

										res.json(result);
									}
									else {

										User.getUserByUsername(username, function(er, resultUser) {

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
													user: resultUser
												};

												res.json(result);
											}

										});

									}

								});
			}
				
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
