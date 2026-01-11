const Appointment = require("../models/appointmentModels");

function isBookingIntent(message) {
  const keywords = ["book", "appointment", "schedule", "visit", "vet"];
  const lower = message.toLowerCase();
  return keywords.some(k => lower.includes(k));
}

function isValidPhone(phone) {
  return /^[0-9]{10}$/.test(phone);
}

function isValidDate(date) {
  return !isNaN(new Date(date).getTime());
}

async function handleBooking(convo, message, isContinuing = false) {
  const lower = message.toLowerCase();

  const looksLikeQuestion = lower.includes("?") || lower.includes("what") || lower.includes("how");

  if (isContinuing && looksLikeQuestion && !isBookingIntent(message)) {
    return {
      reply: await require("./ai.service").getVetReply(message),
      bookingState: convo.bookingState
    };
  }

  if (!convo.bookingState || !convo.bookingState.step) {
    convo.bookingState = { step: "ownerName", data: {} };
    return { reply: "Sure! What is the pet owner's name?", bookingState: convo.bookingState };
  }

  const state = convo.bookingState;

  switch (state.step) {
    case "ownerName":
      state.data.ownerName = message;
      state.step = "petName";
      return { reply: "What is your pet's name?", bookingState: state };

    case "petName":
      state.data.petName = message;
      state.step = "phone";
      return { reply: "Please enter your 10-digit phone number.", bookingState: state };

    case "phone":
      if (!isValidPhone(message)) {
        return { reply: "Please enter a valid 10-digit phone number.", bookingState: state };
      }
      state.data.phone = message;
      state.step = "dateTime";
      return { reply: "Preferred date & time? (e.g. 2026-01-15 10:30)", bookingState: state };

    case "dateTime":
      if (!isValidDate(message)) {
        return { reply: "Please enter a valid date and time.", bookingState: state };
      }
      state.data.dateTime = new Date(message);
      state.step = "confirm";
      return {
        reply: `Please confirm:\nOwner: ${state.data.ownerName}\nPet: ${state.data.petName}\nPhone: ${state.data.phone}\nDate: ${state.data.dateTime}\nType "confirm" to book.`,
        bookingState: state
      };

    case "confirm":
      if (message.toLowerCase() !== "confirm") {
        return { reply: "Type 'confirm' to complete booking.", bookingState: state };
      }

      await Appointment.create({
        sessionId: convo.sessionId,
        ...state.data
      });

      convo.bookingState = null;
      return { reply: "✅ Your appointment is booked successfully!", bookingState: null };

    default:
      convo.bookingState = null;
      return { reply: "Booking reset. Say 'book appointment' to start again.", bookingState: null };
  }
}

module.exports = {
  isBookingIntent,
  handleBooking
};
