const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const SYSTEM_PROMPT = `
You are a veterinary assistant.
Answer ONLY veterinary-related questions:
- pet care
- vaccines
- food & diet
- illnesses
- prevention

If question is not veterinary-related, reply:
"I'm a veterinary assistant and can only answer pet-related questions."
`;

async function getVetReply(userMessage) {
  try {
    const model = genAI.getGenerativeModel({
      model: "	gemini-2.5-flash-lite"
    });

    const prompt = `${SYSTEM_PROMPT}\nUser: ${userMessage}\nBot:`;
    const result = await model.generateContent(prompt);
    const text = result.response.text();

    return text || "Sorry, I couldn't generate a response.";
  } catch (err) {
    console.error("Gemini Error:", err.message);
    return "Sorry, I'm having trouble answering right now.";
  }
}

module.exports = { getVetReply };
