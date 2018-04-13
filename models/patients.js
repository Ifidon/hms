var mongoose = require('mongoose');
require('mongoose-type-email');
var Schema = mongoose.Schema;

var prescriptionSchema = new Schema ({
  drugs: {
    type: String
  },
  cost: {
    type: String
  },
  amountPaid: {
    type: String
  },
  balance: {
    type: String
  }
});

var labSchema = new Schema ({
  tests: {
    type: String
  },
  cost: {
    type: String
  },
  amountPaid: {
    type: String
  },
  balance: {
    type: String
  }
});

var consultation = new Schema ({
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

  doctorsNote: {
    type: String
  },

  prescription:prescriptionSchema,

  labInvestigation:labSchema
}, {
  timestamps: true
});

var PatientSchema = new Schema ({
  patient_id: {
    type: Number,
    required: true,
    unique: true
  },

  firstname: {
    type: String,
    required: true
  },

  lastname: {
    type: String,
    required: true,
    uppercase: true
  },

  address: {
    type: String
  },

  email: {
    type: String
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
