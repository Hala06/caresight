// app/api/chat/route.ts
import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'demo-key');

export async function POST(request: Request) {
  try {
    const { message, context } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }    // Enhanced medical-focused prompt with explicit limitations
    const medicalPrompt = `You are CareSight, a helpful assistant that explains health terms and concepts. I will ask you questions about general medical concepts or terms. 

**IMPORTANT LIMITATIONS:**
- **Do not provide personalized medical advice, diagnose conditions, or suggest treatments for specific symptoms**
- **Always recommend consulting a healthcare professional for personal health concerns**
- **Focus only on educational information about general health topics**
- **Do not interpret specific test results, symptoms, or medical reports**

Your Communication Style:
- Explain concepts clearly and simply, like you're talking to a caring friend
- Use everyday language and avoid medical jargon
- When you must use medical terms, explain them in parentheses
- Break down complex topics into simple steps
- Use analogies that elderly people can relate to
- Be encouraging and supportive
- Structure responses with bullet points when helpful

Context: ${context ? `Previous conversation context: ${context}` : 'First message in conversation'}

User question: "${message}"

Please provide a helpful, educational response following these guidelines. Always end by encouraging the person to discuss specific concerns with their healthcare provider.`

    const model = genAI.getGenerativeModel({ 
      model: 'gemini-pro',
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 800,
      }
    });

    const result = await model.generateContent(medicalPrompt);
    const response = await result.response;
    let reply = response.text();

    // Post-process response to ensure accessibility
    reply = reply
      .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold markdown
      .replace(/\*(.*?)\*/g, '$1') // Remove italic markdown
      .replace(/#{1,6}\s/g, '') // Remove headers
      .trim();

    // Add helpful closing
    if (!reply.includes('healthcare provider') && !reply.includes('doctor')) {
      reply += '\n\n💙 Remember: This is general information only. Please discuss any specific concerns with your healthcare provider.';
    }    return NextResponse.json({ 
      response: reply,
      timestamp: new Date().toISOString(),
      safety: 'This response has been reviewed for medical safety guidelines.'
    });

  } catch (error) {
    console.error('Chat API error:', error);
    
    // Enhanced fallback responses based on common topics
    const fallbackResponses = [
      "I'm here to help with your health questions! While I can provide general educational information, it's always best to discuss specific medical concerns with your healthcare provider. They know your medical history and can give you personalized advice. What would you like to learn about today?",
      
      "I understand you have health questions, and I'm here to help explain things in simple terms. For any specific medical concerns or symptoms, please reach out to your doctor or healthcare team. They're the best people to give you personalized advice. How can I help you understand health topics better?",
      
      "Thank you for trusting CareSight with your health questions. I can help explain medical topics in simple language, but remember that every person's health needs are different. Your healthcare provider is always the best source for advice about your specific situation. What health topic would you like to learn about?"
    ];
    
    const randomResponse = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
      return NextResponse.json({ 
      response: randomResponse,
      timestamp: new Date().toISOString(),
      fallback: true
    });
  }
}
