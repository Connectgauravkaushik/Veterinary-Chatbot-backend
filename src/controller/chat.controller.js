const conversation = require("../models/conversationModel");
const aiService = require("../services/ai.service");
const bookingService = require("../services/booking.service");


exports.sendMessage = async (req, res) => {
    try {
        let { sessionId, message, context } = req.body;

        if (!message) {
            return res.status(400).json({ error: "Message is required" });
        }
        let convo = await conversation.findOne({ sessionId });

        if (!convo) {
            convo = await conversation.create({
                sessionId,
                context: context || null,
                messages: [],
                bookingState: null
            });
        }

        if (!convo.messages) {
            convo.messages = [];
        }

        convo.messages.push({ role: "user", text: message });

        let result;

        if (bookingService.isBookingIntent(message)) {
            result = await bookingService.handleBooking(convo, message);
        } else if (convo.bookingState) {
            result = await bookingService.handleBooking(convo, message, true);
        } else {
            const reply = await aiService.getVetReply(message);
            result = { reply, bookingState: null };
        }

        convo.messages.push({ role: "bot", text: result.reply });
        convo.bookingState = result.bookingState;

        await convo.save();

        res.json({
            reply: result.reply,
            bookingState: result.bookingState
        });


    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Chat failed" });
    }
}
