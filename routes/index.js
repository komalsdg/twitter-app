var express = require('express');

var Twitter = require('twitter');
var twitterConfig = require('../twitter.js');
var Tweet = require('../models/tweets');
var router = express.Router();

// twitter configuration
var tclient = new Twitter({
  consumer_key: twitterConfig.apikey,
  consumer_secret: twitterConfig.apisecret,
  access_token_key: twitterConfig.accesskey,
  access_token_secret: twitterConfig.accesssecret,
  screenname: twitterConfig.screenname
});


var isAuthenticated = function (req, res, next) {
	if (req.isAuthenticated())
		return next();
	res.redirect('/');
}

module.exports = function(passport){

	// GET Login
	router.get('/', function(req, res) {
		res.render('index', { message: req.flash('message') });
	});

	// POST Login 
	router.post('/login', passport.authenticate('login', {
		successRedirect: '/home',
		failureRedirect: '/',
		failureFlash : true  
	}));

	// GET Registration
	router.get('/signup', function(req, res){
		res.render('register',{message: req.flash('message')});
		
	});

	// POST Registration POST
	router.post('/signup', passport.authenticate('signup', {
		successRedirect: '/home',
		failureRedirect: '/signup',
		failureFlash : true  
	}));
	
	// Logout
	router.get('/signout', function(req, res) {
		req.logout();
		res.redirect('/');
	});
	
	// twitter login
	router.get('/login/twitter', 
		passport.authenticate('twitter'));

	// twitter authentication callback
	router.get('/twitter/oauth',
		passport.authenticate('twitter', {
			successRedirect : '/twitter',
			failureRedirect : '/'
		})
	);

	// GET twitter user information
	router.get('/twitter', isAuthenticated, function(req, res){
		res.render('twitter', { user: req.user });
	});
	
	// GET 10 tweets of user
	router.get('/tweet', isAuthenticated, function(req, res) {
		tclient.get('statuses/user_timeline', { screen_name: tclient.screenname, count: 10 }, function(error, tweets, response) {
			if (!error) {
			  res.render('tweet', { tweet: tweets });
			}
			else {
			  res.render('tweet', { error: error });
			}
		});
	});

	return router;
}





