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
var pending = [];

var authorize = require('../authorize');
var codes = require('../codes');


/* GET home page. */

router.get('/', function(req, res, next) {
  var user = " "
  res.render('homepage', {user, title: 'Welcome - HealthMax'})
})


router.post('/', (req, res, next) => {
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
  var user = ""
  res.render('login', {user, title: 'Login - HealthMax' });
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
  var user = req.user
  res.render('front_desk', {title: 'Front Desk - HealthMax', user})
});

router.get('/front_desk/patientadmin', authorize.fdaccess, function(req, res, next) {
  var user = req.user
  res.render('patientadmin', {patientlist: front_office, user, title: 'Patient Administration - HealthMax', user})
});

router.get('/front_desk/useradmin', authorize.fdaccess, function(req, res, next) {
  var user = req.user
  res.render('newuser', {patientlist: front_office, user, title: 'Patient Administration - HealthMax', user})
});

router.post('/front_desk/send/:patient_id', function(req, res, next) {
  var user = req.user
  Patients.findOne(req.params)
  .then((patient) => {
      if (codes.check(nurses_station, patient) && codes.check(front_office, patient)) {
        res.render('patientview', {patient, user, message: "Entry already exists in nurses station"})
      }
      if (!codes.check(nurses_station, patient) && codes.check(front_office, patient)) {
        nurses_station.push(patient)
        res.render('patientview', {patient, user, message: "Entry sent to nurses station"})
      }
      if(!codes.check(nurses_station, patient) && !codes.check(front_office, patient)) {
        nurses_station.push(patient)
        front_office.push(patient)
        res.redirect('/front_desk/patientadmin')
      } 
      console.log(codes.check(nurses_station, patient))   
  })
  .catch((error) => {
    next(error)
  })
});

router.route('/nurses_station')
.get(authorize.nurseaccess, (req, res) => {
  var user = req.user
  var message = ""
  res.render('consultationList', {patientlist: nurses_station, user, title: 'Nurses Station - HealthMax', message: req.message})
});

router.route('/nurses_station/:patient_id')
.post((req, res, next) => {
  var user = req.user
  var message = ""
  Patients.findOne(req.params)
  .then((patient) => {
    if ((codes.consultlimit(patient.consultations)) && (codes.check(doctors_office, patient))) {
      nurses_station.splice(nurses_station.indexOf(patient), 1)
      res.render('consultationList', {patientlist: nurses_station, user, message: "Entry already exixts"})
    }
    if ((codes.consultlimit(patient.consultations)) && (!codes.check(doctors_office, patient))) {
      doctors_office.push(patient)
      nurses_station.splice(nurses_station.indexOf(patient), 1)
      res.render('consultationList', {patientlist: nurses_station, user, message: "Existing entry has been sent to the Doctor's Office"})
    }
    else {
      patient.consultations.unshift(req.body)
      patient.save()
      doctors_office.push(patient)
      nurses_station.splice(nurses_station.indexOf(patient), 1)
      res.render('consultationList', {patientlist: nurses_station, user, message: "Entry created and sent to the Doctor"})
    }
  })
  .catch((error) => {
    next(error)
  })
});

router.route('/nurses_station/send/:patient_id')
.post((req, res, next) => {
  var user = req.user
  Patients.findOne(req.params)
  .then((patient) => {
    if(codes.check(doctors_office, patient)) {
      nurses_station.splice(nurses_station.indexOf(patient), 1)
      var message = ""
      res.render('consultationList', {patientlist: nurses_station, user, title: 'Nurses Station - HealthMax', message: "Entry already sent to the doctor's office"})
    }
    else {
      doctors_office.push(patient)
      nurses_station.splice(nurses_station.indexOf(patient), 1)
      // console.log(res)
      res.redirect('/nurses_station')
    }
  })
  .catch((error) => {
    next(error)
  })
})

router.route('/doctors_office')
.get(authorize.draccess, (req, res) => {
  var user = req.user
  res.render('doctorslist', {patientlist: doctors_office, user, title: "Doctor's Office - HealthMax"})
});

