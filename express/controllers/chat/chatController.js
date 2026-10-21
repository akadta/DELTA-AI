const prisma = require("../../config/prisma");

// Create a new chat session
exports.createChat = async (req, res) => {
  try {
    const { userId } = req.user; // from JWT middleware
    const chat = await prisma.chat.create({
      data: { userId },
    });
    return res.status(201).json({ success: true, chat });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

// Get all chats for the user (sidebar list)
exports.getUserChats = async (req, res) => {
  try {
    const { userId } = req.user;
    const chats = await prisma.chat.findMany({
      where: { userId },
      orderBy: { updatedAt: "desc" },
      select: { id: true, title: true, updatedAt: true },
    });
    return res.status(200).json({ success: true, chats });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

// Get all messages in a chat
exports.getChatMessages = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { userId } = req.user;

    const chat = await prisma.chat.findFirst({
      where: { id: chatId, userId }, // ensure ownership
      include: { messages: { orderBy: { createdAt: "asc" } } },
    });

    if (!chat) return res.status(404).json({ error: "Chat not found" });
    return res.status(200).json({ success: true, chat });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

// Delete a chat
exports.deleteChat = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { userId } = req.user;
    await prisma.chat.deleteMany({ where: { id: chatId, userId } });
    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};
