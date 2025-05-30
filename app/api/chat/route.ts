// app/api/chat/route.ts
import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(request: Request) {
  let message = '';
  let context = '';
  
  try {
    const body = await request.json();
    message = body.message;
    context = body.context;

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Check if API key is available
    if (!process.env.GEMINI_API_KEY) {
      return getIntelligentFallbackResponse(message);
    }

    // Enhanced medical-focused prompt for comprehensive health education
    const medicalPrompt = `You are CareSight, a knowledgeable and caring medical education assistant. Your role is to explain health topics in simple, accessible language while being responsible about medical advice.

CORE PRINCIPLES:
- Provide clear, educational information about medical topics
- Use simple language that elderly and diverse users can understand
- Be warm, supportive, and encouraging
- Give practical information when appropriate
- Always distinguish between education and personal medical advice

WHAT YOU CAN AND SHOULD DO:
✅ Explain medical conditions (What is high blood pressure? What is diabetes?)
✅ Define medical terms and abbreviations (What is ALOC? What does "nodes are positive" mean?)
✅ Describe common symptoms and what they generally indicate
✅ Explain medical procedures and tests in simple terms
✅ Provide general guidance on when to seek medical care
✅ Offer wellness and prevention information
✅ Explain medication types and how they generally work
✅ Help users understand what questions to ask their doctor

SAMPLE EXPERT RESPONSES:
Q: "What is high blood pressure?"
A: "High blood pressure (hypertension) means your blood pushes too hard against your artery walls. Think of it like water pressure in a garden hose - if the pressure is too high, it can damage the hose over time. Normal blood pressure is usually around 120/80. High blood pressure can be managed with medication, diet changes, and exercise."

Q: "When should I call my doctor?"
A: "You should call your doctor if you experience: severe chest pain, difficulty breathing, sudden severe headache, signs of stroke (face drooping, arm weakness, speech problems), high fever that won't break, severe abdominal pain, or any symptoms that worry you significantly. Trust your instincts - if something feels seriously wrong, it's always better to call."

Q: "What is ALOC?"
A: "ALOC stands for 'Altered Level of Consciousness.' It means someone is not as alert or aware as normal. This could range from being drowsy or confused to being completely unresponsive. It's a medical concern that doctors take seriously because it can indicate various conditions affecting the brain."

COMMUNICATION STYLE:
- Use analogies and everyday comparisons
- Break complex topics into simple pieces
- Be encouraging and reassuring when appropriate
- Structure responses clearly
- End with practical next steps when relevant

BOUNDARIES:
- For personal symptoms: Provide education but encourage medical consultation
- For serious symptoms: Clearly advise seeking immediate medical care
- For medication questions: Explain general concepts but defer to healthcare providers

Context: ${context ? `Previous conversation: ${context}` : 'New conversation'}

User Question: "${message}"

Provide a helpful, educational response that balances being informative with being medically responsible.`;

    const model = genAI.getGenerativeModel({ 
      model: 'gemini-pro',
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1000,
      }
    });

    const result = await model.generateContent(medicalPrompt);
    const response = await result.response;
    let reply = response.text();

    // Clean up formatting for better accessibility
    reply = reply
      .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold markdown
      .replace(/\*(.*?)\*/g, '$1') // Remove italic markdown
      .replace(/#{1,6}\s/g, '') // Remove headers
      .trim();

    return NextResponse.json({ 
      response: reply,
      timestamp: new Date().toISOString(),
      source: 'gemini-ai'
    });

  } catch (error) {
    console.error('Chat API error:', error);
    return getIntelligentFallbackResponse(message);
  }
}

function getIntelligentFallbackResponse(message: string): NextResponse {
  const lowerMessage = message.toLowerCase();
  
  // Intelligent fallback responses based on question content
  if (lowerMessage.includes('blood pressure') || lowerMessage.includes('hypertension')) {
    return NextResponse.json({
      response: "High blood pressure (hypertension) means your blood pushes too hard against your artery walls - like water pressure being too high in a garden hose. Normal is usually around 120/80. It can often be managed with lifestyle changes and medication. Your doctor can check this easily and help you manage it if needed.",
      timestamp: new Date().toISOString(),
      source: 'fallback'
    });
  }
  
  if (lowerMessage.includes('when') && (lowerMessage.includes('call') || lowerMessage.includes('doctor') || lowerMessage.includes('emergency'))) {
    return NextResponse.json({
      response: "You should call your doctor for: severe chest pain, difficulty breathing, sudden severe headache, signs of stroke (face drooping, arm weakness, speech problems), high fever, severe abdominal pain, or any symptoms that seriously worry you. Call 911 for life-threatening emergencies. Trust your instincts - if something feels seriously wrong, it's better to call.",
      timestamp: new Date().toISOString(),
      source: 'fallback'
    });
  }
  
  if (lowerMessage.includes('aloc')) {
    return NextResponse.json({
      response: "ALOC stands for 'Altered Level of Consciousness.' It means someone is not as alert or aware as normal - they might be drowsy, confused, or unresponsive. This is something doctors take seriously because it can indicate various conditions affecting the brain. If someone has a significant change in their level of consciousness, they should get medical attention.",
      timestamp: new Date().toISOString(),
      source: 'fallback'
    });
  }
  
  if (lowerMessage.includes('diabetes')) {
    return NextResponse.json({
      response: "Diabetes is when your body has trouble controlling blood sugar levels. Think of it like your body's sugar processing system not working properly. There are two main types: Type 1 (body doesn't make insulin) and Type 2 (body doesn't use insulin well). It can be managed with diet, exercise, and sometimes medication. Regular monitoring and working with your healthcare team is important.",
      timestamp: new Date().toISOString(),
      source: 'fallback'
    });
  }
  
  if (lowerMessage.includes('what is') || lowerMessage.includes('what does') || lowerMessage.includes('meaning')) {
    return NextResponse.json({
      response: "I'd be happy to help explain medical terms and conditions! I can help you understand things like medical conditions, common symptoms, procedures, and when to seek care. Could you tell me the specific medical term or condition you'd like me to explain? I'll break it down in simple, easy-to-understand language.",
      timestamp: new Date().toISOString(),
      source: 'fallback'
    });
  }
  
  // Default helpful response
  return NextResponse.json({
    response: "I'm here to help explain medical topics in simple terms! I can help you understand medical conditions, symptoms, procedures, medications, and when to seek care. What specific health topic would you like me to explain? Feel free to ask about things like 'What is high blood pressure?' or 'When should I call my doctor?'",
    timestamp: new Date().toISOString(),
    source: 'fallback'
  });
}
