const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ["user", "bot"],
    required: true
  },
  text: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const bookingStateSchema = new mongoose.Schema({
  step: {
    type: String,
    enum: ["ownerName", "petName", "phone", "dateTime", "confirm", "done"],
    default: null
  },
  data: {
    ownerName: String,
    petName: String,
    phone: String,
    dateTime: Date
  }
});

const conversationSchema = new mongoose.Schema({
  sessionId: { type: String, required: true, unique: true },
  context: { type: Object, default: null },
  messages: {
    type: [messageSchema],
    default: []
  },
  bookingState: {
    type: bookingStateSchema,
    default: null
  }
}, { timestamps: true });


const conversation = mongoose.model("Conversation", conversationSchema);

module.exports = conversation;