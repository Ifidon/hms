var express = require('express');
var mongoose = require('mongoose');
var Patients =  require('../models/patients');


var patientreg = express.Router();

function grantaccess (req, res, next) {
	if(req.user.role == "Hospital Administrator" ||  req.user.role == "IT Administrator") {
		next()
	}
	else {
		res.send('Not Authorized to view this page')
	}
}

patientreg.use(grantaccess);


patientreg.route('/')
.get((req, res, next) => {
  var user = req.user
	console.log(user)
  res.render('regpatient', user);
})

.post((req, res, next) => {
  Patients.create(req.body)
  	.then((patient) => {
    	console.log("New Patient Registered Successfully! ");
   		res.send('Registration Successful!');
	})
  	.catch((error) => {
   		if (error) {
   			next(error)
   		}
   })
});


module.exports = patientreg;
