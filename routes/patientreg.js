var express = require('express');
var mongoose = require('mongoose');
var Patients =  require('../models/patients');


var patientreg = express.Router();

function grantaccess (req, res, next) {
	console.log(req.user)
	if(req.user.role == "Hospital Admininstrator" ||  req.user.role == "IT Admininstrator") {
		next()
	}
	else {
		res.send('Not Authorized to view this page')
	}
}

patientreg.use(grantaccess);


patientreg.route('/')
.get((req, res, next) => {
	console.log(req.user)
  res.render('regpatient');
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
