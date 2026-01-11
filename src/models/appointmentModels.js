const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
  sessionId: {
    type: String,
    required: true,
    index: true
  },
  ownerName: {
    type: String,
    required: true
  },
  petName: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  dateTime: {
    type: Date,
    required: true
  },
  source: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});

module.exports = mongoose.model("Appointment", appointmentSchema);


const appointment = mongoose.model("Appointment", appointmentSchema);
module.exports = appointment;
