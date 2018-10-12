var express = require('express');
var mongoose = require('mongoose');
var Patients =  require('../models/patients');

var authorize = require('../authorize');


var patientRouter = express.Router();


var fs = require('fs');


var multer = require('multer');

var storage = multer.diskStorage({
  destination: (rea, file, cb) => {
    cb(null, 'public/images/patients');
  },
  // filename: (req, file, cb) => {
  //  cb(null, file.originalname)
  // }
});

var docstore = multer.diskStorage({
  destination: (rea, file, cb) => {
    cb(null, 'attachments');
  }
});

var imageFileFilter = (req, file, cb, err) => {
  if(!file.originalname.match(/\.(jpg|jpeg|png|gif|JPG|JPEG|PNG|GIF)$/)) {
    return cb(new Error('Only Image files allowed!'))
    next(err)
    
  }
  cb(null, true)
};

var docFileFilter = (req, file, cb, err) => {
  if(!file.originalname.match(/\.(doc|docx|pdf|jpeg|jpg|JPG|JPEG|PDF|DOCX|DOC)$/)) {
    return cb(new Error('Only Image files allowed!'))
    next(err)
    
  }
  cb(null, true)
};

var upload = multer({
  storage: storage,
  fileFilter: imageFileFilter
});

var savefile = multer({
  storage: docstore,
  fileFilter: docFileFilter
});

patientRouter.route('/')
.get(authorize.fdaccess, (req, res, next) => {
  var user = req.user
  Patients.find()
  .then((patients) => {
    res.render('patientslist', {patientlist: patients.reverse(), user, title: 'All Patients - HealthMax'})
  })
  .catch((error) => {
    next(error)
  })
});

patientRouter.route('/registration')
.get(authorize.fdaccess, (req, res, next) => {
  var user = req.user
  Patients.find({}, {patient_id: 1, _id: 0})
  .then((ids) => {
    res.render('regpatient', {ids, user, title: 'Patient Registration - HealthMax'});
    console.log(Object.values(ids))
  })
  .catch((error) => {
    next(error)
  })
})

.post(upload.single('passport'), (req, res, next) => {
  Patients.create(req.body)
  .then((patient) => {
    if (req.file) {
      patient.set({photourl: req.file.path.slice(6), picture: {
        data: fs.readFileSync(req.file.path),
        contentType: 'image/jpg'
      }})
      patient.save()
    }
    else {
      patient.set({photourl: './public/images/defaultuser.jpg', picture: {
        data: fs.readFileSync('./public/images/defaultuser.jpg'),
        contentType: 'image/jpg'
      }})
      patient.save()
    }
    res.redirect('/patients');
  })
  .catch((error) => {
    next(error)
  })
});

patientRouter.route('/:patient_id')
.get(authorize.fdaccess, (req, res, next) => {
  var user = req.user
  Patients.findOne({patient_id: req.params.patient_id})
  .then((patient) => {
    res.render('patientview', {patient, user, message: " ", title: patient.firstname + " " + patient.lastname + ' - HealthMax'})
  })
  .catch((error) => {
    next(error)
  })
});

patientRouter.route('/:patient_id/update')
.get(authorize.fdaccess, (req, res, next) => {
  var user = req.user
  Patients.findOne({patient_id: req.params.patient_id})
  .then((patient) => {
    res.render('update', {patient, user, title: 'Update Patient Details - HealthMax'})
    log.info("New Patient Registration. ID: " + patient.patient_id)
  })
  .catch((error) => {
    next(error)
  })
})

.post((req, res, next) => {
  Patients.updateOne({patient_id: req.params.patient_id}, {$set: req.body})
  .then((patient) => {
    // console.log(patient)
    res.redirect('/patients')
  })
  .catch((error) => {
    next(error)
  })

});

patientRouter.route('/:patient_id/recordvitals')
.get(authorize.nurseaccess, (req, res, next) => {
  var user = req.user
  Patients.findOne(req.params)
  .then((patient) => {
    // console.log(req.params)
    res.render('recordVitals', {patient, user, title: 'Record Vitals - HealthMax'})
  })
  .catch((error) => {
    next(error)
  })
  
});

patientRouter.route('/:patient_id/consultations')
  .get(authorize.draccess, (req, res, next) => {
    var user = req.user
    Patients.findOne(req.params)
    .then((patient) => {
      res.render('consultations', {patient, user, title: 'View/Edit Consultations - HealthMax'})
      // console.log(res.header)
    })
    .catch((error) => {
      next(error)
    })
  })

  .post((req, res, next) => {
      Patients.findOne(req.params)
      .then((patient) => {
        patient.consultations.unshift(req.body)
        patient.save()
        res.redirect('/patients/' + patient.patient_id)
      })
      .catch((error) => {
        next(error)
      })
  });

  patientRouter.route('/:patient_id/consultations/:consultation_id')
  .get(authorize.draccess, (req, res, next) => {
    var user = req.user
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
        res.render('consultation', {patient, consultation, user, title: 'Consultation - HealthMax'})
    })
    .catch((error) => {
       next(error)
    })
  })

  .post((req, res, next) => {
    var user = req.user
    Patients.findOne({patient_id: req.params.patient_id})
    .then((patient) => {
      var consultation = patient.consultations.id(req.params.consultation_id)
      consultation.doctorsNote = req.body.doctorsNote
      consultation.prescription = {}
      consultation.labInvestigation = {}
      consultation.prescription.drugs = req.body.drugs
      consultation.labInvestigation.tests = req.body.tests      
      patient.save()
      res.render('consultation', {patient, consultation, user})
    })
    .catch((error) => {
      next(error)
    })
  });

  patientRouter.route('/:patient_id/consultations/:consultation_id/pharmacy')
  .get((req,res, next) => {
    var user = req.user
    Patients.findOne({patient_id: req.params.patient_id})
    .then((patient) => {
      var consultation = patient.consultations.id(req.params.consultation_id)
      // console.log(consultation.prescription)
      res.render('pharmacy', {patient, consultation, user, title: 'Pharmacy Entries - HealthMax'})
    })
    .catch((error) => {
      next(error)
    })
  })
