var express = require('express');
var router = express.Router();
var patientRouter = require('./patients.js');
var Patients = require('../models/patients');

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
      .then((patients) => {
        console.log(patients)
          res.render('search_result', {data: patients})
      })
  }
});

router.post('/todays_patients', function(req, res) {
  var visitors = []
  Patients.findOne(req.params)
  .then((patient) => {
    visitors.push(patient)
    console.log(visitors)
    res.render('consultationlist', {patientlist: visitors})
  })

})

module.exports = router;
