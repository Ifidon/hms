var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var consultation = new Schema({

  weight: {
    type: String,
    required: true
  },

  bloodPressure: {
    type: String,
    required: true
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

var Consultations = mongoose.model('Consultation', consultations);
module.exports = Consulations;
