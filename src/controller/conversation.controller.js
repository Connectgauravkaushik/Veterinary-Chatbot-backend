const Conversation = require("../models/conversationModel");

exports.getConversation = async (req, res) => {
    try {
        const { sessionId } = req.params;
        const convo = await Conversation.findOne({ sessionId });

        if (!convo) {
            return res.status(404).json({ error: "Conversation not found" });
        }

        res.status(200).json({
            sessionId: convo.sessionId,
            messages: convo.messages,
            context: convo.context,
        })
    } catch (error) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch conversation" });
    }
}
