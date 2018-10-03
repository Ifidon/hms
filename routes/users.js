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
		User.register(new User({firstname: req.body.firstname, lastname: req.body.lastname, email: req.body.email, username: req.body.username, role: req.body.role}), 
			req.body.password, function(err, user) {
				if (err) {
					next(err)
				}
				else {
					passport.authenticate('local')(req, res, () => {

						var user = req.user
						if(user.role == "Doctor") {
							res.redirect('/doctors_office')
						}
						if(user.role == "Nurse") {
							res.redirect('/nurses_station')
						}
						if(user.role == "Hospital Administrator") {
							res.redirect('/front_desk')
						}
						if(user.role == "Pharmacist") {
							res.redirect('/pharmacyandlab')
						}
						if(user.role == "Lab Technician") {
							res.redirect('/pharmacyandlab')
						}
						if(user.role == "IT Administrator") {
							res.redirect('/registration')
						}						
							// res.redirect('/registration')
					})
				}
		})
	}
});

router.post('/login', passport.authenticate('local', {
	failureRedirect: '/authentication_failed'
}),
  function(req, res, next) {
	var user = req.user
	if(user.role == "Doctor") {
		res.redirect('/doctors_office')
	}
	if(user.role == "Nurse") {
		res.redirect('/nurses_station')
	}
	if(user.role == "Hospital Administrator") {
		res.redirect('/front_desk')
	}
	if(user.role == "Pharmacist") {
		res.redirect('/pharmacyandlab')
	}
	if(user.role == "Lab Technician") {
		res.redirect('/pharmacyandlab')
	}
	if(user.role == "IT Administrator") {
		res.redirect('/registration')
	}
  });

  
module.exports = router;
