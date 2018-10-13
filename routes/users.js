var express = require('express');
var router = express.Router();
var User = require('../models/users');
var passport = require('passport');

var log = require('simple-node-logger').createSimpleLogger('hmslog.log');

var mailer = require('nodemailer');
var codes = require('../codes');

var transport = mailer.createTransport(codes.opts);

var authorize = require('../authorize');

/* GET users listing. */
router.get('/', authorize.admaccess, function(req, res, next) {
	var user = req.user
	User.find()
	.then((users) => {
		res.render('userlist', {users, title: 'Users', user})
	})
	.catch((error) => {
		next(err)
	})
});

router.get('/new', function(req, res, next) {
	var user = req.user
	if(err) {
		var err = err;
		next(err)
	}
	else {
		res.render('newuser', {user})
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

						var mailOptions = {
							from: 'neftilsngl@gmail.com',
							to: req.user.email,
							subject: 'Registration Successful - HealthMax',
							text: 'Hello ' + req.user.username + ' , your HeathMax Account has ben successfully created'
						};

						transport.sendMail(mailOptions);

						log.info('User @' + req.user.username + 'successfully created and logged In')


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
							res.redirect('/pharmacy')
						}
						if(user.role == "Lab Technician") {
							res.redirect('/laboratory')
						}
						if(user.role == "IT Administrator") {
							res.redirect('/front_desk')
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
  	log.info('User @' + req.user.username + ' successfully logged in')
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
		res.redirect('/front_desk')
	}
  });

router.route('/logout')
.get((req, res, next) => {
	var user = " "
  req.logout()
  res.render('homepage', {user})
})

  
module.exports = router;
