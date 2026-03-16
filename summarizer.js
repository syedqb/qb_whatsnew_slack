import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function testGeminiModel(modelName = "gemini-1.5-flash") {
  try {

    console.log("Testing model:", modelName);

    const model = genAI.getGenerativeModel({
      model: modelName
    });

    const result = await model.generateContent("Say hello in one sentence.");

    const response = await result.response;
    const text = response.text();

    console.log("✅ Model working:", modelName);
    console.log("Response:", text);

  } catch (err) {

    console.error("❌ Model failed:", modelName);
    console.error(err);

  }
}

export async function summarize(commits) {

  const prompt = `
You are generating release notes for QA and stakeholders.

Categorize commits into:

🚀 New Features
🐞 Bug Fixes
⚡ Improvements
🔧 Technical Changes
🧪 QA Notes
⚠️ Potential Impact

Use simple language.
Combine similar commits.

Commits:
${commits}
`;

  try {

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash"
    });

    const result = await model.generateContent(prompt);

    const response = await result.response;

    return response.text();

  } catch (err) {

    console.error("Gemini error:", err);

    return `⚠️ AI summary failed.

Raw commits:
${commits}`;
  }
}