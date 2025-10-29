require('dotenv').config();
const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

/**
 * Test function to verify OpenAI connection
 */
async function testOpenAI() {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: "write a haiku about ai"
        }
      ]
    });

    console.log(response.choices[0].message.content);
  } catch (error) {
    console.error('OpenAI Error:', error.message);
  }
}

testOpenAI();