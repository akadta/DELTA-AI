// const OpenAI = require("openai");

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

// exports.openAiMain = async (req, res) => {
//   try {
//     const { message } = req.body;

//     if (!message) {
//       return res.status(400).json({ error: "Message is required" });
//     }

//     const response = await openai.chat.completions.create({
//       model: "gpt-4o-mini", // cheap + fast for testing
//       messages: [
//         { role: "system", content: "You are a helpful assistant." },
//         { role: "user", content: message },
//       ],
//       max_tokens: 500,
//     });

//     const reply = response.choices[0].message.content;

//     return res.status(200).json({
//       success: true,
//       reply,
//     });
//   } catch (err) {
//     return res.status(500).json({
//       success: false,
//       error: err.message,
//     });
//   }
// };
