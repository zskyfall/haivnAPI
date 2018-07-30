var mongoose = require('mongoose');

var likeSchema = mongoose.Schema({
	userId: {
		type: String
	},
	postId: {
		type: String
	}
});

var Like = module.exports = mongoose.model('Like', likeSchema);

module.exports.addLike = function(userId, postId, callback) {
	
	var like = new Like({
		userId: userId,
		postId: postId
	});

	like.save(callback);
}

module.exports.hasLike = function(userId, postId, callback) {
	var query = {userId: userId, postId: postId};
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

module.exports.removeLike = function(userId, postId, callback) {
	var query = {userId: userId, postId: postId}
	Like.remove(query, callback);
}
