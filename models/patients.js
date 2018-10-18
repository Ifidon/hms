var mongoose = require('mongoose');
// require('mongoose-type-email');
var Schema = mongoose.Schema;

var prescriptionSchema = new Schema ({
  drugs: {
    type: String,
    // default: "No Entry "
  },
  cost: {
    type: Number,
    // default: ""
  },
  amountPaid: {
    type: Number,
    // default: ""
  },
  balance: {
    type: Number,
    // default: ""
  }
});

var labSchema = new Schema ({
  tests: {
    type: String,
    // default: "No Entry"
  },
  cost: {
    type: Number,
    // default: ""
  },
  amountPaid: {
    type: Number,
    // default: ""
  },
  balance: {
    type: Number,
    // default: ""
  },
  findings: {
    type: String,
    // default: "No Entry"
  },
  attachment: {
    type: String,
    default: ""
  }
});

var otherPaymentSchema = new Schema ({
  description: {
    type: String,
    // default: "No Entry"
  },
  cost: {
    type: Number,
    // default: ""
  },
  amountPaid: {
    type: Number,
    // default: ""
  },
  balance: {
    type: Number,
    // default: ""
  }, 
  }, {
    timestamps: true
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

  labInvestigation:labSchema,

  otherPayment: [otherPaymentSchema]
}, {
  timestamps: true
});

var PatientSchema = new Schema ({
  patient_id: {
    type: String,
    required: true,
    unique: true,
    minlength: 6,
  },

  photourl: {
    type: String,
    default: './public/images/defaultuser.jpg'
  },

  picture: {
    data: Buffer,
    contentType: String
  },

  firstname: {
    type: String,
    required: true,
    uppercase: true
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
    // required: true
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
  
  totalDue: {
    type: String,
    // default: 0
  },
  totalPaid: {
    type: String,
    // default: 0
  },
  totalBalance: {
    type: String,
    // default: 0
  },
  payment: [otherPaymentSchema],

  consultations:[consultation]
}, {
  timestamps: true
});

var Patients = mongoose.model('Patient', PatientSchema);
module.exports = Patients;
