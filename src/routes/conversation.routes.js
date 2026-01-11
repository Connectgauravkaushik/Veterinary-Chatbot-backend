const express = require("express");
const router = express.Router();
const conversationController = require("../controller/conversation.controller");


router.get("/:sessionId", conversationController.getConversation);

module.exports = router;
