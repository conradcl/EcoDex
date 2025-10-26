import express from "express";
import "dotenv/config";
import { GoogleGenerativeAI } from "@google/generative-ai";

const app = express();
const port = 3000;

app.use(express.static("public"));
app.use('/images', express.static('images'));

app.use(express.json({ limit: "10mb" })); // allow large image uploads

// --- Gemini API route ---
app.post("/api/gemini", async (req, res) => {
  try {
    const { prompt, imageBase64 } = req.body;
    console.log(" Received request for:", prompt);

    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    // --- Build combined text + image request ---
    const result = await model.generateContent({
      contents: [
        {
          parts: [
            {
              text: `${prompt}. Please respond ONLY in pure JSON format like:
              {
                "common_name": "Eastern Gray Squirrel",
                "species_name": "Sciurus carolinensis",
                "status": "Least Concern",
                "description": "A medium-sized tree squirrel native to eastern North America."
              }`,
            },
            imageBase64
              ? {
                  inlineData: {
                    mimeType: "image/jpeg",
                    data: imageBase64,
                  },
                }
              : null,
          ].filter(Boolean),
        },
      ],
    });

    const response = await result.response;
    const text = response.text();

    // --- ðŸ§¹ Clean and parse Gemini output ---
    let cleaned = text
      .replace(/```json/i, "") // remove ```json
      .replace(/```/g, "") // remove ```
      .trim();

    // Remove any extra non-JSON text (keep between { ... })
    const jsonMatch = cleaned.match(/{[\s\S]*}/);
    if (jsonMatch) cleaned = jsonMatch[0];

    let parsed;
    try {
      parsed = JSON.parse(cleaned);
    } catch (e) {
      console.warn("âš ï¸ Failed to parse JSON. Returning raw text instead.");
      parsed = {
        common_name: "Unknown",
        species_name: "",
        status: "",
        description: text,
      };
    }

    res.json(parsed);
  } catch (error) {
    console.error("âŒ Gemini error:", error);
    res.status(500).json({ error: error.message || "Gemini request failed" });
  }
});
app.listen(port, () =>
  console.log(`âœ… EcoDex server running at http://localhost:${port}`)
);
