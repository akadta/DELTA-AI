// routes/groqAiRoutes.js
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const groqAiController = require("../controllers/groq/groqAiController");
const chatController = require("../controllers/chat/chatController");

router.post("/chat", auth, groqAiController.groqAiMain);
router.get("/chats", auth, chatController.getUserChats);
router.post("/chats", auth, chatController.createChat);
router.get("/chats/:chatId", auth, chatController.getChatMessages);
router.delete("/chats/:chatId", auth, chatController.deleteChat);

module.exports = router;