//
  .post((req, res, next) => {
    var user = req.user
    Patients.findOne({patient_id: req.params.patient_id})
    .then((patient) => {
      var consultation = patient.consultations.id(req.params.consultation_id)
      consultation.prescription.cost = req.body.cost
      consultation.prescription.amountPaid = req.body.amountPaid
      consultation.prescription.balance = req.body.balance
      patient.save()
      res.render('pharmacy', {patient, consultation, user, title: 'Pharmacy Entries - HealthMax'})
    })
    .catch((error) => {
      next(error)
    })
  });
//
patientRouter.route('/:patient_id/consultations/:consultation_id/laboratory')
.get((req, res, next) => {
  var user = req.user
  Patients.findOne({patient_id: req.params.patient_id})
    .then((patient) => {
      var consultation = patient.consultations.id(req.params.consultation_id)
      // console.log(consultation.prescription)
      res.render('medlab', {patient, consultation, user, title: 'Laboratory Entries - HealthMax'})
    })
    .catch((error) => {
      next(error)
    })
})
.post((req, res) => {
  var user = req.user
  Patients.findOne({patient_id: req.params.patient_id})
  .then((patient) => {
    var consultation = patient.consultations.id(req.params.consultation_id)
    consultation.labInvestigation.cost = req.body.cost
    consultation.labInvestigation.amountPaid = req.body.amountPaid
    consultation.labInvestigation.balance = req.body.balance
    patient.save()
    // console.log(req.body)
    res.render('medlab', {patient, consultation, user, title: 'Laboratory Entries - HealthMax'})
    // console.log(consultation.labInvestigation)
  })
  .catch((error) => {
      next(error)
  })
});

patientRouter.route('/:patient_id/consultations/:consultation_id/laboratory/findings')
.get( (req, res, next) => {
  var user = req.user
  Patients.findOne({patient_id: req.params.patient_id})
  .then((patient) => {
    var consultation = patient.consultations.id(req.params.consultation_id)
    res.render('findings', {patient, consultation, user, title: 'Enter Lab Results - HealthMax'})
  })
  .catch((error) => {
    next(error)
  })
})

.post(savefile.single('attachment'), (req, res, next) => {
  var user = req.user
  Patients.findOne({patient_id: req.params.patient_id})
  .then((patient) => {
    if (!req.file) {
      var consultation = patient.consultations.id(req.params.consultation_id)
      consultation.labInvestigation.attachment = "No file uploaded"
      consultation.labInvestigation.findings = req.body.findings
      patient.save()
      res.render('findings', {patient, consultation, user, title: 'Enter Lab Results - HealthMax'})
    }
    else {
      var consultation = patient.consultations.id(req.params.consultation_id)
      consultation.labInvestigation.attachment = req.file.path
      consultation.labInvestigation.findings = req.body.findings
      patient.save()
      res.render('findings', {patient, consultation, user, title: 'Enter Lab Results - HealthMax'})
    }
    
    // console.log(consultation.labInvestigation)
  })
  .catch((error) => {
      next(error)
  })
});

patientRouter.route('/:patient_id/consultations/:consultation_id/laboratory/findings/review')
.get((req, res, next) => {
  var user = req.user
  Patients.findOne({patient_id: req.params.patient_id}, {firstname: 1, lastname: 1, patient_id: 1, consultations: {$elemMatch: {_id: req.params.consultation_id}}})
  .then((patient) => {
    var consultation = patient.consultations[0]
    res.render('labreview', {user, patient, consultation, title: 'Lab Results - HealthMax'})
  })
  .catch((error) => {
    next(error)
  })
})
.post((req, res, next) => {
  var user = req.user
  Patients.findOne({patient_id: req.params.patient_id}, {firstname: 1, lastname: 1, patient_id: 1, consultations: {$elemMatch: {_id: req.params.consultation_id}}})
  .then((patient) => {
    var consultation = patient.consultations[0]
    consultation.otherPayment = new Array [2]
    consultation.otherPayment.push({description: req.body.prescription})
    consultation.otherPayment.push({description: req.body.tests})
    consultation.save()
    patient.save()
    res.render('labreview', {user, patient, consultation, title: 'Lab Results - HealthMax'})
  })
  .catch((error) => {
    next(error)
  })
})

patientRouter.post('/dailyhistory', function(req, res, next) {
  var today = new Date();
  var day  = today.getDate();
  var nextday = day + 1
  var month = today.getMonth()+1;
  var year = today.getFullYear();
  var date = year + '-' + month + '-' + day;
  var nextday = year + '-' + month + '-' + nextday ;
  console.log(new Date(date))
  Patients.find({'consultations.updatedAt': {$gte: date, $lte: nextday}}, {firstname: 1, lastname: 1, patient_id: 1, consultations: 1})
  .then((todayspatients) => {
    res.send(todayspatients)
  })
  .catch((error) => {
      next(error)
  })
})


module.exports = patientRouter;
