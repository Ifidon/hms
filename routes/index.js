var express = require('express');
var router = express.Router();
var patientRouter = require('./patients.js');
var Patients = require('../models/patients');


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
          res.render('search_result', {data: patient})
      })
  }
});

router.get('/front_desk', function(req, res) {
  res.render('front_desk', {patientlist: nurses_station})
});

router.post('/front_desk', function(req, res) {
  Patients.findOne({patient_id: req.body.search})
  .then((patient) => {
    nurses_station.push(patient)
    console.log(nurses_station)
    res.render('front_desk', {patientlist: nurses_station})
  })
});


router.route('/nurses_station')
.get((req, res) => {
  res.render('consultationList', {patientlist: nurses_station})
})

.post((req, res) => {
  console.log(req.params)
})

module.exports = router;
