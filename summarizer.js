import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

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
      model: "gemini-1.5-flash"
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