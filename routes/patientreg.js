var express = require('express');
var mongoose = require('mongoose');
var Patients =  require('../models/patients');


var patientreg = express.Router();


patientreg.route('/')
.get((req, res) => {
  res.render('regpatient');
})

.post((req, res) => {
  Patients.create(req.body)
  .then((patient) => {
    console.log("New Patient Registered Successfully! ");
    res.send('Registration Successful!');
})
});

module.exports = patientreg;
