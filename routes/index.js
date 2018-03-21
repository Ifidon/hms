var express = require('express');
var router = express.Router();
var patientRouter = require('./patients.js');
var Patients = require('../models/patients');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/', (req, res) => {
  Patients.find({patient_id: req.body.search})
  .then((patients) => {
    console.log(patients)
    // res.send(patient[patient_id]
    res.render('search_result', {data: patients})
  })
});

module.exports = router;
