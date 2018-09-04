var express = require('express');
var mongoose = require('mongoose');
var Patients =  require('../models/patients');

var authorize = require('../authorize');


var patientRouter = express.Router();

// function itadmaccess (req, res, next) {
//   console.log(req.user)
//   if(req.user.role == "IT Administrator") {
//     next()
//   }
//   else {
//     res.send('Not Authorized to view this page')
//   }
// }

// patientRouter.use(itadmaccess)


patientRouter.route('/')
.get(authorize.fdaccess, (req, res) => {
  Patients.find()
  .then((patients) => {
    res.render('patientslist', {patientlist: patients.reverse()})
  })
});

patientRouter.route('/registration')
.get(authorize.fdaccess, (req, res) => {
  res.render('regpatient');
})

.post((req, res) => {
  Patients.create(req.body)
  .then((patient) => {
    // console.log("New Patient Registered Successfully! ");
    res.redirect('/patients');
})
});

patientRouter.route('/:patient_id')
.get(authorize.fdaccess, (req, res) => {
  Patients.find({patient_id: req.params.patient_id})
  .then((patient) => {
    res.render('patientview', {patient_details: patient})
  })
});

patientRouter.route('/:patient_id/update')
.get(authorize.fdaccess, (req, res) => {
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

patientRouter.route('/:patient_id/recordvitals')
.get(authorize.nurseaccess, (req, res) => {
  Patients.findOne(req.params)
  .then((patient) => {
    console.log(req.params)
    res.render('recordVitals', {patient})
  })
  
})


patientRouter.route('/:patient_id/consultations')
.get(authorize.draccess, (req, res) => {
  Patients.findOne(req.params)
  .then((patient) => {
    res.render('consultations', {patient})
    // console.log(res.header)
  })
  })

  .post((req, res) => {
      Patients.findOne(req.params)
      .then((patient) => {
        patient.consultations.unshift(req.body)
        patient.save()
        res.redirect('/patients/' + patient.patient_id)
      })
  });

  patientRouter.route('/:patient_id/consultations/:consultation_id')
  .get(authorize.draccess, (req, res) => {
    Patients.findOne({patient_id: req.params.patient_id})
    .then((patient) => {
      if (patient.consultations.id(req.params.consultation_id).prescription) {
        var consultation = patient.consultations.id(req.params.consultation_id)
      }
      else {
        var consultation = patient.consultations.id(req.params.consultation_id)
        consultation.prescription = Object;
        consultation.labInvestigation = Object;
      }
        
        console.log(consultation)
        res.render('consultation', {patient, consultation})
    })
  })

  .post((req, res) => {
    Patients.findOne({patient_id: req.params.patient_id})
    .then((patient) => {
      var consultation = patient.consultations.id(req.params.consultation_id)
      consultation.doctorsNote = req.body.doctorsNote
      consultation.prescription = {}
      consultation.labInvestigation = {}
      consultation.prescription.drugs = req.body.drugs
      consultation.labInvestigation.tests = req.body.tests
      // if (consultation.prescription && consultation.labInvestigation) {
      //   consultation.prescription = new {}
      //   consultation.labInvestigation = new {}
      //   consultation.prescription.drugs = req.body.drugs
      //   consultation.labInvestigation.tests = req.body.tests
      // }
      // else {
      //   consultation.prescription.drugs = req.body.drugs
      //   consultation.labInvestigation.tests = req.body.tests
      // } 
      
      patient.save()
      // res.send(consultation)
      console.log(consultation)
      res.render('consultation', {patient, consultation})
    })
  })

  patientRouter.route('/:patient_id/consultations/:consultation_id/pharmacy')
  .get((req,res) => {
    Patients.findOne({patient_id: req.params.patient_id})
    .then((patient) => {
      var consultation = patient.consultations.id(req.params.consultation_id)
      // console.log(consultation.prescription)
      res.render('pharmacy', {patient, consultation})
    })
  })
//
  .post((req, res) => {
    Patients.findOne({patient_id: req.params.patient_id})
    .then((patient) => {
      // console.log(patient.firstname)
      var consultation = patient.consultations.id(req.params.consultation_id)
      consultation.prescription.cost = req.body.prescriptionCost
      consultation.prescription.amountPaid = req.body.prescriptionAmtPaid
      consultation.prescription.balance = req.body.prescriptionBal
      patient.save()
      res.render('pharmacy', {patient, consultation})
      // res.send(req.body)
      // console.log(consultation)
  })
});
//
patientRouter.route('/:patient_id/consultations/:consultation_id/lab')
.post((req, res) => {
  Patients.findOne({patient_id: req.params.patient_id})
  .then((patient) => {
    // console.log(patient.firstname)
    var consultation = patient.consultations.id(req.params.consultation_id)
    consultation.labInvestigation.cost = req.body.labCost
    consultation.labInvestigation.amountPaid = req.body.labAmtPaid
    consultation.labInvestigation.balance = req.body.labBal
    patient.save()
    res.render('pharmacy', {patient, consultation})
    // res.send("success!!")
    // console.log(consultation.labInvestigation)
})
});
//
//
module.exports = patientRouter;
