var express = require('express');
var router = express.Router();
var User = require('../models/users');
var passport = require('passport')

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/new', function(req, res, next) {
	if(err) {
		var err = err;
		next(err)
	}
	else {
		res.render('newuser')
	}
});

router.post('/new', function(req, res, next) {
	if(err) {
		var err = err;
		next(err)
	}
	else {
		User.register(new User({firstname: req.body.firstname, lastname: req.body.lastname, username: req.body.username, role: req.body.role}), 
			req.body.password, function(err, user) {
				if (err) {
					next(err)
				}
				else {
					passport.authenticate('local', {successFlash: 'Welcome', failureFlash: 'Registration failed'})(req, res, () => {
						console.log(user)
						res.redirect('/registration')
					})
				}
		})
	}
});

router.post('/login', passport.authenticate('local'),
  function(req, res) {
    res.redirect('/registration')
  });

  
module.exports = router;
