var express = require('express');
var router = express.Router();
var patientRouter = require('./patients.js');
var Patients = require('../models/patients');

var front_office = [];
var nurses_station = [];
var doctors_office = [];
var pharmlab = [];

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'My HMS' });
});

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

router.get('/front_desk', function(req, res) {
  res.render('front_desk', {patientlist: nurses_station})
});

router.post('/front_desk', function(req, res) {
  Patients.find({patient_id: req.body.search})
  .then((result) => {
    // nurses_station.push(patient)
    // console.log(req.params)
    res.render('search_result', {patientlist: result})
    front_office = result
  })
});

router.post('/front_desk/send', function(req, res) {
  Patients.findOne(req.params).
  then((patient) => {
    nurses_station.push(patient)
  })
  res.render('front_desk', {patientlist: nurses_station})
});

router.route('/nurses_station')
.get((req, res) => {
  res.render('consultationList', {patientlist: nurses_station})
})

.post((req, res) => {
  Patients.findOne(req.params)
  .then((patient) => {
    patient.consultations.push(req.body)
    patient.save()
    doctors_office.push(patient)
    nurses_station.splice(patient)
    res.render('consultationList', {patientlist: nurses_station})
  })
});

router.route('/nurses_station/send')
.post((req, res) => {
  Patients.findOne(req.params).
  then((patient) => {
    doctors_office.push(patient)
    nurses_station.splice(patient)
  })
  res.render('consultationList', {patientlist: nurses_station})
})

router.route('/doctors_office')
.get((req, res) => {
  res.render('doctorslist', {patientlist: doctors_office})
})

.post((req, res) => {
  Patients.findOne(req.params.patient_id)
  .then((patient) => {
    var patientid = patient.patient_id
    var firstname = patient.firstname
    var lastname = patient.lastname
    var cons = patient.consultations.id(req.params._id)
    pharmlab.push(patient)
    doctors_office.splice(patient)
    res.render('doctorslist', {patientlist: doctors_office})
  })
});

router.route('/pharmacyandlab')
.get((req, res) => {
  res.render('pharmlablist', {patientlist: pharmlab})
})

module.exports = router;
