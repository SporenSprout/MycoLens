import { GoogleGenAI, Type } from "@google/genai";
import type { IdentificationResult } from '../types';

// In a real application, this service would make a fetch call to a secure backend proxy.
// The backend would then make the call to the Gemini API with a hidden API key.
// For this self-contained example, we call the Gemini API directly from the client.
// This is NOT secure for a production application as it exposes the API key.
const API_KEY = process.env.API_KEY;

if (!API_KEY) {
    throw new Error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const model = 'gemini-2.5-flash';

const responseSchema = {
    type: Type.OBJECT,
    properties: {
        name: {
            type: Type.STRING,
            description: "The common and scientific name of the mushroom (e.g., 'Fly Agaric (Amanita muscaria)'). If unknown, state 'Unknown'."
        },
        confidence: {
            type: Type.NUMBER,
            description: "A confidence score from 0.0 to 1.0 representing the model's certainty in the identification."
        },
        summary: {
            type: Type.STRING,
            description: "A brief, educational summary (2-3 sentences) about the identified mushroom, including key characteristics, habitat, or interesting facts. If unknown, state that no information is available."
        },
        disclaimer: {
            type: Type.STRING,
            description: "A stern, clear warning: 'Identification is not 100% accurate. Never consume a mushroom based on this app's identification. Misidentification can be lethal.'"
        }
    },
    required: ["name", "confidence", "summary", "disclaimer"],
};


export async function identifyMushroom(base64Image: string): Promise<IdentificationResult> {
    const prompt = "Analyze the provided image to identify the mushroom. Provide its common and scientific name, your confidence level, a brief educational summary, and the critical safety disclaimer. If the image is not a mushroom or is unidentifiable, please indicate that clearly.";

    const imagePart = {
        inlineData: {
            mimeType: 'image/jpeg',
            data: base64Image,
        },
    };

    const textPart = {
        text: prompt
    };
    
    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: { parts: [imagePart, textPart] },
            config: {
                responseMimeType: "application/json",
                responseSchema: responseSchema,
                temperature: 0.2, // Lower temperature for more deterministic identification
            },
        });

        const jsonText = response.text.trim();
        const result = JSON.parse(jsonText) as IdentificationResult;

        // Basic validation
        if (typeof result.name !== 'string' || typeof result.confidence !== 'number' || typeof result.disclaimer !== 'string' || typeof result.summary !== 'string') {
            throw new Error("Invalid response structure from API.");
        }
        
        result.confidence = Math.max(0, Math.min(1, result.confidence)); // Clamp confidence between 0 and 1

        return result;

    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw new Error("Failed to get a valid response from the AI model.");
    }
}