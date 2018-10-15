
var mongoose = require('mongoose');

module.exports = mongoose.model('Tweets',{
	tweet: {
		id: String,
		userid: String,
		tweetext: String
	}
});