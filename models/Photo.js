var mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');

const TEXT_BLANK = '';
const NUMB_MINUS_ONE = -1;
const NUMB_ZERO = 0;
const NUMB_ONE = 1;
const NUMB_ONE_HUNDRED = 100;



var photoSchema = mongoose.Schema({
	title: {
		type: String
	},
	description: {
		type: String
	},
	url: {
		type: String
	},
	love: {
		type: Number,
		min: NUMB_ZERO,
		default: NUMB_ZERO
	},
	owner: {
		name: {
			type: String
		},
		avatar: {
			type: String
		},
		id: {
			type: String
		}
	}
});

photoSchema.plugin(mongoosePaginate);
var Photo = module.exports = mongoose.model('Photo', photoSchema);

module.exports.getAllPhotos = function(callback) {
	var query = {};
	Photo.find(query, callback);
};

module.exports.getPhotosByOwner = function(ownerId, callback) {
	var query = {"owner.id" : ownerId};
	Photo.find(query, callback);
};

module.exports.getHotPhotos = function(callback) {
	var query = {love : {$gt: NUMB_ONE_HUNDRED}};
	Photo.find(query, callback);
};

module.exports.updateLike = function(number, postId, callback) {
	var query = {postId: postId};

	if(number == NUMB_ONE || number == NUMB_MINUS_ONE) {
	
		Photo.update(query, {$inc : {love: number}}, callback);

	}
	else {

		return callback(TEXT_BLANK);

	}
}