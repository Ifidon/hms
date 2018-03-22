var express = require('express');
var router = express.Router();
var patientRouter = require('./patients.js');
var Patients = require('../models/patients');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/', (req, res) => {
  if (isNaN(req.body.search)) {
    var searchTerm = req.body.search;
    searchTerm = searchTerm.charAt(0).toUpperCase() + searchTerm.slice(1);
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
  // Patients.find({$or: [{patient_id: req.body.search}, {lastname: req.body.search}]})
  // .then((patients) => {
  //   console.log(patients)
  //   res.send(patients)
  //   res.render('search_result', {data: patients})
  // })
});

module.exports = router;
