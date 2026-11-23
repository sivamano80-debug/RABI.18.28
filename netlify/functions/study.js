exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: "Method not allowed"
    };
  }

  try {
    const { text, classLevel, style } = JSON.parse(event.body || "{}");

    if (!text || !text.trim()) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "No textbook text provided." })
      };
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "API key is not configured." })
      };
    }

    const prompt = `
You are Study Genius AI, a helpful school study assistant.

Create exam-focused study material using the textbook content provided below.

Student class: ${classLevel || "Not specified"}
Notes style: ${style || "Detailed"}

Follow this structure:

1. Chapter Name and Topic
2. Learning Objectives
3. Explanation in Easy Language
4. Important Key Points
5. Detailed Explanation of Difficult Concepts
6. Important Definitions
7. Exam-Focused Questions and Answers
8. Practice Questions (easy, medium and hard)
9. Quick Revision Summary

Make the notes clear, organized, accurate and useful for exams.
Use the supplied textbook content as the main source.
Do not invent textbook facts.

TEXTBOOK CONTENT:
${text}
`;

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }]
            }
          ],
          generationConfig: {
            temperature: 0.4,
            maxOutputTokens: 8192
          }
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return {
        statusCode: response.status,
        body: JSON.stringify({
          error: data.error?.message || "Gemini API request failed."
        })
      };
    }

    const notes =
      data.candidates?.[0]?.content?.parts
        ?.map(part => part.text || "")
        .join("\n") || "";

    if (!notes) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "No notes were generated." })
      };
    }

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ notes })
    };

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: error.message || "Something went wrong."
      })
    };
  }
};
