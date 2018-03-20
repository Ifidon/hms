var express = require('express');
var mongoose = require('mongoose');
var Patients =  require('../models/patients');


var patientRouter = express.Router();


patientRouter.route('/')
.get((req, res) => {
  Patients.find()
  .then((patients) => {
    res.render('patientslist', {patientlist: patients.reverse()})
  })
});

patientRouter.route('/registration')
.get((req, res) => {
  res.render('regpatient');
})

.post((req, res) => {
  Patients.create(req.body)
  .then((patient) => {
    console.log("New Patient Registered Successfully! ");
    res.redirect('/patients');
})
});

patientRouter.route('/:patient_id')
.get((req, res) => {
  Patients.find({patient_id: req.params.patient_id})
  .then((patient) => {
    res.render('patientview', {patient_details: patient})
  })
});

patientRouter.route('/:patient_id/update')
.get((req, res) => {
  Patients.find({patient_id: req.params.patient_id})
  .then((patient) => {
    res.render('update', {patient_details: patient})
    console.log(patient)
  })
})

.post((req, res) => {
  Patients.updateOne({patient_id: req.params.patient_id}, {$set: req.body})
  .then((patient) => {
    console.log(patient)
    res.redirect('/patients')
  })

});

patientRouter.route('/:patient_id/consultations')
.get((req, res) => {
  Patients.findOne(req.params)
  .then((patient) => {
    res.send(patient)
    console.log(res.header)
  })
  })

  .post((req, res) => {
      Patients.findOne(req.params)
      .then((patient) => {
        patient.consultations.push(req.body)
        patient.save()
        res.send(patient.consultations)
      })
  })


module.exports = patientRouter;
