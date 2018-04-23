var express = require('express');
var router = express.Router();
var patientRouter = require('./patients.js');
var Patients = require('../models/patients');

var front_office = [];
var nurses_station = [];
var doctors_office = [];

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'VDot HMS' });
});

router.post('/', (req, res) => {
  if (isNaN(req.body.search)) {
    var searchTerm = req.body.search;
    searchTerm = searchTerm.toUpperCase()
    console.log(searchTerm)
    Patients.find({lastname: searchTerm})
    .then((patients) => {
      console.log(patients)
        res.render('search_result', {data: patients})
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

router.post('/front_desk/:index', function(req, res) {
  nurses_station.push(front_office[req.params.index])
  // res.send(nurses_station)
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

router.route('/doctors_office')
.get((req, res) => {
  res.render('consultationList', {patientlist: doctors_office})
})

module.exports = router;
