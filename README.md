# Study Genius AI Secure Netlify project

## Deploy
1. Create a Gemini API key in Google AI Studio. Keep it private.
2. Deploy this project to Netlify (Git-based deployment is recommended).
3. In Netlify site configuration, add Environment variable `GEMINI_API_KEY` and set its value to your API key.
4. Save and trigger a fresh deployment.

The HTML extracts PDF text in-browser. The Netlify function sends it to Gemini. Scanned PDFs require OCR, not included. This prototype truncates combined text to 120,000 characters. Verify notes against your textbook.
