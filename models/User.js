var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
	email: {
		type: String
	},
	username: {
		type: String
	},
	password: {
		type: String
	},
	fullName: {
		type: String
	},
	avatar: {
		type: String
	},
	cover: {
		type: String
	}
});

var User = module.exports = mongoose.model('User', userSchema);

module.exports.getUser = function(username, password, callback) {
	var query = {username: username, password: password};
	User.findOne(query, callback);
};

module.exports.hasUser = function(username, password, callback) {
	var query = {username: username, password: password};
	User.count(query, callback);
}

module.exports.isUser = function(username, callback) {
	var query = {username: username};
	User.count(query, callback);
}

module.exports.isExistUser = function(username, email, callback) {
	var query = {$or : [ {username: username}, {email: email} ]};
	User.count(query, callback);
}

module.exports.getUserByUsername = function(username, callback) {
	var query = {username: username};
	User.findOne(query, callback);
}

module.exports.getUserById = function(id, callback) {
	var query = {_id : id};
	User.findOne(query, callback);
}

module.exports.getUserByEmail = function(email, callback) {
	var query = {email: email};
	User.findOne(query, callback);
};

module.exports.getAllUsers = function(callback) {
	var query = {};
	User.find(query, callback);
};

module.exports.addNewUser = function(user, callback) {
	var newUser = new User(user);
	newUser.save(callback);
}

module.exports.updateUser = function(username, newUser, callback) {
	var query = {username: username};
	User.update(query, newUser, callback);
}