var express = require('express');
var mongoose = require('mongoose');
var Patients =  require('../models/patients');
var fs = require('fs');


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

// patientreg.use(grantaccess);


patientreg.route('/')
.get((req, res, next) => {
	console.log(req.user)
  res.render('regpatient');
})

.post((req, res, next) => {
  Patients.create(req.body)
  	.then((patient) => {
  		patient.image.data = fs.readFileSync(req.body.image);
  		patient.image.contentType = 'image/jpg';
  		patient.save()
  		.then((fullpatient) => {
  			res.render('patientview', {patient_details: fullpatient});
  		})
    	console.log("New Patient Registered Successfully! ");
    	// res.send(patient)
   		
	})
  	.catch((error) => {
   		if (error) {
   			next(error)
   		}
   })
});


patientreg.get('/:id', function(req, res) {
	Patients.findOne(req.params)
	.then((patient) => {

	})
})


module.exports = patientreg;
