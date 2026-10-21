const Groq = require("groq-sdk");
const prisma = require("../../config/prisma");

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

exports.groqAiMain = async (req, res) => {
  try {
    const { message, chatId } = req.body;
    const userId = req.user?.userId || req.user?.id; // ← handles both cases

    console.log("userId =>", userId);
    console.log("message =>", message);

    if (!message) return res.status(400).json({ error: "Message is required" });
    if (!userId)
      return res.status(401).json({ error: "User not found in token" });

    // Resolve or create chat
    let chat;
    if (chatId) {
      chat = await prisma.chat.findFirst({ where: { id: chatId, userId } });
      if (!chat) return res.status(404).json({ error: "Chat not found" });
    } else {
      chat = await prisma.chat.create({ data: { userId } });
    }

    // Load prior messages for context
    const history = await prisma.message.findMany({
      where: { chatId: chat.id },
      orderBy: { createdAt: "asc" },
      take: 20,
    });

    const historyForGroq = history.map((m) => ({
      role: m.role === "ai" ? "assistant" : "user",
      content: m.content,
    }));

    // Call Groq
    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        ...historyForGroq,
        { role: "user", content: message },
      ],
    });

    const reply = response.choices[0].message.content;

    // Save both messages
    await prisma.message.createMany({
      data: [
        { chatId: chat.id, role: "user", content: message },
        { chatId: chat.id, role: "ai", content: reply },
      ],
    });

    // Auto-title on first message
    if (history.length === 0) {
      await prisma.chat.update({
        where: { id: chat.id },
        data: {
          title:
            message.slice(0, 50) + (message.length > 50 ? "…" : "") ||
            "New Chat",
        },
      });
    } else {
      await prisma.chat.update({
        where: { id: chat.id },
        data: { updatedAt: new Date() },
      });
    }

    return res.status(200).json({ success: true, reply, chatId: chat.id });
  } catch (err) {
    console.error("groqAiMain error =>", err.message); // ← see exact error
    console.error("FULL ERROR:", err); // ← shows full stack

    return res.status(500).json({ success: false, error: err.message });
  }
};
