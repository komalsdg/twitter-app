var TwitterStrategy  = require('passport-twitter').Strategy;
var User = require('../models/user');
var twitterConfig = require('../twitter.js');

module.exports = function(passport) {

    passport.use('twitter', new TwitterStrategy({
        consumerKey     : twitterConfig.apikey,
        consumerSecret  : twitterConfig.apisecret,
        callbackURL     : twitterConfig.callbackURL

    }, 
    function(token, tokenSecret, profile, done) {

       process.nextTick(function() {

	        User.findOne({ 'twitter.id' : profile.id }, function(err, user) {

	            if (err)
	                return done(err);

		         if (user) {
	                return done(null, user);
	            } else {
	                var newUser = new User();

					newUser.twitter.id = profile.id;
	                newUser.twitter.token = token;
	                newUser.twitter.username = profile.username;
	                newUser.twitter.displayName = profile.displayName;
	              
					newUser.save(function(err){
						if(err)
							res.send(err);
						else
							return done(null, newUser);
					});
					
	            }
	        });

		});

    }));

};
