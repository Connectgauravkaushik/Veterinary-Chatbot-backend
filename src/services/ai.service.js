const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const SYSTEM_PROMPT = `
You are a veterinary assistant.

Your job:
- Answer questions about pets, animals, and veterinary topics.
- Understand follow-up questions using previous context.
- If a question is unclear, ask for clarification.
- If the topic is clearly NOT about animals or pets, reply:
  "I'm a veterinary assistant and can only answer pet-related questions."

Be helpful, short, and practical.
`;

let chatHistory = [];

async function getVetReply(userMessage) {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash-lite",
    });

    chatHistory.push({ role: "user", text: userMessage });

    const historyText = chatHistory
      .map((m) => `${m.role === "user" ? "User" : "Bot"}: ${m.text}`)
      .join("\n");

    const prompt = `
${SYSTEM_PROMPT}

Conversation so far:
${historyText}

Bot:
`;

    const result = await model.generateContent(prompt);
    const text =
      result.response.text() || "Sorry, I couldn't generate a response.";

    // Save bot reply
    chatHistory.push({ role: "bot", text });

    return text;
  } catch (err) {
    console.error("Gemini Error:", err.message);
    return "Sorry, I'm having trouble answering right now.";
  }
}

module.exports = { getVetReply };
