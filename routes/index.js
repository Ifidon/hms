var express = require('express');
var router = express.Router();
var patientRouter = require('./patients.js');
var Patients = require('../models/patients');
var passport = require('passport');

var front_office = [];
var nurses_station = [];
var doctors_office = [];
var pharmlab = [];

var authorize = require('../authorize');

// function fdaccess (req, res, next) {
//   if(!req.user) {
//     res.redirect('/login')
//   }
//   else if(req.user.role == "Hospital Administrator") {
//     next()
//   }
//   else {
//     res.send('Not Authorized to view this page')
//   }
// };


// function nurseaccess (req, res, next) {
//   // console.log(req.user)
//   if(!req.user) {
//     res.redirect('/login')
//   }
//   else if(req.user.role == "Nurse") {
//     next()
//   }
//   else {
//     res.send('Not Authorized to view this page')
//   }
// };

// function draccess (req, res, next) {
//   // console.log(req.user)
//   if(!req.user) {
//     res.redirect('/login')
//   }
//   else if(req.user.role == "Doctor") {
//     next()
//   }
//   else {
//     res.send('Not Authorized to view this page')
//   }
// };

// function pharmlabaccess (req, res, next) {
//   // console.log(req.user)
//   if(!req.user) {
//     res.redirect('/login')
//   }
//   else if(req.user.role == "Pharmacist" ||  req.user.role == "Lab Technician") {
//     next()
//   }
//   else {
//     res.send('Not Authorized to view this page')
//   }
// };

/* GET home page. */

router.get('/', function(req, res, next) {
  res.render('homepage', {title: 'HealthMax: Welcome'})
})


router.post('/', (req, res) => {
  if (isNaN(req.body.search)) {
    var searchTerm = req.body.search;
    searchTerm = searchTerm.toUpperCase()
    console.log(searchTerm)
    Patients.find({lastname: searchTerm})
    .then((patients) => {
      console.log(patients)
        res.render('search_result', {patientlist: patients})
    })
  }
  else {
      Patients.find({patient_id: req.body.search})
      .then((patient) => {
          res.render('search_result', {patientlist: patient})
      })
  }
});

router.get('/login', function(req, res, next) {
  res.render('login', { title: 'HealthMax: Login' });
});

// router.post('/login', passport.authenticate('local'),
//   function(req, res) {
//     res.redirect('/registration')
//   });

router.route('/unauthorized')
.get((req, res, next) => {
  var user = req.user;
  res.render('unauthorized', {user, title: 'HealthMax: Access Denied'})
})

router.get('/front_desk', authorize.fdaccess, function(req, res) {
  res.render('front_desk', {patientlist: front_office, title: 'HealthMax: Front Desk'})
});

// router.post('/front_desk', function(req, res) {
//   Patients.find({patient_id: req.body.search})
//   .then((result) => {
//     // nurses_station.push(patient)
//     // console.log(req.params)
//     res.render('search_result', {patientlist: result})
//     front_office = result
//   })
// });

router.post('/front_desk/send/:patient_id', function(req, res) {
  Patients.findOne(req.params)
  .then((patient) => {
    console.log(req.params)
    nurses_station.push(patient)
    front_office.push(patient)
    // res.render('front_desk', {patientlist: nurses_station})
    res.redirect('/front_desk')
  })
});

router.route('/nurses_station')
.get(authorize.nurseaccess, (req, res) => {
  res.render('consultationList', {patientlist: nurses_station, title: 'HealthMax: Nurses Station'})
});

router.route('/nurses_station/:patient_id')
.post((req, res) => {
  Patients.findOne(req.params)
  .then((patient) => {
    patient.consultations.unshift(req.body)
    patient.save()
    doctors_office.push(patient)
    nurses_station.splice(nurses_station.indexOf(patient), 1)
    res.render('consultationList', {patientlist: nurses_station})
  })
});

router.route('/nurses_station/send/:patient_id')
.post((req, res) => {
  Patients.findOne(req.params)
  .then((patient) => {
    console.log(req.params)
    doctors_office.push(patient)
    nurses_station.splice(nurses_station.indexOf(patient), 1)
    res.redirect('/nurses_station')
  })
})

router.route('/doctors_office')
.get(authorize.draccess, (req, res) => {
  res.render('doctorslist', {patientlist: doctors_office, title: "Doctor's Office"})
});

router.route('/doctors_office/:patient_id')
.post((req, res) => {
  Patients.findOne(req.params)
  .then((patient) => {
    pharmlab.push(patient)
    doctors_office.splice(doctors_office.indexOf(patient), 1)
    res.redirect('/doctors_office')
  })
});

router.route('/pharmacy')
.get(authorize.pharmlabaccess, (req, res) => {
  res.render('pharmlablist', {patientlist: pharmlab, title: 'HealthMax: Pharmacy'})
})
.post((req, res, next) => {

});

router.route('/Laboratory')
.get(authorize.pharmlabaccess, (req, res) => {
  res.render('pharmlablist', {patientlist: pharmlab, title: 'HealthMax: Laboratory'})
})
.post((req, res, next) => {

});


module.exports = router;