router.route('/doctors_office/:patient_id/:consultation_id')
.post((req, res, next) => {
  var user = req.user
  Patients.findOne({patient_id: req.params.patient_id}, {firstname: 1, lastname: 1, patient_id: 1, consultations: {$elemMatch: {_id: req.params.consultation_id}}})
  .then((patient) => {
    var message=" "
    var consultation = patient.consultations[0]

    if(!codes.check(pharmacy_list, patient) && !codes.check(laboratory_list, patient)) {
      pharmacy_list.push(patient);
      laboratory_list.push(patient);
      doctors_office.splice(pharmacy_list.indexOf(patient), 1)
      console.log(patient)
      res.render('doctorslist', {patientlist: doctors_office, user, title: "Doctor's Office - HealthMax", message: "Entry Sent."})
    }

    if (codes.checkdate(laboratory_list, consultation) && codes.checkdate(pharmacy_list, consultation)) {
      // doctors_office.splice(pharmacy_list.indexOf(patient), 1)
      res.render('doctorslist', {patientlist: doctors_office, user, title: "Doctor's Office - HealthMax", message: "Entry already exists."})
    }

    if (codes.check(pharmacy_list, patient) && codes.check(laboratory_list, patient)) {
      doctors_office.splice(pharmacy_list.indexOf(patient), 1)
      res.render('doctorslist', {patientlist: doctors_office, user, title: "Doctor's Office - HealthMax", message: "Entry already exists."})
    }

    if (codes.check(pharmacy_list, patient) && !codes.check(laboratory_list, patient)) {
      laboratory_list.push(patient)
      res.render('doctorslist', {patientlist: doctors_office, user, title: "Doctor's Office - HealthMax", message: "Sent to lab. Entry already exists in pharmacy."})
    }

    if (!codes.check(pharmacy_list, patient) && codes.check(laboratory_list, patient)) {
      pharmacy_list.push(patient)
      res.render('doctorslist', {patientlist: doctors_office, user, title: "Doctor's Office - HealthMax", message: "Sent to pharmacy. Entry already exists in lab."})
    }    
  })
  .catch((error) => {
    next(error)
  })
});

router.route('/pharmacy')
.get(authorize.pharmacyaccess, (req, res, next) => {
  var user = req.user
  res.render('pharmacylist', {patients: pharmacy_list, user, title: 'Pharmacy - HealthMax', user: req.user})
});

router.route('/pharmacy/:patient_id')
.post((req, res, next) => {
  var user = req.user
  Patients.findOne(req.params)
  .then((patient) => {
    pharmacy_list.splice(pharmacy_list.indexOf(patient), 1)
    res.redirect('/pharmacy')
  })
});

router.route('/Laboratory')
.get(authorize.labaccess, (req, res, next) => {
  var user = req.user
  res.render('lablist', {patients: laboratory_list, pending, user, title: 'Laboratory - HealthMax', user: req.user})
});

router.route('/laboratory/:patient_id/:consultation_id')
.post((req, res, next) => {
  Patients.findOne({patient_id: req.params.patient_id}, {firstname: 1, lastname: 1, patient_id: 1, consultations: {$elemMatch: {_id: req.params.consultation_id}}})
  .then((patient) => {
    pending.push(patient)
    laboratory_list.splice(pharmacy_list.indexOf(patient), 1)
    res.redirect('/laboratory')
  })
});

router.route('/laboratory/:patient_id/findings')
.post((req, res, next) => {
  Patients.findOne(req.params)
  .then((patient) => {
    pending.splice(pharmacy_list.indexOf(patient), 1)
    res.redirect('/laboratory')
  })
});

router.route('/consultationlist')
.get(authorize.genaccess, (req, res, next) => {
  var user = req.user
  var message = " "
  res.render('current', {patientlist: front_office, user, title: 'Ongoing patient visits', message: "Today's History"})
})






module.exports = router;
