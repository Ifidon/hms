var mongoose = require('mongoose');
require('mongoose-type-email');
var Schema = mongoose.Schema;

var consultation = new Schema ({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient'
  },

  weight: {
    type: String,
    required: true
  },

  bloodPressure: {
    type: String,
    required: true
  },

  heartRate: {
    type: String
  },

  temperature: {
    type: String,
    required: true
  },

  doctorNote: {
    type: String
  },

  prescription: {
    type: String
  },

  labInvestigation:{
    type: String
  }
}, {
  timestamps: true
});

var PatientSchema = new Schema ({
  patient_id: {
    type: Number,
    required: true,
    index: true
  },

  firstname: {
    type: String,
    required: true
  },

  lastname: {
    type: String,
    required: true
    // uppercase: true
  },

  address: {
    type: String
  },

  email: {
    type: mongoose.SchemaTypes.Email
  },

  phone: {
    type: String
  },

  dob: {
    type: Date,
    required: true
  },

  nokName: {
    type: String
  },

  nokPhone: {
    type: String
  },

  nokAddress: {
    type: String
  },

  nokRelationship: {
    type: String
  },
  consultations:[consultation]
}, {
  timestamps: true
});

var Patients = mongoose.model('Patient', PatientSchema);
module.exports = Patients;
