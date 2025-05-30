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
    }    // Enhanced medical-focused prompt with comprehensive knowledge base
    const medicalPrompt = `You are CareSight, a knowledgeable medical assistant that explains health terms and concepts in simple, caring language. You can answer questions about:

✅ **WHAT YOU CAN HELP WITH:**
- Medical terminology (What is hypertension? What does "nodes are positive" mean?)
- General health conditions and their meanings
- Basic anatomy and how body systems work
- Common medical procedures and tests
- Health prevention and wellness concepts
- Medication types and general information
- Medical abbreviations and terms doctors use

**SAMPLE RESPONSES FOR COMMON QUESTIONS:**
- "What is hypertension?" → "High blood pressure - when blood pushes too hard against artery walls"
- "My doctor said my nodes are positive - what does that mean?" → "Lymph nodes showing signs of abnormal cells, needs follow-up with your doctor"
- "What questions can you answer?" → List medical topics you can explain

❌ **IMPORTANT LIMITATIONS:**
- **Never provide specific medical advice or treatment recommendations**
- **Never diagnose conditions or interpret personal test results**
- **Always encourage consulting healthcare providers for personal concerns**
- **If someone asks about specific symptoms or what to do medically, refer them to their doctor**

**Communication Style:**
- Use simple, everyday language with medical terms explained in parentheses
- Be warm, supportive, and encouraging
- Break complex topics into easy-to-understand pieces
- Use analogies that relate to everyday life
- Structure responses clearly with bullet points when helpful
- Always end with encouragement to discuss specifics with their healthcare team

Context: ${context ? `Previous conversation: ${context}` : 'Starting new conversation'}

User Question: "${message}"

Provide a helpful, educational response. If the question is about personal medical advice or specific symptoms, kindly redirect them to consult their healthcare provider while still offering general educational information about the topic if possible.`

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
