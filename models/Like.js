var mongoose = require('mongoose');

var likeSchema = mongoose.Schema({
	username: {
		type: String
	},
	postId: {
		type: String
	}
});

var Like = module.exports = mongoose.model('Like', likeSchema);

module.exports.addLike = function(username, postId, callback) {
	
	var like = new Like({
		username: username,
		postId: postId
	});

	like.save(callback);
}

module.exports.hasLike = function(username, postId, callback) {
	var query = {username: username, postId: postId};
	Like.count(query, (err, count) => {
		if(err) {
			return callback(false);
		}
		else {
			if(count == 1) {
				callback(true);
			}
			else {
				callback(false);
			}
		}
	});
}

module.exports.removeLike = function(username, postId, callback) {
	var query = {username: username, postId: postId}
	Like.remove(query, callback);
}
