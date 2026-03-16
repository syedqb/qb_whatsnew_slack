import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

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

Commits:
${commits}
`;

  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "user",
        content: prompt
      }
    ]
  });

  return response.choices[0].message.content;
}