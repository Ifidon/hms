var express = require('express');
var router = express.Router();
var patientRouter = require('./patients.js');
var Patients = require('../models/patients');
var passport = require('passport');

var front_office = [];
var nurses_station = [];
var doctors_office = [];
var pharmacy_list = [];
var laboratory_list = [];

var authorize = require('../authorize');
var codes = require('../codes');


/* GET home page. */

router.get('/', function(req, res, next) {
  res.render('homepage', {title: 'Welcome - HealthMax'})
})


router.post('/', (req, res) => {
  if (isNaN(req.body.search)) {
    var searchTerm = req.body.search;
    searchTerm = searchTerm.toUpperCase()
    console.log(searchTerm)
    Patients.find({lastname: searchTerm})
    .then((patients) => {
      console.log(patients)
        res.render('search_result', {patientlist: patients, title: 'Search Results - ' + searchTerm})
    })
    .catch((error) => {
      next(error)
    })
  }
  else {
      Patients.find({patient_id: req.body.search})
      .then((patient) => {
          res.render('search_result', {patientlist: patient, title: 'Search Results'})
      })
      .catch((error) => {
        next(error)
      })
  }
});

router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Login - HealthMax' });
});

router.route('/unauthorized')
.get((req, res, next) => {
  var user = req.user;
  res.render('unauthorized', {user, title: 'Access Denied - HealthMax'})
})

router.get('/authentication_failed', (req, res, next) => {
  res.render('authfail', {title: 'Authentication Failed - HealthMax'})
});

router.get('/front_desk', authorize.fdaccess, function(req, res) {
  res.render('front_desk', {patientlist: front_office, title: 'Front Desk - HealthMax'})
});

router.post('/front_desk/send/:patient_id', function(req, res, next) {
  Patients.findOne(req.params)
  .then((patient) => {
      if (codes.check(nurses_station, patient)) {
        res.render('patientview', {patient, message: "Patient already sent to Nurses' Station"})
      }
      else {
        nurses_station.push(patient)
        front_office.push(patient)
        res.redirect('/front_desk')
      }    
  })
  .catch((error) => {
    next(error)
  })
});

router.route('/nurses_station')
.get(authorize.nurseaccess, (req, res) => {
  var message = ""
  res.render('consultationList', {patientlist: nurses_station, title: 'Nurses Station - HealthMax', message: req.message})
});

router.route('/nurses_station/:patient_id')
.post((req, res, next) => {
  var message = ""
  Patients.findOne(req.params)
  .then((patient) => {
    if ((codes.consultlimit(patient.consultations)) && (codes.check(doctors_office, patient))) {
      nurses_station.splice(nurses_station.indexOf(patient), 1)
      res.render('consultationList', {patientlist: nurses_station, message: "Entry already exixts"})
    }
    if ((codes.consultlimit(patient.consultations)) && (!codes.check(doctors_office, patient))) {
      doctors_office.push(patient)
      nurses_station.splice(nurses_station.indexOf(patient), 1)
      res.render('consultationList', {patientlist: nurses_station, message: "Existing entry has been sent to the Doctor's Office"})
    }
    else {
      patient.consultations.unshift(req.body)
      patient.save()
      doctors_office.push(patient)
      nurses_station.splice(nurses_station.indexOf(patient), 1)
      res.render('consultationList', {patientlist: nurses_station, message: "Entry created and sent to the Doctor"})
    }
  })
  .catch((error) => {
    next(error)
  })
});

router.route('/nurses_station/send/:patient_id')
.post((req, res, next) => {
  Patients.findOne(req.params)
  .then((patient) => {
    if(codes.check(doctors_office, patient)) {
      nurses_station.splice(nurses_station.indexOf(patient), 1)
      res.redirect('/nurses_station')
    }
    else {
      doctors_office.push(patient)
      nurses_station.splice(nurses_station.indexOf(patient), 1)
      console.log(res)
      res.redirect('/nurses_station')
    }
  })
  .catch((error) => {
    next(error)
  })
})

router.route('/doctors_office')
.get(authorize.draccess, (req, res) => {
  res.render('doctorslist', {patientlist: doctors_office, title: "Doctor's Office - HealthMax"})
});

router.route('/doctors_office/:patient_id')
.post((req, res) => {
  Patients.findOne(req.params)
  .then((patient) => {
    pharmacy_list.push(patient);
    laboratory_list.push(patient);
    doctors_office.splice(doctors_office.indexOf(patient), 1);
    res.redirect('/doctors_office');
  })
  .catch((error) => {
    next(error)
  })
});

router.route('/pharmacy')
.get(authorize.pharmacyaccess, (req, res, next) => {
  res.render('pharmacylist', {patients: pharmacy_list, title: 'Pharmacy - HealthMax', user: req.user})
})
.post((req, res, next) => {

});

router.route('/Laboratory')
.get(authorize.labaccess, (req, res, next) => {
  res.render('lablist', {patients: laboratory_list, title: 'Laboratory - HealthMax', user: req.user})
})
.post((req, res, next) => {

});


module.exports = router;
