// app/api/upload/route.ts
import { NextResponse } from "next/server";
import Tesseract from "tesseract.js";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) return NextResponse.json(
      { error: "No file uploaded" }, 
      { status: 400 }
    );

    // Convert file to base64
    const buffer = await file.arrayBuffer();
    const base64 = Buffer.from(buffer).toString('base64');
    const image = `data:${file.type};base64,${base64}`;

    // OCR Processing
    const { data: { text } } = await Tesseract.recognize(image, 'eng+medical', {
      logger: m => console.log(m.status)
    });    // Enhanced Medical Text Simplification with Gemini Pro
    const model = genAI.getGenerativeModel({ 
      model: "gemini-pro",
      generationConfig: {
        temperature: 0.3, // Lower temperature for more consistent medical explanations
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1000,
      }
    });

    const medicalPrompt = `Rewrite the following medical text in plain English for a layperson. Explain terms clearly. **Do not offer medical advice, diagnoses, or treatment recommendations.** Keep the tone supportive and easy to understand.

    Instructions:
    - Use simple, everyday words instead of medical jargon
    - Explain what each term means in parentheses
    - Break down complex sentences into shorter ones
    - Use bullet points for lists and instructions
    - Add reassuring language where appropriate
    - Highlight important actions or warnings clearly
    - Structure the response for easy reading

    Medical Text:
    "${text}"

    Simplified Text:`;

    const result = await model.generateContent(medicalPrompt);
    const response = await result.response;
    const simplified = response.text();

    return NextResponse.json({ original: text, simplified });
    
  } catch (error) {
    console.error("Processing error:", error);
    return NextResponse.json(
      { error: "Medical document processing failed" },
      { status: 500 }
    );
  }
}